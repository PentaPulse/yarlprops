import * as React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../backend/AuthContext';
import NavigationBar from '../components/common/NavigationBar/NavigationBar';
import { Backdrop, Box, Container, Fade, Modal } from '@mui/material';
import { Login, Register, Welcome } from '../components/common/Welcome/Welcome';
import Footer from '../components/common/Footer/Footer';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    p: 4,
    backgroundColor: 'background.paper',
    "box-shadow": '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    'backdrop-filter': 'blur( 11.5px )',
    '-webkit-backdrop-filter': 'blur( 11.5px )',
    'border-radius': '10px',
    textAlign: "center"
};

export default function PageLayout({ children, handleMode, handleDashboardState }) {
    const [open, setOpen] = React.useState(false);
    const [welcome, setWelcome] = React.useState(false)
    const [login, setLogin] = React.useState(false)
    const navigate = useNavigate();
    const {dash}=useAuth();

    const showWelcome = () => {
        setOpen(!open);
        setWelcome(true)
    }
    const handleClose = () => {
        setOpen(!open);
    }

    const closeBox = () => {
        navigate('/dashboard')
        setOpen(!open);
        window.location('/dashboard')
    }
    const handleLoginButton = () => {
        setLogin(true)
        setWelcome(false)
    }
    const handleRegisterButton = () => {
        setLogin(false)
        setWelcome(false)
    }
    const handleBackButton = () => {
        setWelcome(true)
    }
    
    return (
        <>
            {dash && <NavigationBar handleLoginButton={showWelcome} handleMode={handleMode} />}
            <div className='d-flex justify-content-center align-items-center mt-30 text-center'>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}>
                    <Fade in={open}>
                        <Box sx={style}>
                            {welcome ? <Welcome toLogin={handleLoginButton} toRegister={handleRegisterButton} closeBox={closeBox} /> : (login ? <Login handleBack={handleBackButton} closeBox={closeBox} /> : <Register handleBack={handleBackButton} closeBox={closeBox} />)}
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <Container sx={{ marginTop: '12vh' }}>
                {children}
            </Container>
            {dash && <Footer />}
        </>
    )
}
