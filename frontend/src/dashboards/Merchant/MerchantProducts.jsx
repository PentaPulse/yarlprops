import React, { useState } from 'react';
import { Container, Button, styled, Paper, Typography, TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Grid, TableCell, tableCellClasses, TableRow, TableContainer, Table, TableHead, TableBody, TablePagination, CircularProgress, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addProduct, fetchSelectedProduct, updateProduct } from '../../api/db/products';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../api/firebase';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../api/AuthContext';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

export default function MerchantProducts() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [viewingProductId, setViewingProductId] = useState(null);

  const handleAddProduct = () => {
    setEditingProductId(null);
    setShowAddProduct(true);
    setViewingProductId(null);
  }

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setShowAddProduct(true);
    setViewingProductId(null);
  }

  const handleViewProduct = (productId) => {
    setViewingProductId(productId);
    setShowAddProduct(false);
  }

  const handleSuccess = () => {
    setShowAddProduct(false);
    setViewingProductId(null);
  };

  const handleCancel = () => {
    setShowAddProduct(false);
    setViewingProductId(null);
  };

  return (
    <>
      <h2>MY PRODUCTS</h2>

      <Button
        variant="contained"
        color="success"
        startIcon={<AddIcon />}
        onClick={handleAddProduct}
        style={{ margin: '20px' }}
      >
        Add Product
      </Button>

      <Container>
        {
          showAddProduct ? (
            <ProductForm pid={editingProductId} onSuccess={handleSuccess} onCancel={handleCancel} />
          ) : viewingProductId ? (
            <ProductDetail pid={viewingProductId} onBack={handleCancel} />
          ) : (
            <ProductList onEditProduct={handleEditProduct} onViewProduct={handleViewProduct} />
          )
        }
      </Container>
    </>
  );
};

