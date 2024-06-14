import React, { useState } from 'react'
import {Backdrop,Box,Modal,Fade,Container }from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { Login, Register, Welcome } from '../../common/Welcome/Welcome';
import NavigationBar from '../../common/NavigationBar/NavigationBar';
import Footer from '../../common/Footer/Footer';
import { useNavigate } from 'react-router-dom';

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
    textAlign:"center"
};

function Layout({ children ,handleMode}) {
    const [open, setOpen] = useState(false);
    const [welcome,setWelcome]=useState(false)
    const [login,setLogin]=useState(false)
    const [openDashborad,setOpenDashboard]=useState(false)
    const navigate = useNavigate();

    const showWelcome = () => {
        setOpen(!open);
        setWelcome(true)
    }
    const handleClose = () => {
        setOpen(!open);
    }

    const closeBox =()=>{
        navigate('/dashboard')  
        setOpen(!open);
        window.location('/dashboard')           
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
const showDashboard=()=>{
    setOpenDashboard(!openDashborad)
    sessionStorage.setItem('dash',openDashborad)
}
    return (
        <>
            {!sessionStorage.getItem('dash') && <NavigationBar handleLoginButton={showWelcome} handleMode={handleMode} showDashboard={showDashboard}/>}
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
                            {welcome?<Welcome toLogin={handleLoginButton} toRegister={handleRegisterButton} closeBox={closeBox}/>:(login?<Login handleBack={handleBackButton} closeBox={closeBox}/>:<Register handleBack={handleBackButton} closeBox={closeBox}/>)}
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <Container sx={{marginTop:'15vh'}}>
                {children}
            </Container>
            {!sessionStorage.getItem('dash') && <Footer />}
        </>
    )
}

export default Layout;
