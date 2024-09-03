import { Radio, FormControlLabel, Grid, TextField, Typography, Slider, Paper, Divider, FormControl, FormLabel, RadioGroup, Button } from '@mui/material';
import * as React from 'react';
import ProductsContents from './ProductsContents';
import { productFilters } from '../../components/menuLists';

function Products() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [cat, setCat] = React.useState(null)
    const [subCat, setSubCat] = React.useState(null)
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCat(value);
        setSubCat(null)
    };
    const handleSubCategoryChange = (event) => {
        const value = event.target.value;
        setSubCat(value)
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };
    const handleClearCategories=()=>{
        setCat(null)
        setSubCat(null)
    }
    const handleClearSubCategories=()=>{
        setSubCat(null)
    }

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={11} sm={11} md={11} lg={3}>
                <Paper
                    sx={{
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: 3,
                        marginLeft: '5rem'
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Search
                    </Typography>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Divider sx={{ my: 2 }} />
                    <FormControl>
                        <FormLabel>Categories</FormLabel>
                        <RadioGroup name='categories' value={cat} onChange={handleCategoryChange}>
                            {Object.keys(productFilters["categories"]).map((category) => (
                                <FormControlLabel
                                    key={category}
                                    control={<Radio value={category} />}
                                    label={category}
                                />
                            ))}
                        </RadioGroup>
                        {cat && <Button onClick={handleClearCategories}>Clear</Button>}
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <FormControl>
                        <FormLabel>Sub Categories</FormLabel>
                        {cat && (
                            <RadioGroup value={subCat} onChange={handleSubCategoryChange}>
                                {productFilters["categories"][cat]?.map((subCategory) => (
                                    <FormControlLabel
                                        key={subCategory}
                                        control={<Radio value={subCategory} />}
                                        label={subCategory}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {subCat && <Button onClick={handleClearSubCategories}>Clear</Button>}
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Price Range
                    </Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10000}
                        step={500}

                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Quantity
                    </Typography>
                    <TextField
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        InputProps={{ inputProps: { min: 1, max: 10 } }}
                        fullWidth
                    />
                </Paper>
            </Grid>
            <Grid item md={9}>
                <ProductsContents
                    searchTerm={searchTerm.toLowerCase()}
                    category={cat}
                    subCategory={subCat}
                    priceRange={priceRange}
                    quantity={quantity}
                />
            </Grid>
        </Grid>
    );
}

export default Products;
