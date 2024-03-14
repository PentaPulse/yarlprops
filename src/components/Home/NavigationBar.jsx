import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { authUser } from '../../backend/autharization'

function ProfileBoxToggle() {
    if (authUser)
        return (
            <>
                <Navbar.Text as='button'>
                    Signed in as: <a href="#login">Mark Otto</a>
                </Navbar.Text>
            </>
        )
}

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
