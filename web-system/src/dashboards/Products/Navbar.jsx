import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = ({ toggleAddProduct }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PRODUCTS
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
