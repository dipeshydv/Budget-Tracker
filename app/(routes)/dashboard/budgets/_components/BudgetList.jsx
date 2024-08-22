"use client";
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import { db } from '@/utils/dbConfig';
import { getTableColumns, sql, eq } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import BudgetItem from './BudgetItem';
import { useUser } from '@clerk/nextjs';

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // Fetch the budget list with a left join and aggregated data
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
        totalItems: sql`COUNT(${Expenses.id})`.mapWith(Number)
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId)) // Correct join syntax
      .where(eq(Budgets.createdBy, userEmail))
      .groupBy(Budgets.id) // Group by Budgets.id for the aggregation
      .execute(); // Ensure you call `.execute()` to run the query

    setBudgetList(result);
  }

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget
        refreshData={()=>getBudgetList()}/>
        {budgetList?.length>0? budgetList.map((budget, index) => (
          <BudgetItem key={budget.id} budget={budget} />
        ))
        :[1,2,3,4,5,6].map((item,index)=>(
          <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>

            </div>
        ))
      }
      </div>
    </div>
  );
}

export default BudgetList;
