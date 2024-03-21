import React, { useEffect, useState } from 'react'
import { Button, Container, Nav, NavDropdown, Navbar, Offcanvas } from 'react-bootstrap'
import styles from "./Navigation.module.css"
import { onAuthStateChanged } from 'firebase/auth';
import { authUser } from '../../../backend/autharization';
import { Link } from 'react-router-dom';

function Profile({ show, handleClose, photo }) {
    const handleSignout = () => {
        authUser.signOut()
    }
    return (
        <>
            <Offcanvas show={show} onHide={handleClose} placement='end' scroll>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><img alt='pp' src={photo} className='rounded' width={50} />{authUser.currentUser.displayName}</Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                    <Link to='/profile' onClick={handleClose}>Your Profile</Link>
                    <hr />
                    <Button onClick={handleSignout}>Sign out</Button>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

function NavigationBar({ handleSigninButton }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authUser, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);
    let photo = ''
    try {
        if (authUser.currentUser.photoURL) {
            photo = authUser.currentUser.photoURL
        }
        else {
            photo = '/sample/profile.svg'
        }

    } catch (e) {
        console.log(e)
    }

    return (
        <>
            <Navbar fixed='top' expand="md" className={styles.navigationBarContainer}>
                <Container className='ml-4'>
                    <Navbar.Brand href="/" className='m-0'>YarlProps</Navbar.Brand >
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav.Link><img src='mode/sun.svg' width={30} /></Nav.Link>
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title="Categories" id="basic-nav-dropdown" >
                                <NavDropdown.Item >Products</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item >
                                    Product2
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item >Services</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item >
                                    Service 1
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href='/guide'>Guide</Nav.Link>
                            <Nav.Link href='/contact'>Contact</Nav.Link>
                            {user ?
                                <div className={styles.naviToggle}>
                                    <Nav.Link onClick={handleShow}><img alt='pp' src={photo} style={{ borderRadius: '100%' , width:40}} /></Nav.Link>
                                    <Profile show={show} handleClose={handleClose} photo={photo} />
                                </div>
                                :
                                <Button variant='dark' onClick={handleSigninButton}>Sign in</Button>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
        </>
    );
}

export default NavigationBar;