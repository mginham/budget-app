import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '../../mui';
import dayjs from 'dayjs'

export default function BudgetTable({ budgets, spendingByLineItem, selectedMonth }) {
    const totalAssigned = budgets.reduce((sum, item) => sum + parseFloat(item.spendingLimit || 0), 0)
    const totalSpent = budgets.reduce((sum, item) => sum + (spendingByLineItem[item.id] || 0), 0)


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
                                    {item.expectedDate ? dayjs(item.expectedDate).format('MMM D, YYYY') : '-'}
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
                        <TableRow sx={{ backgroundColor: 'action.selected', borderTop: '2px solid', borderColor: 'black' }}>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(totalAssigned)}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    color: totalSpent > totalAssigned ? 'error.main' : 'inherit',
                                    fontWeight: 'bold',
                                }}
                            >
                                {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(totalSpent)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
