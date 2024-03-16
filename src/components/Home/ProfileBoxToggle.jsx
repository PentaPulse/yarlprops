import React from "react"
import { Navbar } from "react-bootstrap"
import {authUser} from '../../backend/autharization'

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

export default ProfileBoxToggle