import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { Box, Typography } from '@mui/material'

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c',
    '#d0ed57', '#8dd1e1', '#ffbb28', '#c6b0d5', '#ff6666',
    '#66ccff', '#99cc00', '#cc99ff', '#ffcc66', '#669999',
    '#ff99cc',
]

// Custom label function to show percentage
const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`
}

export default function SpendingPieChart({ budgets, spendingByLineItem }) {
    const pieChartData = []

    let totalAssigned = 0
    let totalSpent = 0

    budgets.forEach(budget => {
        const spent = spendingByLineItem[budget.id] || 0
        if (spent > 0) {
            pieChartData.push({
                name: budget.lineItem,
                value: spent,
            })
        }
        totalAssigned += parseFloat(budget.spendingLimit)
        totalSpent += spent
    })

    const remaining = totalAssigned - totalSpent
    if (remaining > 0) {
        pieChartData.push({
            name: 'Remaining to Spend',
            value: remaining,
        })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 4,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
                maxWidth: 450,
                margin: '0 auto',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Spending Breakdown
            </Typography>
            <PieChart width={400} height={350}>
                <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={true}
                >
                    {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={value => `$${value.toFixed(2)}`} />
                <Legend />
            </PieChart>
        </Box>
    )
}
