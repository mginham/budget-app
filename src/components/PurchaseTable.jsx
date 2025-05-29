import {
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Stack,
} from "@mui/material"
import EditableRow from "./EditableRow"
import StaticRow from "./StaticRow"

export default function PurchaseTable({
    purchases,
    editingRowId,
    editingRowData,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleStartEdit,
    handleDelete,
    budgets,
    paymentMethods
}) {
    return (
        <>
            <Typography variant="h5" fontWeight="semiBold" mb={2}>
                Logged Purchases
            </Typography>

            <Table sx={{ tableLayout: 'fixed', minWidth: 650, maxWidth: 850, border: '1px solid', borderColor: 'divider' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell align="center" sx={{ width: '15%' }}><b>Purchase</b></TableCell>
                        <TableCell align="center" sx={{ width: '15%' }}><b>Amount ($)</b></TableCell>
                        <TableCell align="center" sx={{ width: '15%' }}><b>Payment Method</b></TableCell>
                        <TableCell align="center" sx={{ width: '15%' }}><b>Line Item</b></TableCell>
                        <TableCell align="center" sx={{ width: '15%' }}><b>Timestamp</b></TableCell>
                        <TableCell align="center" sx={{ width: '15%' }}><b>Actions</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {purchases.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                No purchases logged.
                            </TableCell>
                        </TableRow>
                    ) : (
                        purchases.map((p) => (
                            <TableRow key={p.id}>
                                {editingRowId === p.id
                                    ? <EditableRow {...{ editingRowData, handleEditChange, handleSaveEdit, handleCancelEdit, budgets, paymentMethods }} />
                                    : <StaticRow {...{ p, handleStartEdit, handleDelete, editingRowId }} />
                                }
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    )
}
