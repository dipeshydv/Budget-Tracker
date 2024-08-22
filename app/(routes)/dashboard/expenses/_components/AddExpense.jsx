"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import React, { useState } from 'react';
import { toast } from 'sonner';

function AddExpense({ budgetId, userEmail,refreshData }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const addNewExpense = async () => {
      try {
        // Ensure that name and amount are valid
        if (!name || !amount || isNaN(amount)) {
          toast.error('Please enter a valid name and amount');
          return;
        }

        // Convert amount to a number
        const amountNumber = parseFloat(amount);

        // Insert new expense into the database
        const result = await db.insert(Expenses).values({
          name: name,
          amount: amountNumber,
          budgetId: budgetId,
          createdAt: new Date()  // Use current timestamp for createdAt
        }).returning({ id: Expenses.id });  // Correct syntax to return the ID of the inserted expense

        console.log(result);
        if (result) {
          refreshData()
          toast.success('New Expense Added');
        }
      } catch (error) {
        console.error("Error adding expense:", error);
        toast.error('Failed to add new expense');
      }
    };

    return (
      <div className='border p-5 rounded-lg'>
        <h2 className='font-bold text-lg'>Add Expense</h2>
        <div className='mt-2'>
          <h2 className='text-black font-medium my-1'>Expense Name</h2>
          <Input placeholder="e.g. Suncream"
            value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>

        <div className='mt-2'>
          <h2 className='text-black font-medium my-1'>Expense Amount</h2>
          <Input placeholder="e.g. 100"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} />
        </div>
        <Button disabled={!(name && amount && !isNaN(amount))}
          onClick={addNewExpense}
          className="mt-3 w-full">Add New Expense</Button>
      </div>
    );
}

export default AddExpense;
