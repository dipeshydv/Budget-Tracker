import Link from 'next/link';
import React from 'react'

function BudgetItem({ budget }) {
  // Destructure properties from the budget object
  const { icon, name, totalItems, amount, totalSpend } = budget;
  const limitExceded=amount<0?'bg-red-500': null;//my edit
  // Calculate remaining budget and percentage of the budget spent
  const remainingBudget = amount - totalSpend;
  const spendPercentage = (totalSpend / amount) * 100;

  const gradientColor = (percentage) => {
    const lightBlue = '#BFDBFE';  // Tailwind light-blue-200
    const mediumBlue = '#60A5FA'; // Tailwind blue-400
    const darkBlue = '#1D4ED8';   // Tailwind blue-700
    
    return `linear-gradient(90deg, ${lightBlue} 0%, ${mediumBlue} ${percentage}%, ${darkBlue} 100%)`;
  };

  return (
    <Link href={'/dashboard/expenses/'+budget?.id} className={`p-5  border rounded-lg
    hover:shadow-md hover:bg-blue-100 hover:text-blue-700 cursor-pointer h-[170px] ${limitExceded}`}>
        <div className='flex gap-2 items-center justify-between'>
            <div className='flex gap-2  items-center'>
                <h2 className='text-xl p-3 px-4 bg-blue-400 rounded-full'>{icon}</h2>
                <div>
                    <h2 className='text-xl font-bold'>{name}</h2>
                    <h2 className='text-sm text-gray-500'>{totalItems} Items</h2>
                </div>
            </div>
            <h2 className='text-primary text-lg font-semibold'>${amount}</h2>
        </div>

        <div className='mt-5'>
            <div className='flex justify-between text-xs text-slate-400 mb-3'>
            <div>
                    <h2 className='text-sm font-medium'>Spent</h2>
                    <h2>${totalSpend ? totalSpend.toFixed(2) : 0}</h2>
                </div>
                <div>
                    <h2 className='text-sm font-medium'>Remaining</h2>
                    <h2>${remainingBudget.toFixed(2)}</h2>
                </div>
            </div>
            <div className='w-full bg-slate-300 h-2 rounded-full mt-2'>
                <div
                  className='bg-primary h-2 rounded-full'
                  style={{ width: `${spendPercentage}%`,background: gradientColor(spendPercentage) }}
                ></div>
            </div>
        </div>
    </Link>
  )
}

export default BudgetItem;
