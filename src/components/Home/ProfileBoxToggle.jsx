

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