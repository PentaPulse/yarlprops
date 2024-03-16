import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom';
import { authUser } from '../../../backend/autharization';
import { Button, FloatingLabel, Toast, ToastContainer } from 'react-bootstrap';

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

function SigninMethods({ toggleSignup, handleSigninWithEmail }) {
  return (
      <>
          <div className="methods d-flex flex-column justify-content-center align-items-center">
              <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                  <div className="d-flex justify-content-start align-items-center w-50">
                      <img className='me-4' src="social-icons/google.svg" alt="" width={25} />
                      <span>Sign in with Google</span>
                  </div>
              </button>
              <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                  <div className="d-flex justify-content-start align-items-center w-50">
                      <img className='me-4' src="social-icons/facebook.svg" alt="" width={25} />
                      <span>Sign in with Facebook</span>
                  </div>
              </button>
              <button className='btn border-dark w-100 mt-4 d-flex justify-content-center align-items-center'>
                  <div className="d-flex justify-content-start align-items-center w-50">
                      <img className='me-4' src="social-icons/github.svg" alt="" width={25} />
                      <span>Sign in with Github</span>
                  </div>
              </button>
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
                  <Button className='mt-3 text-center' variant='dark' type='submit'>Sign in</Button>
              </Form>

              <button className='btn w-100' onClick={handleReset}><span>Forgot password ? Click to Reset</span></button>
              <br />
              <button className='btn mt-3 mb-3' onClick={handleSigninWithEmail}><h5>All sign in options</h5></button>
          </div>
      </>
  )
}

export default Signin
