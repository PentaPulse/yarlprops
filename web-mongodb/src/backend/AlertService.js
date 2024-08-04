import { useTheme } from '@mui/material';
import * as React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlertService = React.createContext();

export const useAlerts = () => {
    return React.useContext(AlertService)
}

const AlertProvider = ({ children }) => {
    const theme = useTheme()

    const showAlerts = (message, type = 'info', position = 'top-right', autoClose = 5000) => {
        toast(message, {
            type,
            position,
            autoClose,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <AlertService.Provider value={showAlerts}>
            {children}
            <ToastContainer
                newestOnTop
                theme={theme.palette.mode}
                limit={2}
            />
        </AlertService.Provider>
    )
}

export default AlertProvider;