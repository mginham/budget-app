import { Outlet, Link as RouterLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
    AppBar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '../../components/mui'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import React, { useState } from 'react'

export default function AppLayout({ title, children }) {
    const { user, logout } = useAuthStore()

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    return (
        <>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    mt: 2,
                }}
            >
                <Toolbar>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            maxWidth: 800,
                            mx: 'auto',
                            p: 4,
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" component="div" sx={{ flexGrow: 1 }}>
                            {title}
                        </Typography>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                            <MenuIcon fontSize="large" />
                        </IconButton>
                    </Box>
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
                </Toolbar>
            </AppBar>
            <Box p={4} maxWidth={800} mx="auto"> {/* TODO: delete border */}
                {children}
            </Box>
        </>
    )
}
