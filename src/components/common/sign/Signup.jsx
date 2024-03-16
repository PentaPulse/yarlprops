import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authUser } from '../../../backend/autharization';
import { storage } from '../../../backend/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap';

function Signup({ toggleSignin }) {
    const [signupWithEmail, setSignupWithEmail] = useState(false);
    const handleSignupWithEmail = () => {
        setSignupWithEmail(!signupWithEmail);
    }
    return (
        <>
            {!signupWithEmail ? <SignupMethods toggleSignin={toggleSignin} handleSignupWithEmail={handleSignupWithEmail} /> : <SignupWithEmail handleSignupWithEmail={handleSignupWithEmail} />}
        </>
    )
}

function SignupMethods({ toggleSignin, handleSignupWithEmail }) {
    return (
        <>
            <div className="methods d-flex flex-column justify-content-center align-items-center">
                <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                    <div className="d-flex justify-content-start align-items-center w-50">
                        <img className='me-4' src="social-icons/google.svg" alt="" width={25} />
                        <span>Sign up with Google</span>
                    </div>
                </button>
                <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                    <div className="d-flex justify-content-start align-items-center w-50">
                        <img className='me-4' src="social-icons/facebook.svg" alt="" width={25} />
                        <span>Sign up with Facebook</span>
                    </div>
                </button>
                <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                    <div className="d-flex justify-content-start align-items-center w-50">
                        <img className='me-4' src="social-icons/github.svg" alt="" width={25} />
                        <span>Sign up with Github</span>
                    </div>
                </button>
                <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center' onClick={handleSignupWithEmail}>
                    <div className="d-flex justify-content-start align-items-center w-50">
                        <img className='me-4' src="social-icons/email.svg" alt="" width={25} />
                        <span>Sign up with email</span>
                    </div>
                </button>
                <button className='btn mt-4 w-100' onClick={toggleSignin}><h5> Already have account ? Lets Signin</h5></button>
            </div>
        </>
    )
}

function SignupWithEmail({ handleSignupWithEmail }) {
    const navigate = useNavigate();
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    //const [dob, setDob] = useState('');
    const [pp, setPp] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [eye, setEye] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setPp(e.target.files[0]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(authUser, email, password)
            .then((result) => {
                const user = result.user;
                const displayName = `${fName} ${lName}`;
                updateProfile(user, {
                    displayName: displayName,
                }).then(() => {
                    if (pp) {
                        const storageRef = ref(storage, `users/profilePictures/${user.uid}`);
                        uploadBytes(storageRef, pp).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((downloadURL) => {
                                updateProfile((user), {
                                    photoURL: downloadURL,
                                }).then(() => {
                                    navigate('/')
                                })
                            })
                        })
                    } else {
                        navigate('/')
                    }
                })
                navigate('/')
            }).catch((error) => {
                const errorCode = error.code;
                const errorMassage = error.massage;
                console.log(errorCode + ' : ' + errorMassage)
            })
    }
    const handleEye = () => {
        setEye(!eye);
    }
    return (
        <>
            <div className='mt-3 text-center'>
                <Form Validate onSubmit={handleSubmit}>
                    <Row >
                        <Col>
                            <FloatingLabel
                                controlId="floatingFirstName"
                                label="First name"
                                className="mb-3 text-center"
                            >
                                <Form.Control type="text" placeholder="First name" value={fName} onChange={(e) => setFName(e.target.value)} required />
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel
                                controlId="floatingLastName"
                                label="Last name"
                                className="mb-3"
                            >
                                <Form.Control type="text" placeholder="Last name" value={lName} onChange={(e) => setLName(e.target.value)} required />
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <FloatingLabel
                        controlId="floatingDOB"
                        label="Date of Birth"
                        className="mb-3"
                    >
                        <Form.Control type="date" placeholder="Date of Birth" />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="floatingProfilePicture"
                        label="Profile picture"
                        className="mb-3"
                    >
                        <Form.Control type="file" onChange={handleFileChange} />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="floatingEmail"
                        label="Email address"
                        className="mb-3"
                    >
                        <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingPassword" label="Password" className='d-flex'>
                        <Form.Control type={!eye ? "password" : "text"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <img src={eye ? 'show/show.svg' : 'show/hide.svg'} alt='show/hide' onClick={handleEye} width={60} className='btn border' />
                    </FloatingLabel>
                    <Button className='mt-3 text-center' variant='dark' type='submit'>Sign up</Button>
                </Form>
                <br />
                <button className='btn mt-3 mb-3' onClick={handleSignupWithEmail}><h5>All sign up options</h5></button>
            </div>
        </>
    )
}

export default Signup
