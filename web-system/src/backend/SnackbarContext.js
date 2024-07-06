import * as React from 'react'
import { Snackbar, Alert } from '@mui/material'

const AlertService = React.createContext();

export const useAlerts = () => {
    return React.useContext(AlertService)
}

const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = React.useState({
        open: false,
        message: '',
        variety: '',
        timeout: 3000,
        vertical: 'top',
        horizontal: 'left'

    })

    const showAlerts = (message, variety = 'info', vertical = 'top', horizontal = 'left', timeout = 3000) => {
        setAlerts({ open: true, message, variety, vertical, horizontal, timeout })
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
                open={alerts.open}
                autoHideDuration={alerts.timeout}
                anchorOrigin={{ vertical:alerts.vertical, horizontal:alerts.horizontal }}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={alerts.variety}
                    sx={{ width: '100%' }}>
                    {alerts.message}
                </Alert>
            </Snackbar>
        </AlertService.Provider>
    )
}

export default AlertProvider;