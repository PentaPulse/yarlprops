import React from 'react'
import { Container, Navbar, Tab, Tabs } from 'react-bootstrap'
import ProfileBoxToggle from './ProfileBoxToggle'
import Contact from './Contact';

function NavigationBar({handleSigninButton}) {
    return (
        <>
            <Navbar fixed="top" >
                <Container>
                    <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                    <Navbar.Toggle />                    
                    <Navbar.Collapse className="justify-content-end">
                    <Tabs>
                        <Tab eventKey="home" title="Home">

                        </Tab>
                        <Tab eventKey="guide" title="Guide">

                        </Tab>
                        <Tab eventKey="contact" title="Contact">
                            <Contact/>
                        </Tab>
                    </Tabs>
                        <ProfileBoxToggle handleSigninButton={handleSigninButton}/>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavigationBar;