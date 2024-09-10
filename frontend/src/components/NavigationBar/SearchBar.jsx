import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Select, MenuItem,  useTheme, Box, alpha, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('products'); // Default to 'products'
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSearch = (e) => {
        if (e) e.preventDefault()
        if (searchTerm.trim()) {
            // Construct the URL with the search type and term
            const path = `/p/${searchType}?search=${encodeURIComponent(searchTerm)}`;
            navigate(path);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: theme.shape.borderRadius,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                },
                marginRight: theme.spacing(2),
                padding: theme.spacing(0.5),
                [theme.breakpoints.up('md')]: {
                    width: 'auto',
                },
                [theme.breakpoints.down('sm')]: {
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                },
            }}
        >
            <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                sx={{
                    marginRight: theme.spacing(2),
                    backgroundColor: 'transparent',
                    borderRadius: theme.shape.borderRadius,
                    '& .MuiSelect-select': {
                        padding: theme.spacing(1),
                        color: theme.palette.primary.main,
                    },
                    [theme.breakpoints.down('sm')]: {
                        marginRight: 0,
                        marginBottom: theme.spacing(1),
                    },
                }}
            >
                <MenuItem value="products">Products</MenuItem>
                <MenuItem value="rentals">Rentals</MenuItem>
                <MenuItem value="services">Services</MenuItem>
            </Select>
            <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                variant="outlined"
                sx={{
                    flexGrow: 1,
                    '& .MuiInputBase-input': {
                        padding: theme.spacing(1),
                        width: '100%',
                    },
                }}
            />
            <IconButton
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{
                    marginLeft: theme.spacing(2),
                    [theme.breakpoints.down('sm')]: {
                        marginLeft: 0,
                    },
                }}>
                <SearchIcon />
            </IconButton>
        </Box>
    );
}
