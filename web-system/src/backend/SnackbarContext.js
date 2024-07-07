import * as React from 'react'
import { Snackbar, MuiAlert } from '@mui/material'

const AlertService = React.createContext();

export const useAlerts = () => {
    return React.useContext(AlertService)
}

const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = React.useState({
        open: false,
        message: '',
        variety: ''
    })

    const showAlerts = (message, variety = 'info') => {
        setAlerts({ open: true, message, variety })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlerts({ ...alerts, open: false })
    }

    return (
        <AlertService.Provider value={showAlerts}>
            {children}
            <Snackbar
                open:{alerts.open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <MuiAlert
                    onClose={handleClose}
                    severity={alerts.variety}
                    sx={{ width: '100%' }}>
                    {alerts.message}
                </MuiAlert>
            </Snackbar>
        </AlertService.Provider>
    )
}

export default AlertProvider;