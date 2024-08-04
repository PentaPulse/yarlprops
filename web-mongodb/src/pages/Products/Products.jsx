import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import * as React from 'react'
import ProductsContents from './ProductsContents';

function Products() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [cat,setCat]=React.useState('')

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
                <Grid item md={2}>
                <Button sx={{ width: '100%' }}>Category</Button>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Bodim" />
                </FormGroup>
                <Button>
                    Type
                </Button>
                <FormGroup>
                    <FormControlLabel control={<Checkbox/>} label="girls"/>
                    <FormControlLabel control={<Checkbox/>} label="boys"/>
                </FormGroup>
                </Grid>
                <Grid item md={9}>
                    <ProductsContents searchTerm={searchTerm} />
                </Grid>
            </Grid>
        </>
    )
}

export default Products;