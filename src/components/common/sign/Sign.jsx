import { GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authUser } from '../../../backend/autharization';
import { storage } from '../../../backend/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Button, Col, FloatingLabel, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Signin({ toggleSignup }) {
    const [signinWithEmail, setSigninWithEmail] = useState(false);
    const handleSigninWithEmail = () => {
        setSigninWithEmail(!signinWithEmail);
    }
    return (
        <>
            {!signinWithEmail ? <SigninMethods toggleSignup={toggleSignup} handleSigninWithEmail={handleSigninWithEmail} /> : <SigninWithEmail handleSigninWithEmail={handleSigninWithEmail} />}
        </>
    )
}

function SocialLogins() {
    const navigate = useNavigate()
    const handleSigninWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(authUser, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential.accessToken
                const user = result.user
                console.log(token)
                console.log(user)
                navigate('/')
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                toast.warning(errorCode, ' : ', errorMessage)
            })
    }
    const handleSigninWithMicrosoft = () => {
        const provider = new OAuthProvider('microsoft.com');
        signInWithPopup(authUser, provider)
            .then((result) => {
                const credential = OAuthProvider.credentialFromResult(result)
                const token = credential.accessToken
                const user = result.user
                console.log(token)
                console.log(user)
                navigate('/')
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                toast.warning(errorCode, ' : ', errorMessage)
            })
    }
    return (
        <>
            <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center' onClick={handleSigninWithGoogle}>
                <div className="d-flex justify-content-start align-items-center w-50">
                    <img className='me-4' src="social-icons/google.svg" alt="" width={25} />
                    <span>Google</span>
                </div>
            </button>
            <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                <div className="d-flex justify-content-start align-items-center w-50">
                    <img className='me-4' src="social-icons/facebook.svg" alt="" width={25} />
                    <span>Facebook</span>
                </div>
            </button>
            <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                <div className="d-flex justify-content-start align-items-center w-50">
                    <img className='me-4' src="social-icons/github.svg" alt="" width={25} />
                    <span>Github</span>
                </div>
            </button>
            <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center' onClick={handleSigninWithMicrosoft}>
                <div className="d-flex justify-content-start align-items-center w-50">
                    <img className='me-4' src="social-icons/microsoft.svg" alt="" width={25} />
                    <span>Microsoft</span>
                </div>
            </button>
        </>
    )
}

function SigninMethods({ toggleSignup, handleSigninWithEmail }) {

    return (
        <>
            <div className="methods d-flex flex-column justify-content-center align-items-center">
                <SocialLogins />
                <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center' onClick={handleSigninWithEmail}>
                    <div className="d-flex justify-content-start align-items-center w-50">
                        <img className='me-4' src="social-icons/email.svg" alt="" width={25} />
                        <span>Sign in with email</span>
                    </div>
                </button>
                <button className='btn mt-4 w-100' onClick={toggleSignup}><h5> No account ? Create one</h5></button>
            </div>
        </>
    )
}

function SigninWithEmail({ handleSigninWithEmail }) {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [warning, setWarning] = useState('');
    const [eye, setEye] = useState(false);
    const [emailerror, setEmailError] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(authUser, email, password)
            .then((result) => {
                const user = result.user;
                user.toJSON();
                console.log(user);
                window.location.reload(0);
            }).catch((error) => {
                const errorCode = error.code;
                const errorMassage = error.massage;
                if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/invalid-email') {
                    setWarning('Invalid email and/or password!!!')
                }
                console.log(errorCode + ' : ' + errorMassage)
            })
    }
    const handleEye = () => {
        setEye(!eye);
    }

    const handleReset = (e) => {
        e.preventDefault();
        if (email.length === 0) {
            setEmailError(<span className='text-warning'>Enter registered Email</span>);
            return;
        }
        setEmailError('');
        sendPasswordResetEmail(authUser, email)
            .then(() => {
                Toast.success("Successfully sent reset email link");
                navigate('/');
            })
            .catch((error) => {
                console.log(error)
                console.error("Error sending reset email:", error);
                // Handle specific errors or display a generic message
            });
    };

    return (
        <>
            <ToastContainer />
            <div className='mt-3 text-center'>
                <Form onSubmit={handleSubmit} >
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Email address"
                    >
                        <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FloatingLabel>
                    {emailerror}
                    <FloatingLabel controlId="floatingPassword" label="Password" className='d-flex mt-2'>
                        <Form.Control type={!eye ? "password" : "text"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <img className='btn border' alt='show/hide' src={eye ? 'show/show.svg' : 'show/hide.svg'} onClick={handleEye} width={60} />
                    </FloatingLabel>
                    <span className="text-danger">{warning}</span><br />
                    <button className='btn w-100' onClick={handleReset}><span>Forgot password ? Click to Reset</span></button>
                    <Button className='mt-3 text-center' variant='dark' type='submit'>Sign in</Button>
                </Form>
                <br />
                <button className='btn mt-3 mb-3' onClick={handleSigninWithEmail}><h5>All sign in options</h5></button>
            </div>
        </>
    )
}

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
                <SocialLogins/>
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
                        const storageRef = ref(storage, `users/${user.uid}/profilePicture`);
                        uploadBytes(storageRef, pp).then((snapshot) => {
                            getDownloadURL(snapshot.ref).then((downloadURL) => {
                                updateProfile((user), {
                                    photoURL: downloadURL,
                                }).then(() => {
                                    window.location.reload(0);
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

export { Signup, Signin }
