import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '../../mui';

export default function PurchaseForm({
    formData,
    budgets,
    paymentMethods,
    handleChange,
    handleSubmit
}) {
    return (
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" mb={3}>
                New Purchase
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <Grid container spacing={3} columns={12}>
                    {/* Row 1 */}
                    <Grid size={12}>
                        <TextField
                            name="purchase"
                            label="Purchase"
                            value={formData.purchase}
                            onChange={handleChange}
                            required
                            size="medium"
                        />
                    </Grid>

                    {/* Row 2 */}
                    <Grid size={6}>
                        <TextField
                            type="number"
                            name="amount"
                            label="Amount ($)"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            size="medium"
                        />
                    </Grid>
                    <Grid size={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                label="Payment Method"
                            >
                                {paymentMethods.map((method) => (
                                    <MenuItem key={method.id} value={method.name}>
                                        {method.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Row 3 */}
                    <Grid size={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="line-item-label">Line Item</InputLabel>
                            <Select
                                labelId="line-item-label"
                                name="lineItem"
                                value={formData.lineItem}
                                onChange={handleChange}
                                label="Line Item"
                            >
                            {budgets.map((b) => (
                                <MenuItem key={b.id} value={b.lineItem}>
                                    {b.lineItem}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            type="datetime-local"
                            name="timestamp"
                            label="Timestamp (optional)"
                            value={formData.timestamp}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            size="medium"
                        />
                    </Grid>

                    {/* Row 4 */}
                    <Grid container size={12} justifyContent="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            sx={{ height: 50, width: "30%" }}
                        >
                            <b>Submit Purchase</b>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}
