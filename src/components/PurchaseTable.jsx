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

export default function PurchaseForm({
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

            <Table sx={{ minWidth: 650, border: '1px solid', borderColor: 'divider' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell align="center"><b>Purchase</b></TableCell>
                        <TableCell align="center"><b>Amount (%)</b></TableCell>
                        <TableCell align="center"><b>Payment Method</b></TableCell>
                        <TableCell align="center"><b>Line Item</b></TableCell>
                        <TableCell align="center"><b>Timestamp</b></TableCell>
                        <TableCell align="center"><b>Actions</b></TableCell>
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
                                {editingRowId === p.id ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="purchase"
                                                value={editingRowData.purchase}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="amount"
                                                type="number"
                                                value={editingRowData.amount}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="paymentMethod"
                                                value={editingRowData.paymentMethod}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            >
                                                {paymentMethods.map((pm) => (
                                                    <MenuItem key={pm.id} value={pm.name}>{pm.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="lineItem"
                                                value={editingRowData.lineItem}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            >
                                                {budgets.map((b) => (
                                                    <MenuItem key={b.id} value={b.lineItem}>{b.lineItem}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="timestamp"
                                                type="datetime-local"
                                                value={editingRowData.timestamp}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="small" onClick={handleSaveEdit} color="success">Save</Button>
                                            <Button size="small" onClick={handleCancelEdit} color="warning">Cancel</Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell align="center">{p.purchase}</TableCell>
                                        <TableCell align="center">${p.amount?.toFixed(2)}</TableCell>
                                        <TableCell align="center">{p.paymentMethod}</TableCell>
                                        <TableCell align="center">{p.lineItem}</TableCell>
                                        <TableCell align="center">
                                            {p.timestamp?.seconds
                                                ? new Date(p.timestamp.seconds * 1000).toLocaleString()
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button
                                                    onClick={() => handleStartEdit(p)}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: 'primary.main',
                                                        borderRadius: 2,
                                                        px: 2,
                                                        py: 0.5,
                                                        textTransform: 'none',
                                                        minWidth: 80,
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(p.id)}
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: 'error.main',
                                                        borderRadius: 2,
                                                        px: 2,
                                                        py: 0.5,
                                                        textTransform: 'none',
                                                        minWidth: 80,
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    )
}
