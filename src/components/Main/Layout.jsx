import React, { useState } from 'react'
//import { Modal } from 'react-bootstrap';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Signin, Signup } from '../common/sign/Sign';
import NavigationBar from '../common/NavigationBar/NavigationBar';
import Footer from '../common/Footer';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Layout({ children }) {
    const [open, setOpen] = useState(false);
    const [toggle, setToggle] = useState(true);

    const handleSigninButton = () => {
        setOpen(!open);
        setToggle(true)
    }
    const handleClose = () => {
        setOpen(!open);
    }

    const toggleSignup = () => {
        setToggle(false);
    }

    const toggleSignin = () => {
        setToggle(true)
    }
    return (
        <>
            <NavigationBar handleSigninButton={handleSigninButton} />
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
                            {toggle ? <Signin toggleSignup={toggleSignup} toggle /> : <Signup toggleSignin={toggleSignin} toggle />}
                            </Box>
                    </Fade>
                </Modal>
            </div>
            <div className='mt-5'>
                {children}
            </div>
            <Footer />
        </>
    )
}

export default Layout;
