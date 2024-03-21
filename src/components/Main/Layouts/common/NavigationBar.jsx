import React, { useEffect, useState } from 'react'
import { Button, Container, Nav, NavDropdown, Navbar, Spinner } from 'react-bootstrap'
import styles from "../../Home.module.css"
import { onAuthStateChanged } from 'firebase/auth';
import { authUser } from '../../../../backend/autharization';
import { useNavigate } from 'react-router-dom';

function NavigationBar({ handleSigninButton }) {
    const [user, setUser] = useState(null);
    const navigate=useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authUser, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);
    let photo=''
    try{
        if(authUser.currentUser.photoURL){
            photo = authUser.currentUser.photoURL
        }
        else{
            photo = '/sample/profile.svg'
        }
        
    }catch(e){
            console.log(e)
    }

    const handleProfilePicture=()=>{
        navigate('/profile');
    }
    const handleSignout = () => {
        authUser.signOut();
    };

    const handleLoading =()=>{
        <Spinner animation="border" role="status"/>
    }

    return (
        <>
            <Navbar fixed='top' expand="md" className={styles.myContainer}>
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
                                    <Nav.Link onClick={handleProfilePicture}><img alt='pp' src={photo} className='rounded' width={30} onLoad={handleLoading}/></Nav.Link>
                                    <Button variant='dark' onClick={handleSignout}>Sign out</Button>
                                </div>
                                :
                                <Button variant='dark' onClick={handleSigninButton}>Sign in</Button>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br/>
        </>
    );
}

export default NavigationBar;