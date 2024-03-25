import { GoogleAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authUser } from '../../../backend/autharization';
import { FloatingLabel, Form,Toast, ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Button, ButtonGroup, TextField } from '@mui/material';
import { addUser } from '../../../backend/database';

const googleStyle = {
    "border-radius": "100px",
    width: "80%"
}
const inputStyle = {
    "border-radius": "100px"
}

export function Welcome({ toLogin, toRegister }) {
    const handleGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(authUser, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential.accessToken
                const user = result.user
                console.log(token)
                console.log(user)
                window.location.reload(0)
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                toast.warning(errorCode, ' : ', errorMessage)
            })
    }
    return (
        <>
            <div className='d-flex justify-content-center flex-column'>
                <h2>Welcome to YarlProps</h2>
                <span className="btn border text-center" style={googleStyle} onClick={handleGoogle}><img src="social-icons/google.svg" alt="G" width={30} /> Connect with Google</span>
                <h5>OR</h5>
                <div className="text-center">
                    <ButtonGroup aria-label='Basic button group' variant='contained'>
                        <Button variant='contained' onClick={toLogin}>Login</Button>
                        <Button variant='contained' onClick={toRegister}>Register</Button>
                    </ButtonGroup>
                </div>
            </div>
        </>
    )
}

export function Login({ handleBack }) {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const handleLogin = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(authUser,email,password)
        .then((result)=>{
            const user = result.user
            console.log("uid : "+user.uid)
            window.location.reload(0)
        })
        .catch((error)=>{
            const errorMassege = error.massage
            const errorCode = error.code
            if(errorCode==="auth/invalid-email"){
                console.log("invalid credentials")
            }
            else{
            console.log(errorCode+" : "+errorMassege)
            }
        })
    }
    return (
        <>
        <div className="d-flex flex-column gap-2">
            <h2>Login</h2>
            <hr />
            <div className="d-flex flex-column gap-4">
            <TextField inputProps={inputStyle} label="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <TextField inputProps={inputStyle} label="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>            
            <span className="a">Forgot Your Password?</span>
            </div>
            <div className="text-center">
            <ButtonGroup aria-label='Vertical button group' className='gap-3'>
                <Button variant='contained' onClick={handleBack}>Back</Button>
                <Button variant='contained' onClick={handleLogin}>Login</Button>
            </ButtonGroup>
            </div>
            </div>
        </>
    )
}

export function Register({ handleBack }) {
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [dname, setDname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleFname = (e) => {
        setFname(e.target.value)
        setDname(e.target.value + " " + lname)
    }
    const handleLname = (e) => {
        setLname(e.target.value)
        setDname(fname + " " + e.target.value)
    }
    const handleRegister = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(authUser, email, password)
        .then((result)=>{
            const user = result.user;
            user.displayName = dname;
            console.log("uid : "+user.uid)
            addUser(user.uid,fname,lname,email)
            window.location.reload(0)
        })
        .catch((error)=>{
            const errorMassege = error.massage
            const errorCode = error.code
            if(errorCode==="auth/invalid-email"){
                console.log("invalid credentials")
            }
            else{
            console.log(errorCode+" : "+errorMassege)
            }
        })
    }
    return (
        <>
        <ToastContainer/>
            <div className="d-flex flex-column justify-content-center text-center">
                <h2>Create account</h2>
                <hr/>
                <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-4 w-100">
                    <TextField className='w-50' inputProps={inputStyle} label="First name" value={fname} onChange={handleFname} required/>
                    <TextField className='w-50' inputProps={inputStyle} label="Last name" value={lname} onChange={handleLname} required />
                </div>

                <TextField inputProps={inputStyle} label="Display name" value={dname} />
                <TextField inputProps={inputStyle}  type='file' />
                <TextField inputProps={inputStyle} label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <TextField inputProps={inputStyle} label="Password" type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required />
                {/*<TextField inputProps={inputStyle} label="Confirm Password" type='password' />*/}
                <div className="text-center">
                    <ButtonGroup aria-label='Vertical button group' className='gap-3 text-center'>
                        <Button variant='contained' onClick={handleBack}>Back</Button>
                        <Button variant='contained' onClick={handleRegister}>Register</Button>
                    </ButtonGroup>
                </div>
                </div>
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
                <button className='btn mt-3 mb-3' onClick={handleSigninWithEmail}><h5>Back</h5></button>
            </div>
        </>
    )
}