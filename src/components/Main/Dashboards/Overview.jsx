import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

const countNames = ['Products','Users']
const count =[12,45]

function Overview() {
    return (
        <>
            <Grid container columns={12}>
                {countNames.map((names,index)=>(
                <Grid item xs={12} sm={12} md={6} lg={3}>
                    <Typography>{names}</Typography>
                    <Typography>{count[index]}</Typography>
                </Grid>
                ))}
            </Grid>
        </>
    )
}

export default Overview
