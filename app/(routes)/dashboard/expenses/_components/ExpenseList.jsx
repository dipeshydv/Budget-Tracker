import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function ExpenseList({ expensesList, refreshData }) {
  const deleteExpense = async (expense) => {
    try {
      const result = await db.delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast('Expense Deleted');
        refreshData()
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast('Failed to delete expense', { type: 'error' });
    }
  };

  return (
    <div className='mt-3'>
      <div className='grid grid-cols-4 bg-slate-200 p-2'>
        <h2>Name</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2>Action</h2>
      </div>

      {expensesList.map((expense, index) => (
        <div key={index} className='grid grid-cols-4 bg-slate-100 p-2'>
          <h2>{expense.name}</h2>
          <h2>{expense.amount}</h2>
          <h2>{expense.createdAt}</h2>
          <h2>
            <Trash
              className='text-red-500 cursor-pointer'
              onClick={() => deleteExpense(expense)}
            />
          </h2>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
