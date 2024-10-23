import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Select, MenuItem, useTheme, Box, alpha, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ page }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('products');
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSearch = (e) => {
        if (e) e.preventDefault()
        if (searchTerm.trim()) {
            const path = `/p/${searchType}?search=${encodeURIComponent(searchTerm)}`;
            navigate(path);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (page === 'Products') {
            setSearchType('products')
        } else if (page === 'Rentals') {
            setSearchType('rentals')
        } else if (page === 'Services') {
            setSearchType('services')
        } else {
            setSearchType('')
        }
    }, [page])
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
                [theme.breakpoints.up('lg')]: {
                    width: '800px',
                },
                [theme.breakpoints.down('lg')]: {
                    width: '100%',
                    alignItems: 'stretch',
                },
            }}
        ><Tooltip title={'change item type'}>
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
                    <MenuItem value="products" >Products</MenuItem>
                    <MenuItem value="rentals" >Rentals</MenuItem>
                    <MenuItem value="services" >Services</MenuItem>
                </Select>
            </Tooltip>
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
