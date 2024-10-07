import React from 'react'
import NavigationBar from '../components/NavigationBar/NavigationBar'
import Footer from '../components/Footer/Footer'
import { Grid } from '@mui/material'

export default function PageLayout({ children ,handleMode}) {
    return (
        <>
            <NavigationBar handleMode={handleMode} />
            <Grid container >
                {children}
            </Grid>
            <Footer/>
        </>
    )
}
