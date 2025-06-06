import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '../../../components/mui';
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Purchase</TableCell>
                            <TableCell>Amount ($)</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Line Item</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
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
            </TableContainer>
        </>
    )
}
