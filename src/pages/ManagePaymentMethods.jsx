import {
    Container,
    Grid,
    Paper,
    Typography,
    Breadcrumbs,
} from '../components/mui';
import { Link } from "react-router-dom"
import PaymentMethodManager from '../components/PaymentMethodManager';

export default function ManagePaymentMethods() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link to="/log-purchases" style={{ textDecoration: 'none', color: 'blue' }}>
                    Log Purchases
                </Link>
                <Typography color="text.primary">Manage Payment Methods</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Manage Payment Methods
                </Typography>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                        ← Back to Dashboard
                    </Typography>
                </Link>
            </Grid>

            {/* Form */}
            <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Typography variant="h4" mb={3}>
                    New Payment Method
                </Typography>
                <PaymentMethodManager />
            </Paper>
        </Container>
    );
}
