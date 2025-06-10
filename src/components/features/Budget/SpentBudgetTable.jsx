import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '../../mui';
import dayjs from 'dayjs'

export default function BudgetTable({ budgets, spendingByLineItem, selectedMonth }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border: '1px solid', borderColor: 'divider' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell>Item</TableCell>
                        <TableCell>Assigned</TableCell>
                        <TableCell>Expected Date</TableCell>
                        <TableCell>Spent ({selectedMonth.format('MMM YYYY')})</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {budgets.map(item => (
                        <TableRow key={item.id} hover>
                            <TableCell align="center">{item.lineItem}</TableCell>
                            <TableCell align="center">
                                {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(item.spendingLimit)}
                            </TableCell>
                            <TableCell align="center">
                                {item.expectedDate ? dayjs(item.expectedDate).format('MMM D, YYYY') : '-'}
                            </TableCell>
                            <TableCell align="center">
                                {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(spendingByLineItem[item.id] || 0)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
