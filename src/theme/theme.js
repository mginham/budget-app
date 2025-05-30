import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    typography: {
        fontFamily: `'Verdana', 'Arial', sans-serif`,
        h1: { fontSize: '2rem', fontWeight: 700 },
        h2: { fontSize: '1.5rem', fontWeight: 600 },
        body1: { fontSize: '1rem' },
        button: {
            textTransform: 'none',
        },
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
        error: {
            main: '#f44336',
        },
        background: {
            default: '#e4decd',
        },
    },
    shape: {
        borderRadius: 5,
    },
    components: {
        MuiButton: {
            defaultProps: {
                variant: 'contained',
                size: 'medium',
                color: 'primary',
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
            },
        },
    },
})

export default theme
