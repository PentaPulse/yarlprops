import React, { useEffect, useState } from 'react'
import { Container, Navbar, Tab, Tabs } from 'react-bootstrap'
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
            <Navbar fixed="top" className={styles.naviContainer}>
                <Container>
                    <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Tabs>
                            <Tab eventKey="home" title="Home">
                                {/* Content for the Home tab */}
                            </Tab>
                            <Tab eventKey="guide" title="Guide">
                                {/* Content for the Guide tab */}
                            </Tab>
                            <Tab eventKey="contact" title="Contact">
                                <Contact />
                            </Tab>
                            <Tab eventKey='profile' title={signed}>
                                <ProfileBoxToggle handleSigninButton={handleSigninButton} />
                            </Tab>
                        </Tabs>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavigationBar;