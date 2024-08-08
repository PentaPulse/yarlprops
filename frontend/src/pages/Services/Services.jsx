import { Grid, TextField } from '@mui/material';
import * as React from 'react'
import ServiceFilters from './ServiceFilters';
import ServiceList from '../Home/ServiceList';

function Services() {
    const [searchTerm, setSearchTerm] = React.useState('');

    return (
        <>
            <Grid container justifyContent='center' spacing={3} columns={12}>
                <Grid item xs={11} sm={11} md={11} lg={11}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item md={3}>
                    <ServiceFilters/>
                </Grid>
                <Grid item md={9}>
                    {/* <ViewService searchTerm={searchTerm} /> */}
                    <ServiceList/>
                </Grid>
            </Grid>
        </>
    )
}

export default Services;