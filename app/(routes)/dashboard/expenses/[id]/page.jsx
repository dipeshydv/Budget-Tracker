"use client";

import { db } from '@/utils/dbConfig';
import { getTableColumns, sql, eq, desc } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseList from '../_components/ExpenseList';
import { Button } from '@/components/ui/button';
import { PenBox, Trash } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Editbudget from '../_components/Editbudget';


function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expenseList, setExpenseList] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRouter();

  useEffect(() => {
    if (user) {
      getBudgetInfo();
      
    }
  }, [user, params.id]);  
  /**
   * get budget info
   */
  const getBudgetInfo = async () => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      if (!userEmail) {
        throw new Error("User email not available");
      }

      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
          totalItems: sql`COUNT(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId)) 
        .where(eq(Budgets.createdBy, userEmail))
        .where(eq(Budgets.id, params.id))
        .groupBy(Budgets.id) 
        .execute(); 
      if (result.length > 0) {
        setBudgetInfo(result[0]);
      } else {
        setBudgetInfo(null);  
      }
    } catch (err) {
      console.error("Error fetching budget info:", err);
      setError("Failed to fetch budget information.");
    } finally {
      setIsLoading(false);
    }
    getExpenseList();
  };

  /**
   * Get Latest Expenses
   */

  const getExpenseList = async () => {
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .orderBy(desc(Expenses.id))
        .execute();  // Ensure you call `.execute()` to run the query

      setExpenseList(result);  // Update the state with the fetched expenses
      console.log(result);
    } catch (err) {
      console.error("Error fetching expense list:", err);
      setError("Failed to fetch expense list.");
    }
  };

  

  // Ensure that the error message is cleared when the component mounts or data is fetched successfully
  useEffect(() => {
    setError(null);
  }, [user, params.id]);

  const deleteBudget=async()=>{
    const deleteExpenseResult=await db.delete(Expenses)
    .where(eq(Expenses.budgetId, params.id))
    .returning()

    if(deleteExpenseResult)
    {
      const result=await db.delete(Budgets)
    .where(eq(Budgets.id,params.id))
    .returning();
    }
    toast('Budget Deleted!');
    route.replace('/dashboard/budgets');
  
    

  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>My Expenses
       
       <div className='flex gap-2 items-center'>

       
        <Editbudget budgetInfo={budgetInfo}/>

        <AlertDialog>
  <AlertDialogTrigger asChild>
  <Button className="flex gap-2" variant="destructive"> <Trash/> Delete</Button>
  
  

  
  

  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your current budget along with expenses
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
</div>
        
      </h2>

      
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>  // Show error message if there's an error
        ) : budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <p>No budget information available.</p>  // Show a message if there's no budgetInfo
        )}
        <AddExpense 
          budgetId={params.id}
          user={user}
          refreshData={() => {
            getBudgetInfo();  // Refresh budget info
            getExpenseList();  // Refresh expense list
          }}
        />
      </div>
      <div className='mt-4'>
        <h2 className='font-bold text-lg'>Latest Expenses</h2>
        <ExpenseList expensesList={expenseList}
        refreshData={()=>getBudgetInfo()} />
      </div>
    </div>
  );
}

export default ExpensesScreen;
