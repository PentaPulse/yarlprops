import * as React from 'react';
import { Drawer, Typography, Button, Divider, FormControl, Paper, Radio, RadioGroup, useMediaQuery, useTheme, FormLabel, Grid, FormControlLabel, Slider, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Filters({ itemList }) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [category, setCategory] = React.useState(null)
    const [subCategory, setSubCategory] = React.useState(null)
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

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

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    React.useEffect(() => {
        navigate(`/p/products?category=${category}&subcategory=${subCategory}&price=${priceRange}&quantity=${quantity}`);
    }, [category, subCategory])

    const filters = (
        <Paper
            sx={{
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: 3,
                margin: isSmallScreen ? '0 1rem' : '0 1 0 1rem'
            }}
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
                    <RadioGroup value={subCategory} onChange={handleSubCategoryegoryChange}>
                        {itemList["categories"][category]?.map((subCategoryegory) => (
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
    )
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
                    {'FILTERS'.split('').map((letter, index) => (
                        <Typography key={index} >
                            {letter}
                        </Typography>
                    ))}
                </Button>
                <Drawer anchor='left' open={open} onClose={toggleDrawer(false)}>
                    {filters}
                </Drawer>
            </>
        )
    }
    else {
        return (
            <Grid item xs={12} sm={11.2} md={3} lg={2.5}>
                {filters}
            </Grid>
        )
    }
}
