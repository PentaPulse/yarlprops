import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Login, Register, Welcome } from '../common/Welcome/Welcome';
import NavigationBar from '../common/NavigationBar/NavigationBar';
import Footer from '../common/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import Container from '@mui/material/Container';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    p: 4,
    background: 'rgba( 255, 255, 255, 0.65 )',
    "box-shadow": '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    'backdrop-filter': 'blur( 11.5px )',
    '-webkit-backdrop-filter': 'blur( 11.5px )',
    'border-radius': '10px',
    textAlign:"center"
};

function Layout({ children }) {
    const [open, setOpen] = useState(false);
    const [welcome,setWelcome]=useState(false)
    const [login,setLogin]=useState(false)

    const showWelcome = () => {
        setOpen(!open);
        setWelcome(true)
    }
    const handleClose = () => {
        setOpen(!open);
    }
    const handleLoginButton=()=>{
        setLogin(true)
        setWelcome(false)
    }
    const handleRegisterButton=()=>{
        setLogin(false)
        setWelcome(false)
    }
    const handleBackButton=()=>{
        setWelcome(true)
    }

    return (
        <>
            <NavigationBar handleSigninButton={showWelcome} />
            <ToastContainer/>
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
                            {welcome?<Welcome toLogin={handleLoginButton} toRegister={handleRegisterButton}/>:(login?<Login handleBack={handleBackButton}/>:<Register handleBack={handleBackButton}/>)}
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <Container sx={{marginTop:'85px'}}>
                {children}
            </Container>
            <Footer />
        </>
    )
}

export default Layout;
