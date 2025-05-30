import {
    Alert,
    Box,
    Breadcrumbs,
    Button as MuiButton,
    CircularProgress,
    Container as MuiContainer,
    FormControl,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField as MuiTextField,
    Typography,
} from '@mui/material';

export const Button = (props) => (
    <MuiButton variant="contained" size="medium" color="primary" {...props} />
)

export const TextField = (props) => (
    <MuiTextField variant="outlined" fullWidth size="small" {...props} />
)

export const Container = ({ children, ...props }) => (
    <MuiContainer maxWidth="md" sx={{ py: 4 }} {...props}>
        {children}
    </MuiContainer>
)

// Re-export others unchanged
export {
    Alert,
    Box,
    Breadcrumbs,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
}
