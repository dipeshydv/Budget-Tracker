"use client";
import React, { useState, useEffect } from 'react';
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbConfig';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema'; // Import schemas
import { useUser } from '@clerk/nextjs';
import BarChartDashboard from './budgets/_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';

function Dashboard() {
    
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
        <div className='p-8'>
            <h2 className='font-bold text-3xl'>
                Welcome, {user?.fullName || 'Guest'}
            </h2>
            <p className="text-gray-500">Let's take care of your money</p>
            <CardInfo budgetList={budgetList}/>

            <div className='grid grid-cols-1 md:grid-cols-3 mt-6'>
                <div className='md:col-span-2'>
                    <BarChartDashboard
                    budgetList={budgetList}
                    />

                </div>

                {budgetList.map((budget,index) => (
          <BudgetItem budget={budget} key={budget.id} />
        ))}

            </div>
        </div>
    );
}

export default Dashboard;
