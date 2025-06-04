import React from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Breadcrumbs,
} from '../components/mui';
import { Link } from "react-router-dom"
import PaymentMethodManager from '../components/PaymentMethodManager';
import AppLayout from '../components/layout/AppLayout';

export default function ManagePaymentMethods() {
    return (
        <AppLayout title="Manage Payment Methods">
            <Container maxWidth="md" disableGutters sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                {/* <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link to="/log-purchases" style={{ textDecoration: 'none', color: 'blue' }}>
                        Log Purchases
                    </Link>
                    <Typography color="text.primary">Manage Payment Methods</Typography>
                </Breadcrumbs> */}

                {/* Form */}
                <Typography variant="h5" fontWeight="semiBold" mb={2}>
                    New Payment Method
                </Typography>
                <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                    <PaymentMethodManager />
                </Paper>
            </Container>
        </AppLayout>
    );
}
