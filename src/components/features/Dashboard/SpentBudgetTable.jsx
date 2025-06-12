import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '../../mui'

export default function SpentBudgetTable({ budgets, spendingByLineItem, selectedMonth }) {
    const totalAssigned = budgets.reduce((sum, item) => sum + parseFloat(item.spendingLimit || 0), 0)
    const totalSpent = budgets.reduce((sum, item) => sum + (spendingByLineItem[item.id] || 0), 0)

    const formattedTotalAssigned = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(totalAssigned)

    const formattedTotalSpent = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(totalSpent)

    return (
        <>
            <Typography variant="h5" fontWeight="semiBold" mb={2} mt={5}>
                Your Monthly Budget
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, border: '1px solid', borderColor: 'divider' }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell sx={{ width: '25%' }}>Item</TableCell>
                            <TableCell sx={{ width: '16%' }}>Expected Date</TableCell>
                            <TableCell sx={{ width: '15%' }}>Assigned</TableCell>
                            <TableCell sx={{ width: '15%' }}>Spent ({selectedMonth.format('MMM YYYY')})</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgets.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell align="center">{item.lineItem}</TableCell>
                                <TableCell align="center">
                                    {item.expectedDay
                                        ? selectedMonth.date(item.expectedDay).format('MMM D, YYYY')
                                        : '-'}
                                </TableCell>
                                <TableCell align="center">
                                    {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(item.spendingLimit)}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        color:
                                            (spendingByLineItem[item.id] || 0) >
                                            parseFloat(item.spendingLimit)
                                                ? 'error.main'
                                                : 'inherit',
                                        fontWeight: 500,
                                    }}
                                >
                                    {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(spendingByLineItem[item.id] || 0)}
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Summary Row */}
                        <TableRow sx={{ backgroundColor: 'action.selected', borderTop: '2px solid', borderColor: '#87898a' }}>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                {formattedTotalAssigned}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    color: totalSpent > totalAssigned ? 'error.main' : 'inherit',
                                    fontWeight: 'bold',
                                }}
                            >
                                {formattedTotalSpent}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
