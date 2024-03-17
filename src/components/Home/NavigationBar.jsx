import React, { useEffect, useState } from 'react'
import { Container, Nav, NavDropdown, Navbar, NavbarOffcanvas, Tab, Tabs } from 'react-bootstrap'
import ProfileBoxToggle from './ProfileBoxToggle'
import Contact from './Contact';
import styles from "./Home.module.css"
import { authUser } from '../../backend/autharization';

function NavigationBar({ handleSigninButton, authUser }) {
    const [signed, setSigned] = useState('');

    useEffect(() => {
        // Update the signed state when the component mounts or authUser changes
        handleSignedButton();
    }, [authUser]);

    const handleSignedButton = () => {
        if (authUser) {
            setSigned('Profile');
        } else {
            setSigned('Signin');
        }
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
                                <NavDropdown.Item href="#action/3.1">Products</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.2">
                                    Product2
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.3">Services</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Service 1
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="/guide">Guide</Nav.Link>
                            <Nav.Link href="/guide">Contact</Nav.Link>
                            <Navbar.Text className='rounded btn btn-transparent' onClick={handleSigninButton}>Sign in</Navbar.Text>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavigationBar;