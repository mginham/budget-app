import {
    TextField,
    Select,
    MenuItem,
    Button,
    TableCell,
} from "@mui/material"

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
    )
}
