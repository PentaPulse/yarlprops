import React from 'react'
import NavigationBar from '../components/NavigationBar/NavigationBar'
import Footer from '../components/Footer/Footer'
import { Grid } from '@mui/material'

export default function PageLayout({ children, handleMode, signin, setSignin, signup, setSignup }) {
    return (
        <>
            <NavigationBar handleMode={handleMode} signin={signin} setSignin={setSignin} signup={signup} setSignup={setSignup} />
            <Grid container pl={4}>
                {children}
            </Grid>
            <Footer />
        </>
    )
}