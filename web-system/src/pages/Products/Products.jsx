import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography, Slider, Paper, Box, Divider } from '@mui/material';
import * as React from 'react';
import ProductsContents from './ProductsContents';

function Products() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setSelectedCategories((prev) =>
            prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
        );
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

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

                    <Typography variant="h6" gutterBottom>
                        Categories
                    </Typography>
                    <FormGroup>
                        <FormControlLabel 
                            control={<Checkbox value="vehicles" onChange={handleCategoryChange} />} 
                            label="Vehicles" 
                        />
                        <FormControlLabel 
                            control={<Checkbox value="bodim" onChange={handleCategoryChange} />} 
                            label="Bodim" 
                        />
                        <FormControlLabel 
                            control={<Checkbox value="tools" onChange={handleCategoryChange} />} 
                            label="Tools" 
                        />
                        <FormControlLabel 
                            control={<Checkbox value="accessories" onChange={handleCategoryChange} />} 
                            label="Accessories" 
                        />
                    </FormGroup>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Sub-Categories
                    </Typography>
                    <FormGroup>
                        {selectedCategories.includes('vehicles') && (
                            <>
                                <FormControlLabel 
                                    control={<Checkbox value="3wheels" onChange={handleCategoryChange} />} 
                                    label="3 Wheels" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox value="cycle" onChange={handleCategoryChange} />} 
                                    label="Cycle" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox value="bike" onChange={handleCategoryChange} />} 
                                    label="Bike" 
                                />
                            </>
                        )}
                        {selectedCategories.includes('bodim') && (
                            <>
                                <FormControlLabel 
                                    control={<Checkbox value="girls" onChange={handleCategoryChange} />} 
                                    label="Girls" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox value="boys" onChange={handleCategoryChange} />} 
                                    label="Boys" 
                                />
                            </>
                        )}
                        {selectedCategories.includes('tools') && (
                            <>
                                <FormControlLabel 
                                    control={<Checkbox value="kitchen" onChange={handleCategoryChange} />} 
                                    label="Kitchen Items" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox value="table" onChange={handleCategoryChange} />} 
                                    label="Table" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox value="chair" onChange={handleCategoryChange} />} 
                                    label="Chair" 
                                />
                            </>
                        )}
                    </FormGroup>

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
                    searchTerm={searchTerm} 
                    selectedCategories={selectedCategories} 
                    priceRange={priceRange} 
                    quantity={quantity} 
                />
            </Grid>
        </Grid>
    );
}

export default Products;
