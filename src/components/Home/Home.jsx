import React, { useState } from 'react'
import NavigationBar from './NavigationBar'
import Slidshow from './Slidshow'
import { Modal } from 'react-bootstrap';
import { Signin, Signup } from '../common/sign/Sign';

function Home() {
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
                <Modal placement='top' onHide={handleClose} show={open} height={100}>
                    <Modal.Header closeButton>
                        <Modal.Title>{toggle ? <h2>Welcome back</h2> : <h2 >Join YarlRent</h2>}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {toggle ? <Signin toggleSignup={toggleSignup} toggle /> : <Signup toggleSignin={toggleSignin} toggle />}
                    </Modal.Body>
                </Modal>
            </div>
            <Slidshow />
        </>
    )
}

export default Home