const ProductForm = ({ pid, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [product, setProduct] = useState({
    merchantId: user.uid,
    title: '',
    category: '',
    subCategory: '',
    description: '',
    quantity: '',
    location: '',
    status: '',
    images: [

    ],
  });

  const [existingImages, setExistingImages] = React.useState([]);
  const [newImages, setNewImages] = React.useState([]);
  const [validationMessage, setValidationMessage] = React.useState('');

  React.useEffect(() => {
    if (pid) {
      const fetchProduct = async () => {
        const fetchedProduct = await fetchSelectedProduct(pid);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setExistingImages(fetchedProduct.images || []);
        } else {
          console.log('No such document!');
        }
      };
      fetchProduct();
    }
  }, [pid]);

  const handleChange = (event) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value,
    });
  };

  const handleStatusChange = (event) => {
    setProduct({ ...product, status: event.target.value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImages([...newImages, file]);
    }
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'existing') {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const totalImages = existingImages.length + newImages.length;
    if (totalImages < 3 || totalImages > 5) {
      setValidationMessage('You must upload at least 3 images and no more than 5 images.');
      return;
    }

    if (product.quantity <= 1) {
      setValidationMessage('Quantity must be greater than 1 or equal to 1.');
      return;
    }
    setValidationMessage('');


    try {
      // Upload new images and get their URLs
      const newImageUrls = await Promise.all(newImages.map(async (image) => {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
      }));

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Add or update product with the combined image URLs
      if (pid) {
        await updateProduct(pid, { ...product, images: allImageUrls });
      } else {
        console.log("Stage 2", product)

        await addProduct({ ...product, images: allImageUrls });
      }

      Swal.fire({
        icon: 'success',
        title: 'Product saved successfully',
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form state
      setProduct({
        title: '',
        category: '',
        subCategory: '',
        description: '',
        quantity: '',
        location: '',
        status: '',
        images: []
      });
      setExistingImages([]);
      setNewImages([]);
      onSuccess();

    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error saving product',
        text: e.message,
      });
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const categories = { "Vehicals": ["Bicycle", "Bike"], "Furnitures": ["Table", "Chair", "Bed"] }

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">{pid ? 'Edit Product' : 'Add Product'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={product.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            {Object.keys(categories).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategory"
            value={product.subCategory}
            onChange={handleChange}
            required
            disabled={!product.category}
          >
            {product.category &&
              categories[product.category].map((subCategory) => (
                <MenuItem key={subCategory} value={subCategory}>
                  {subCategory}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Location"
          name="location"
          value={product.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <FormControl component="fieldset" sx={{ ml: "14px" }}>
          <FormLabel component="legend">Status :</FormLabel>
          <RadioGroup
            row
            aria-label="status"
            name="status"
            value={product.status}
            onChange={handleStatusChange}
            required
          >
            <FormControlLabel value="For Sale" control={<Radio checked/>} label="For Sale" />
            <FormControlLabel
              value="Sold Out"

              control={<Radio />}
              label="Sold Out!"
            />
          </RadioGroup>
        </FormControl><br />

        <Button
          accept='image/*'
          multiple
          onChange={handleImageChange}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          style={{ marginTop: '15px', marginBottom: '25px' }}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>

        <Grid container spacing={2}>
          {existingImages.map((src, index) => (
            <Grid item key={index}>
              <div style={{ position: 'relative' }}>
                <img src={src} alt={`Existing Preview ${index}`} style={{ width: 150, height: 100, objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'existing')}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
          {newImages.map((file, index) => (
            <Grid item key={index + existingImages.length}>
              <div style={{ position: 'relative' }}>
                <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} style={{ width: 150, height: 120, objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'new')}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
        {validationMessage && <Typography color="error">{validationMessage}</Typography>}
        <Button type="submit" variant="contained" color="success" style={{ marginTop: '25px' }}>
          Save
        </Button>
        <Button onClick={onCancel} variant="outlined" style={{ marginTop: '25px', marginLeft: '10px' }}>
          Cancel
        </Button>
      </form>
    </Paper>
  );
};

const ProductList = ({ onEditProduct, onViewProduct }) => {
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchProductList = async () => {
      const q = await getDocs(query(collection(db, 'products'), where('merchantId', '==', user.uid)))
      const fetchedProducts = q.docs.map(doc => doc.data())
      setProducts(fetchedProducts);
    };
    fetchProductList();
  }, [user.uid]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(product => product.id !== id));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `The product has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error deleting product: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error deleting the product.',
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {/* <TableCell>ID</TableCell> */}
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Sub category</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell>
            <StyledTableCell align="center">Current Status</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
            <StyledTableRow key={product.pid}>
              {/* <TableCell>{product.id}</TableCell> */}
              <StyledTableCell align="center">{product.title}</StyledTableCell>
              <StyledTableCell align="center">{product.category}</StyledTableCell>
              <StyledTableCell align="center">{product.subCategory}</StyledTableCell>
              <StyledTableCell align="justify">{product.description}</StyledTableCell>
              <StyledTableCell align="center">{product.quantity}</StyledTableCell>
              <StyledTableCell align="center">{product.location}</StyledTableCell>
              <StyledTableCell align="center">{product.status}</StyledTableCell>

              <StyledTableCell align="center">
                <Button onClick={() => onViewProduct(product.pid)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                <Button onClick={() => onEditProduct(product.pid)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                <Button onClick={() => handleDelete(product.pid)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

const Image = styled('img')({
  width: 200,
  height: 200,
  objectFit: 'cover',
  margin: 5,
});

const ProductDetail = ({ pid, onBack }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await fetchSelectedProduct(pid);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [pid]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 16 }}>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16 }}>
        Back to Product List
      </Button>
      <Typography variant="h4">{product.title}</Typography>
      <Typography variant="subtitle1">Category: {product.category}</Typography>
      <Typography variant="subtitle1">Sub category: {product.subCategory}</Typography>
      <Typography variant="body1">Description: {product.description}</Typography>
      <Typography variant="body1">Quantity: {product.quantity}</Typography>
      <Typography variant="body1">Location: {product.location}</Typography>
      <Typography variant="body1">Status: {product.status}</Typography>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {product.images && product.images.map((src, index) => (
          <Grid item key={index}>
            <Image src={src} alt={`Product ${index}`} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};