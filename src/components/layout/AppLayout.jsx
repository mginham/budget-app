import { Outlet, Link as RouterLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Divider,
    ListItemIcon,
    Stack,
} from '../../components/mui'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'

export default function AppLayout() {
    const { user, logout } = useAuthStore()

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    return (
        <Box p={4} maxWidth={800} mx="auto">
            <Stack direction="row" spacing={2} mb={3} justifyContent="space-between">
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Welcome, {user?.displayName || user?.email}!
                </Typography>
                <IconButton onClick={handleMenuOpen}>
                    <MenuIcon fontSize="large" />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem component={RouterLink} to="/dashboard" onClick={handleMenuClose}>
                        Dashboard
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/edit-budget" onClick={handleMenuClose}>
                        Edit Budget
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/log-purchases" onClick={handleMenuClose}>
                        Log Purchases
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/manage-payment-methods" onClick={handleMenuClose}>
                        Payment Methods
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Stack>

            <Outlet />
        </Box>
    )
}
