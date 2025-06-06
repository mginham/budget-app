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
                {/* TODO: Add Loading state */}
                    <>
                        {/* Form */}
                        <PaymentMethodManager />
                    </>
            </Container>
        </AppLayout>
    );
}
