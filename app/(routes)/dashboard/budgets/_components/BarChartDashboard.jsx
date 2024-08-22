import React from 'react'
import { Bar, BarChart, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts'

function BarChartDashboard({budgetList}) {
  return (
    <div className='border rounded-lg-5'>
      <h2>Activity</h2>
      <ResponsiveContainer height={300} width={'80%'}>
        <BarChart
        data={budgetList}
        margin={{
            top:7
        }}
        >
            <XAxis dataKey='name'/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey='totalSpend' stackId="a" fill='#4845d2' />
            <Bar dataKey='amount' stackId="a" fill='#C3C2FF'/>
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default BarChartDashboard