import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import styles from "../../Home.module.css"
import { onAuthStateChanged } from 'firebase/auth';
import { authUser } from '../../../../backend/autharization';

function NavigationBar({ handleSigninButton }) {
    const [user, setUser] = useState(null);
    const [photo,setPhoto]=useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authUser, (user) => {
            setUser(user);
            setPhoto(user.photoURL);
        });

        return () => {
            unsubscribe();
        };
    }, []);
    const handleSignout = () => {
        authUser.signOut();
    };
    return (
        <>
            <Navbar expand="md" className={styles.naviContainer}>
                <Container className='ml-4'>
                    <Navbar.Brand href="/" className='m-0'>YarlProps</Navbar.Brand >
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
                                    <Nav.Link>Profile</Nav.Link>
                                    <Button variant='dark' onClick={handleSignout}>Sign out</Button>
                                </div>
                                :
                                <Button variant='dark' onClick={handleSigninButton}>Sign in</Button>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <img alt='hello' src={photo} width='500px'/>
        </>
    );
}

export default NavigationBar;