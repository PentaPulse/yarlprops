import { Radio, FormControlLabel,  Grid, TextField, Typography, Slider, Paper, Divider, FormControl, FormLabel, RadioGroup, Button } from '@mui/material';
import * as React from 'react';
import ProductsContents from './ProductsContents';

function Products() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [cat,setCat]=React.useState(null)
    const [subCat,setSubCat]=React.useState(null)
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCat(value);
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
                            <FormControlLabel
                                control={<Radio value="Vehicals" onChange={handleCategoryChange} />}
                                label="Vehicles"
                            />
                            <FormControlLabel
                                control={<Radio value="Furniture" onChange={handleCategoryChange} />}
                                label="Furniture"
                            />
                            <FormControlLabel
                                control={<Radio value="tools" onChange={handleCategoryChange} />}
                                label="Tools"
                            />
                            <FormControlLabel
                                control={<Radio value="accessories" onChange={handleCategoryChange} />}
                                label="Accessories"
                            />
                        </RadioGroup>
                        {cat && <Button onClick={()=>setCat(null)}>Clear</Button>}
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <FormControl>
                        <FormLabel>Sub Categories</FormLabel>

                        {cat==='Vehicals' &&
                            <RadioGroup value={subCat} onChange={handleSubCategoryChange}>
                                <FormControlLabel
                                    control={<Radio value="3wheels" onChange={handleSubCategoryChange} />}
                                    label="Three Wheels"
                                />
                                <FormControlLabel
                                    control={<Radio value="cycle" onChange={handleSubCategoryChange} />}
                                    label="Cycle"
                                />
                                <FormControlLabel
                                    control={<Radio value="bike" onChange={handleSubCategoryChange} />}
                                    label="Bike"
                                />
                            </RadioGroup>
                        }
                        {cat==='Tools' &&
                            <RadioGroup value={subCat} onChange={handleSubCategoryChange}>
                                <FormControlLabel
                                    control={<Radio value="kitchen" onChange={handleSubCategoryChange} />}
                                    label="Kitchen Items"
                                />
                                <FormControlLabel
                                    control={<Radio value="Mattress" onChange={handleSubCategoryChange} />}
                                    label="Mettress"
                                />
                            </RadioGroup>
                        }
                        {cat==='Furniture' &&
                            <RadioGroup value={subCat} onChange={handleSubCategoryChange}>
                                <FormControlLabel
                                    control={<Radio value="Table" onChange={handleSubCategoryChange} />}
                                    label="Table"
                                />
                                <FormControlLabel
                                    control={<Radio value="Bed" onChange={handleSubCategoryChange} />}
                                    label="Bed"
                                />
                                <FormControlLabel
                                    control={<Radio value="Chair" onChange={handleSubCategoryChange} />}
                                    label="Chair"
                                />
                            </RadioGroup>
                        }
                        {subCat && <Button onClick={()=>setSubCat(null)}>Clear</Button>}
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
                    searchTerm={searchTerm}
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
