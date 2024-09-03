import { Radio, FormControlLabel, Grid, TextField, Typography, Slider, Paper, Divider, FormControl, FormLabel, RadioGroup, Button } from '@mui/material';
import * as React from 'react';
import ProductsContents from './ProductsContents';
import { productFilters } from '../../components/menuLists';
import { useParams } from 'react-router-dom';

function Products() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [category, setCategory] = React.useState(null)
    const [subCategory, setSubCategory] = React.useState(null)
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);
    const {cat}=useParams()
    React.useEffect(()=>{
        if(cat){
            setCategory(cat)
        }
    },[])
    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        setSubCategory(null)
    };
    const handleSubCategoryegoryChange = (event) => {
        const value = event.target.value;
        setSubCategory(value)
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };
    const handleClearCategories = () => {
        setCategory(null)
        setSubCategory(null)
    }
    const handleClearSubCategoryegories = () => {
        setSubCategory(null)
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
                    autoFocus
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Divider sx={{ my: 2 }} />
                    <FormControl>
                        <FormLabel>Categories</FormLabel>
                        <RadioGroup name='categories' value={category} onChange={handleCategoryChange}>
                            {Object.keys(productFilters["categories"]).map((category) => (
                                <FormControlLabel
                                    key={category}
                                    control={<Radio value={category} />}
                                    label={category}
                                />
                            ))}
                        </RadioGroup>
                        {category && <Button onClick={handleClearCategories}>Clear</Button>}
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <FormControl>
                        <FormLabel>Sub Categories</FormLabel>
                        {category && (
                            <RadioGroup value={subCategory} onChange={handleSubCategoryegoryChange}>
                                {productFilters["categories"][category]?.map((subCategoryegory) => (
                                    <FormControlLabel
                                        key={subCategoryegory}
                                        control={<Radio value={subCategoryegory} />}
                                        label={subCategoryegory}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {subCategory && <Button onClick={handleClearSubCategoryegories}>Clear</Button>}
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
                    category={category}
                    subCategory={subCategory}
                    priceRange={priceRange}
                    quantity={quantity}
                />
            </Grid>
        </Grid>
    );
}

export default Products;
