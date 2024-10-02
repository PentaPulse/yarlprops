import * as React from 'react';
import { Drawer, Typography, Button, Divider, FormControl, Paper, Radio, RadioGroup, useMediaQuery, useTheme, FormLabel, Grid, FormControlLabel, Slider, TextField } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function Filters({ itemList }) {
    const [category, setCategory] = React.useState(null);
    const [subCategory, setSubCategory] = React.useState(null);
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [set, setSet] = React.useState(false);
    const [searchParams] = useSearchParams();

    const updateFilters = (newFilter,remove) => {
        const params = new URLSearchParams(searchParams);
console.log(remove)
        Object.keys(newFilter).forEach((key) => {
            if (remove) {
                params.delete(key);
            } else {
                params.set(key, newFilter[key]);
            }
        });

        navigate({
            pathname: '/p/products',
            search: params.toString(),
        });
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        updateFilters({ category: value });
        setSubCategory(null); // Clear subcategory when category changes
    };

    const handleSubCategoryChange = (event) => {
        const value = event.target.value;
        setSubCategory(value);
        updateFilters({ subcategory: value });
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        updateFilters({ price: newValue });
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;
        setQuantity(value);
        updateFilters({ quantity: value });
    };

    const handleClearCategories = () => {
        setCategory(null);
        setSubCategory(null);
        updateFilters({ category: null, subcategory: null }, true)
    };

    const handleClearSubCategories = () => {
        setSubCategory(null);
        updateFilters({ subcategory: null }, true);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const filters = (
        <Paper
            sx={{
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: 3,
                margin: isSmallScreen ? '0 1rem' : '0 1 0 1rem'
            }}
            onClick={() => setSet(true)}
        >
            <FormControl fullWidth>
                <FormLabel>Categories</FormLabel>
                <RadioGroup name='categories' value={category} onChange={handleCategoryChange}>
                    {Object.keys(itemList["categories"]).map((category) => (
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

            <FormControl fullWidth>
                <FormLabel>Sub Categories</FormLabel>
                {category && (
                    <RadioGroup value={subCategory} onChange={handleSubCategoryChange}>
                        {itemList["categories"][category]?.map((subCategory) => (
                            <FormControlLabel
                                key={subCategory}
                                control={<Radio value={subCategory} />}
                                label={subCategory}
                            />
                        ))}
                    </RadioGroup>
                )}
                {subCategory && <Button onClick={handleClearSubCategories}>Clear</Button>}
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
    );

    if (isSmallScreen) {
        return (
            <>
                <Button variant="contained" sx={{
                    position: 'fixed',
                    top: '20%',
                    left: '-2%',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background,
                    '&:hover': {
                        backgroundColor: '#115293',
                    },
                }} onClick={toggleDrawer(true)}>
                    <FilterAltIcon />
                </Button>
                <Drawer anchor='left' open={open} onClose={toggleDrawer(false)}>
                    {filters}
                </Drawer>
            </>
        );
    } else {
        return (
            <Grid item lg>
                {filters}
            </Grid>
        );
    }
}
