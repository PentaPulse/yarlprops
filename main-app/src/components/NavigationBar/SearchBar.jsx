import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Select, MenuItem, useTheme, Box, alpha, IconButton, Tooltip, Autocomplete, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function sleep(duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

export default function SearchBar({ page }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('products');
    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
      (async () => {
        setLoading(true);
        await sleep(1e3); // For demo purposes.
        setLoading(false);
  
        setOptions([...topFilms]);
      })();
    };
  
    const handleClose = () => {
      setOpen(false);
      setOptions([]);
    };

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
        >
            <Tooltip title={'change item type'}>
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
            <Autocomplete
            sx={{width:'100%'}}
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                isOptionEqualToValue={(option, value) => option.title === value.title}
                getOptionLabel={(option) => option.title}
                options={options}
                loading={loading}
                renderInput={(params) => (
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
                        {...params}
          label="Search"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
                    />
                )}
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

const topFilms = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      title: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
      title: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
      title: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
  ];