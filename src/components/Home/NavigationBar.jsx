import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import ProfileBoxToggle from './ProfileBoxToggle'

function NavigationBar() {
    return (
        <>
            <Navbar fixed="top" >
                <Container>
                    <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <ProfileBoxToggle />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavigationBar
