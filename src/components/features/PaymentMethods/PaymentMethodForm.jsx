import {
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from '../../mui';
import { useState } from 'react';

export default function PaymentMethodForm({ onAdd }) {
    const [formData, setFormData] = useState({ name: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) return
        await onAdd(formData)
        setFormData({ name: '' })
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="semiBold" mb={3}>
                New Payment Method
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2} mb={2}>
                    <TextField
                        label="Payment Method"
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                        fullWidth
                        required
                        size="medium"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ height: 50, width: "20%" }}
                    >
                        Add
                    </Button>
                </Stack>
            </form>
        </Paper>
    )
}
