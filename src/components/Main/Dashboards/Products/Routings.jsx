import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';
import { CssBaseline, Container } from "@mui/material";

function Routings(){
  return(
    <Router>
      <CssBaseline/>
        <Container>
          <Routes>
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
        </Container>
    </Router>
  );
}

export default Routings;