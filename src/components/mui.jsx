import {
    AppBar,
    Alert,
    Box,
    Breadcrumbs,
    Button as MuiButton,
    CircularProgress,
    Container as MuiContainer,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Link,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table as MuiTable,
    TableBody,
    TableCell as MuiTableCell,
    TableContainer as MuiTableContainer,
    TableHead as MuiTableHead,
    TableRow as MuiTableRow,
    TextField as MuiTextField,
    Toolbar,
    Typography,
} from '@mui/material';

export const Button = (props) => (
    <MuiButton
        {...props}
    />
)

export const TextField = (props) => (
    <MuiTextField
        {...props}
    />
)

export const Container = ({ children, ...props }) => (
    <MuiContainer
        {...props}
    >
        {children}
    </MuiContainer>
)

export const Table = (props) => (
    <MuiTable
        {...props}
    >
    </MuiTable>
)

export const TableHead = (props) => (
    <MuiTableHead
        {...props}
    >
    </MuiTableHead>
)

export const TableRow = (props) => (
    <MuiTableRow
        {...props}
    >
    </MuiTableRow>
)

export const TableCell = (props) => (
    <MuiTableCell
        {...props}
    >
    </MuiTableCell>
)

export const TableContainer = (props) => (
    <MuiTableContainer
        {...props}
    >
    </MuiTableContainer>
)

// Re-export others unchanged
export {
    AppBar,
    Alert,
    Box,
    Breadcrumbs,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Link,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Select,
    Stack,
    TableBody,
    Toolbar,
    Typography,
}
