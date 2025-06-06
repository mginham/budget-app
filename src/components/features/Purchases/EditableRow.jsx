import {
    TextField,
    Select,
    MenuItem,
    Button,
    TableCell,
    Stack,
} from '../../mui';

export default function EditableRow({
    editingRowData,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    budgets,
    paymentMethods
}) {
    return (
        <>
            <TableCell align="center">
                <TextField
                    name="purchase"
                    value={editingRowData.purchase}
                    onChange={handleEditChange}
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: '0.875rem',
                        },
                    }}
                />
            </TableCell>
            <TableCell align="center">
                <TextField
                    name="amount"
                    type="number"
                    value={editingRowData.amount}
                    onChange={handleEditChange}
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: '0.875rem',
                        },
                    }}
                />
            </TableCell>
            <TableCell align="center">
                <Select
                    name="paymentMethod"
                    value={editingRowData.paymentMethod}
                    onChange={handleEditChange}
                    fullWidth
                    size="small"
                    sx={{ fontSize: '0.875rem' }}
                >
                    {paymentMethods.map((pm) => (
                        <MenuItem key={pm.id} value={pm.name}>{pm.name}</MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell align="center">
                <Select
                    name="lineItem"
                    value={editingRowData.lineItem}
                    onChange={handleEditChange}
                    fullWidth
                    size="small"
                    sx={{ fontSize: '0.875rem' }}
                >
                    {budgets.map((b) => (
                        <MenuItem key={b.id} value={b.lineItem}>{b.lineItem}</MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell align="center">
                <TextField
                    name="timestamp"
                    type="datetime-local"
                    value={editingRowData.timestamp}
                    onChange={handleEditChange}
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: '0.875rem',
                        },
                    }}
                />
            </TableCell>
            <TableCell align="center">
                <Stack direction="column" spacing={1} justifyContent="center">
                    <Button
                        size="small"
                        onClick={handleSaveEdit}
                        variant="contained"
                        color="success"
                        sx={{
                            border: '1px solid',
                            borderColor: 'success.main',
                            borderRadius: 2,
                            px: 2,
                            py: 0.5,
                            textTransform: 'none',
                            minWidth: 80,
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        size="small"
                        onClick={handleCancelEdit}
                        variant="contained"
                        color="warning"
                        sx={{
                            border: '1px solid',
                            borderColor: 'warning.main',
                            borderRadius: 2,
                            px: 2,
                            py: 0.5,
                            textTransform: 'none',
                            minWidth: 80,
                        }}
                    >
                        Cancel
                    </Button>
                </Stack>
            </TableCell>
        </>
    )
}
