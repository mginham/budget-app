import {
    Button,
    TableCell,
    TableRow,
    TextField,
} from '../../mui';
import getOrdinalSuffix from '../../../utils/getOrdinalSuffix'

export default function StaticBudgetRow({
    item,
    isEditing,
    editFormData,
    onEditChange,
    onStartEdit,
    onSave,
    onCancel,
    onDelete,
    disableDelete,
}) {
    return (
        <TableRow key={item.id} hover>
            <TableCell align="center">
                {isEditing ? (
                    <TextField
                        value={editFormData.lineItem}
                        onChange={(e) =>
                            onEditChange('lineItem', e.target.value)
                        }
                        size="small"
                        sx={inputStyle}
                        fullWidth
                    />
                ) : (
                    item.lineItem
                )}
            </TableCell>
            <TableCell align="center">
                {isEditing ? (
                    <TextField
                        value={editFormData.spendingLimit}
                        type="number"
                        onChange={(e) =>
                            onEditChange('spendingLimit', e.target.value)
                        }
                        size="small"
                        sx={inputStyle}
                        inputProps={{ min: 0, step: 0.01 }}
                        fullWidth
                    />
                ) : (
                    new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                    }).format(item.spendingLimit || 0)
                )}
            </TableCell>
            <TableCell align="center">
                {isEditing ? (
                    <TextField
                        placeholder="Day"
                        value={editFormData.expectedDay || ''}
                        type="number"
                        onChange={(e) =>
                            onEditChange('expectedDay', e.target.value)
                        }
                        size="small"
                        inputProps={{ min: 1, max: 31 }}
                        sx={inputStyle}
                        fullWidth
                    />
                ) : item.expectedDay ? (
                    `${item.expectedDay}${getOrdinalSuffix(item.expectedDay)}`
                ) : (
                    '-'
                )}
            </TableCell>

            {/* Action buttons */}
            <TableCell align="center">
                <Stack direction="column" spacing={1} justifyContent="center">
                    {isEditing ? (
                        <>
                            <Button
                                onClick={onSave}
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{
                                    ...buttonStyle,
                                    border: '1px solid',
                                    borderColor: 'success.main',
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={onCancel}
                                variant="contained"
                                size="small"
                                color="warning"
                                sx={{
                                    ...buttonStyle,
                                    border: '1px solid',
                                    borderColor: 'warning.main',
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => onStartEdit(item)}
                                disabled={isEditing}
                                sx={{
                                    ...buttonStyle,
                                    border: '1px solid',
                                    borderColor: 'primary.main',
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => onDelete(item.id)}
                                disabled={isEditing || disableDelete}
                                sx={{
                                    ...buttonStyle,
                                    border: '1px solid',
                                    borderColor: 'error.main',
                                }}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </Stack>
            </TableCell>
        </TableRow>
    )
}
