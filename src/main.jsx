import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme/theme'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />  {/* Normalize styles and apply typography */}
            <App />
        </ThemeProvider>
  </React.StrictMode>,
)
