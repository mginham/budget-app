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
            main: '#d1701f',
        },
        error: {
            main: '#f44336',
        },
        background: {
            default: '#5ea0e1',
        },
        link: {
            main: '#1b3a57',
        },
        custom: {
            boxBackground: '#FCFCFC',
            tableHeader: '#d6dce2',
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
        MuiContainer: {
            defaultProps: {
                maxWidth: 'md',
            },
            styleOverrides: {
                root: {
                    paddingTop: '32px',
                    paddingBottom: '32px',
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: '#c9c9c9',
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    tableLayout: 'fixed',
                    minWidth: 650,
                    maxWidth: 850,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.custom.tableHeader,
                }),
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.custom.boxBackground,
                }),
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    textAlign: 'center',
                    width: '15%',
                    fontWeight: 'bold',
                },
            },
        },
    },
})

export default theme
