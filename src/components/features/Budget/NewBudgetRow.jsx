import {
    Button,
    TableCell,
    TableRow,
    TextField,
} from '../../mui';

export default function NewBudgetRow({
    newBudget,
    onChange,
    onAdd,
    adding
}) {
    return (
        <TableRow>
            <TableCell align="center" sx={{ width: '25%' }}>
                <TextField
                    placeholder="New Item*"
                    value={newBudget.lineItem}
                    onChange={(e) => onChange('lineItem', e.target.value)}
                    size="small"
                    sx={inputStyle}
                    required
                    fullWidth
                    autoComplete="off"
                    inputProps={{ autoComplete: 'off' }}
                />
            </TableCell>
            <TableCell align="center">
                <TextField
                    placeholder="Assigned ($)*"
                    value={newBudget.spendingLimit}
                    type="number"
                    onChange={(e) => onChange('spendingLimit', e.target.value)}
                    size="small"
                    sx={inputStyle}
                    inputProps={{ min: 0, step: 0.01 }}
                    required
                    fullWidth
                />
            </TableCell>
            <TableCell align="center">
                <TextField
                    placeholder="Day (1–31)"
                    value={newBudget.expectedDay}
                    type="number"
                    onChange={(e) => onChange('expectedDay', e.target.value)}
                    size="small"
                    sx={inputStyle}
                    inputProps={{ min: 1, max: 31 }}
                    fullWidth
                />
            </TableCell>
            <TableCell align="center">
                <Button
                    onClick={onAdd}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={buttonStyle}
                    disabled={!newBudget.lineItem || !newBudget.spendingLimit || adding}
                >
                    {adding
                        ? <CircularProgress size={16} color="inherit" />
                        : 'Add'
                    }
                </Button>
            </TableCell>
        </TableRow>
    )
}
