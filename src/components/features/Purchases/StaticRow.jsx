import {
    Button,
    Stack,
    TableCell,
} from '../../mui';

export default function StaticRow({
    p,
    handleStartEdit,
    handleDelete,
    editingRowId,
}) {
    const disableButtons = editingRowId !== null && editingRowId !== p.id;

    return (
        <>
            <TableCell align="center">{p.purchase}</TableCell>
            <TableCell align="center">${p.amount?.toFixed(2)}</TableCell>
            <TableCell align="center">{p.paymentMethodName || 'N/A'}</TableCell>
            <TableCell align="center">{p.lineItemName}</TableCell>
            <TableCell align="center">
                {p.timestamp?.seconds
                    ? new Date(p.timestamp.seconds * 1000).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })
                    : "N/A"}
            </TableCell>
            <TableCell align="center">
                <Stack direction="column" spacing={1} justifyContent="center">
                    <Button
                        onClick={() => handleStartEdit(p)}
                        variant="contained"
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
                        disabled={disableButtons}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(p.id)}
                        variant="contained"
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
                        disabled={disableButtons}
                    >
                        Delete
                    </Button>
                </Stack>
            </TableCell>
        </>
    )
}
