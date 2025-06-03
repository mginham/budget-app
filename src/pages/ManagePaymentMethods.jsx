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
            <Container maxWidth="md" sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                {/* <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link to="/log-purchases" style={{ textDecoration: 'none', color: 'blue' }}>
                        Log Purchases
                    </Link>
                    <Typography color="text.primary">Manage Payment Methods</Typography>
                </Breadcrumbs> */}

                {/* Form */}
                <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                    <Typography variant="h4" mb={3}>
                        New Payment Method
                    </Typography>
                    <PaymentMethodManager />
                </Paper>
            </Container>
        </AppLayout>
    );
}
