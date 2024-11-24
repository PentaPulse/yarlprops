import React, { useState } from 'react';
import { Container, Button, IconButton, styled, Paper, Typography, TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Grid, TableCell, tableCellClasses, TableRow, TableContainer, Table, TableHead, TableBody, TablePagination, CircularProgress, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { addProduct, fetchProducts, fetchSelectedProduct, updateProduct } from '../../api/db/products';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../api/firebase';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../api/AuthContext';
import { arrayRemove, deleteDoc, doc, updateDoc,  } from 'firebase/firestore';
import { productFilters } from '../../components/menuLists';
import { addItemByMerchant } from '../../api/db/logsManager';

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
    <Container maxWidth={false} sx={{ p: { xs: 1, sm: 2, md: 3} }}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid item  xs={12}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          /*style={{ margin: '20px' }}*/
          sx={{
            m: { xs: 1, sm: 2 },
            width: { xs: 'auto', sm: 'auto' }
          }}
        >
          Add Product
        </Button>
        </Grid>
        <Grid item xs={12}>
          {showAddProduct ? (
            <ProductForm pid={editingProductId} onSuccess={handleSuccess} onCancel={handleCancel} />
          ) : viewingProductId ? (
            <ProductDetail pid={viewingProductId} onBack={handleCancel} />
          ) : (
            <ProductList onEditProduct={handleEditProduct} onViewProduct={handleViewProduct} />
          )}
        </Grid>
      </Grid>
      

    </Container>
  );
};

const ProductForm = ({ pid, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [product, setProduct] = useState({
    merchantId: user.uid,
    merchantName:user.displayName,
    title: '',
    category: '',
    subCategory: '',
    description: [''],
    quantity: '',
    location: '',
    status: 'For Sale',    
    images: [],
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
  }, [pid, user]);

  const handleChange = (event) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value,
    });
  };

  const handleDescriptionChange = (index, event) => {
    const newProductDescription = [...product.description];
    newProductDescription[index] = event.target.value;
    setProduct({ ...product, description: newProductDescription });
  };

  const addDescriptionLine = () => {
    setProduct({ ...product, description: [...product.description, ''] });
  };

  const handleRemoveDescriptionLine = (index) => {
    const updatedDescriptions = product.description.filter((_, i) => i !== index);
    setProduct({ ...product, description: updatedDescriptions });
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

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const totalImages = existingImages.length + newImages.length;
    if (totalImages < 3 || totalImages > 5) {
      setValidationMessage('You must upload at least 3 images and no more than 5 images.');
      return;
    }

    if (product.quantity < 1) {
      setValidationMessage('Quantity must be greater than 1 or equal to 1.');
      return;
    }
    setValidationMessage('');


    try {
      // Upload new images and get their URLs
      const newImageUrls = await Promise.all(newImages.map((image, index) => {
        return new Promise((resolve, reject) => {
          const imageRef = ref(storage, `images/${image.name}`);
          const uploadTask = uploadBytesResumable(imageRef, image);

          uploadTask.on('state_changed', (snapshot) => {
            //Calculate progress as percentage
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
            console.log(`Upload is ${progress}% done`);
          },
            (error) => {
              console.error('Upload failed: ', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }));

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Add or update product with the combined image URLs
      if (pid) {
        console.log(product)
        await updateProduct(pid, { ...product, images: allImageUrls, visibility: false });
       // notificationManager.addNotification({variant:'updateItem',requiresAdminPermission:true,user:user,additionalFields:{itemType:'product'}})
        Swal.fire({
          icon: 'success',
          title: 'Product updated successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addProduct({ ...product, images: allImageUrls, visibility: false });
        await addItemByMerchant(user, product, 'product')
        //await itemNotification(user,product,'product','add')
        //notifi
        Swal.fire({
          icon: 'success',
          title: 'Product saved , request sent to the admin panel for approval',
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Reset form state
      setProduct({
        title: '',
        category: '',
        subCategory: '',
        description: [''],
        quantity: '',
        location: '',
        status: '',
        images: [],
        
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

  return (
    <Paper /*style={{ padding: 16 }}*/ sx={{ p: { xs: 2, sm: 3, md: 4}, mr: {xs: 1, sm: 1, md: 1, lg: -10, xl: -30} }} >
      <Typography variant="h6"  sx={{ mb: { xs: 2, sm: 3 } }}>
        {pid ? 'Edit Product' : 'Add Product'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={product.title}
          onChange={handleChange}
          fullWidth
          /*margin="normal"*/
          sx={{ mb: { xs: 2, sm: 3 } }}
          required
        />
        <FormControl fullWidth /*margin='normal'*/ sx={{ mb: { xs: 2, sm: 3 } }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            {Object.keys(productFilters["categories"]).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth /*margin='normal'*/ sx={{ mb: { xs: 2, sm: 3 } }}>
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategory"
            value={product.subCategory}
            onChange={handleChange}
            required
            disabled={!product.category}
          >
            {product.category &&
              productFilters["categories"][product.category].map((subCategory) => (
                <MenuItem key={subCategory} value={subCategory}>
                  {subCategory}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {product.description.map((des, index) => (
          <Grid container key={index} spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={11}>
              <TextField
                label={`Description Line ${index + 1}`}
                value={des}
                onChange={(event) => handleDescriptionChange(index, event)}
                fullWidth
                /*margin="normal"*/
                sx={{ mb: { xs: 1, sm: 2 } }}
                required
              />
            </Grid>
            {index > 0 && (
             <Grid item xs={1}>
             <IconButton 
               onClick={() => handleRemoveDescriptionLine(index)}
               sx={{ mt: { xs: 0, sm: 1 } }}
             >
               <DeleteIcon />
             </IconButton>
           </Grid>
            )}
          </Grid>
        ))}

        <Button
          onClick={addDescriptionLine}
          variant="outlined"
          startIcon={<AddIcon />}
          color="success"
          /*style={{ marginTop: '10px', marginBottom: '10px' }}*/
          sx={{ mb: { xs: 2, sm: 3 }, width: { xs: '100%', sm: 'auto' } }}
        >
          Add new line
        </Button>
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 1 }} // Sets the minimum value to 1
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
            value={product.status}  // Assuming `product.status` is controlled by your state
            onChange={handleStatusChange}
            required
          >
            <FormControlLabel
              value="For Sale"
              control={<Radio />}
              label="For Sale"
            />
            <FormControlLabel
              value="Sold Out"
              control={<Radio />}
              label="Sold Out!"
              disabled={!pid}  // Disables the option if `pid` is not available
            />
          </RadioGroup>
        </FormControl>
        <br />

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
          Upload Images
          <VisuallyHiddenInput type="file" />
        </Button>

        {uploadProgress > 0 && (
          <Typography variant="body2" color="textSecondary">
            Upload Progress: {uploadProgress}%
          </Typography>
        )}

        <Typography variant="body1" color="textSecondary" gutterBottom>
          (Note:- Add high quality images.)
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {existingImages.map((src, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper 
                elevation={3}
                sx={{
                  position: 'relative',
                  paddingTop: '75%',
                  overflow: 'hidden',
                  borderRadius: 1
                }}
              >
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Button
                  onClick={() => handleRemoveImage(index, 'existing')}
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    minWidth: '32px',
                    width: '32px',
                    height: '32px',
                    p: 0
                  }}
                >
                  X
                </Button>
              </Paper>
            </Grid>
          ))}
          {newImages.map((file, index) => (
            <Grid item key={index + existingImages.length}>
                <Paper 
                elevation={3}
                sx={{
                  position: 'relative',
                  paddingTop: '75%',
                  overflow: 'hidden',
                  borderRadius: 1
                }}
              >
                <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} style={{ width: 150, height: 120, borderRadius: 5 , objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'new')}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  X
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        {validationMessage && <Typography color="error" sx={{ mt: '1rem'}} gutterBottom>{validationMessage}</Typography>}
        <Grid container spacing={2} sx={{ mt: 3 }}>

         <Grid item xs={12} sm={6}>
            <Button 
              type="submit" 
              variant="contained" 
              color="success"
              fullWidth
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              onClick={onCancel} 
              variant="outlined"
              fullWidth
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
       
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
    fetchProductsList();
  }, []);

  const fetchProductsList=async()=>{
   const data= await fetchProducts({location:'dash',userId:user.uid})
   setProducts(data)
  }
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
        await updateDoc(doc(db, 'systemusers', user.uid), {
          myProducts: arrayRemove(id)
        })
        setProducts(products.filter(product => product.pid !== id));

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

  /*const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));*/

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        fontSize: '0.875rem'
      }
    },
    [`&.${tableCellClasses.body}`]: {
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        fontSize: '0.875rem'
      }
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    [theme.breakpoints.down('sm')]: {
      '& > *': {
        display: 'table-cell'
      }
    }
  }));

  return (
    <Paper sx={{ width: 'auto', overflow: 'hidden', mr: {xs: 1, sm: 1, md: 1} }} >
      <TableContainer /*component={Paper}*/sx={{ maxHeight: { xs: 440, sm: 600, md: 'none' } }}>
          <Table stickyHeader sx={{ minWidth: { xs: 300, sm: 750 } }}>
            <TableHead>
              <TableRow>
                {/* <TableCell>ID</TableCell> */}
                <StyledTableCell /*align="center"*/ sx={{ display: { xs: 'table-cell', md: 'table-cell' } }}>Title</StyledTableCell>
                <StyledTableCell /*align="center"*/ sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Category</StyledTableCell>
                <StyledTableCell /*align="center"*/sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Sub category</StyledTableCell>
                {/* <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center">Quantity</StyledTableCell>
                <StyledTableCell align="center">Location</StyledTableCell> */}
                <StyledTableCell /*align="center"*/ sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Current Status</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>Visibility On Site</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ?
                products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                  <StyledTableRow key={product.pid}>
                    {/* <TableCell>{product.id}</TableCell> */}
                    <StyledTableCell /*align="center"*/ sx={{ display: { xs: 'table-cell', md: 'table-cell' } }}>{product.title}</StyledTableCell>
                    <StyledTableCell /*align="center"*/ sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{product.category}</StyledTableCell>
                    <StyledTableCell /*align="center"*/ sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{product.subCategory}</StyledTableCell>
                    {/* <StyledTableCell align="justify">{product.description}</StyledTableCell>
                    <StyledTableCell align="center">{product.quantity}</StyledTableCell>
                    <StyledTableCell align="center">{product.location}</StyledTableCell> */}
                    <StyledTableCell /*align="center"*/ sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{product.status}</StyledTableCell>
                    <StyledTableCell /*align="center"*/sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>{(product.visibility === false) ? 'No':'Yes'}</StyledTableCell>

                    <StyledTableCell>
                      <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Grid item xs={12} sm={10}>
                          <Button
                            onClick={() => onViewProduct(product.pid)}
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{ mb: { xs: 1, sm: 0 } }}
                          >
                            View
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <Button
                            onClick={() => onEditProduct(product.pid)}
                            variant="outlined"
                            color="success"
                            fullWidth
                            sx={{ mb: { xs: 1, sm: 0 } }}
                          >
                            Edit
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <Button
                            onClick={() => handleDelete(product.pid)}
                            variant="outlined"
                            color="error"
                            fullWidth
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Grid>
                    </StyledTableCell>
                  </StyledTableRow>
                )) : (
                  <TableRow>
                    <StyledTableCell colSpan={8} align="center">
                      No services found.
                    </StyledTableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }
        }}
      />
    
    </Paper>
    
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
    <Paper /*style={{ padding: 16 }}*/ sx={{ p: { xs: 2, sm: 3, md: 4 }, mr: {xs: 1, sm: 1, md: 1, lg: -10, xl: -30} }}>
      <Typography variant="h4" /*gutterBottom*/
        sx={{ 
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}>{product.title}</Typography>

<Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Category: {product.category}</Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Sub category: {product.subCategory}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Description:</Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {product.description.map((item, index) => (
              <li key={index}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>{item}</Typography>
              </li>
            ))}
          </ul>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ mb: 1 }}>Quantity: {product.quantity}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Location: {product.location}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Status: {product.status}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Visibility: {product.visibility === false ? 'No' : 'Yes'}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} /*style={{ marginTop: 10, marginBottom: 10 }}*/ sx={{ mt: 3, mb: 3 }}>
        {product.images && product.images.map((src, index) => (
          <Grid item key={index}>
            <Image src={src} alt={`Product ${index}`} style={{ width: '185px', height: '175px', objectFit: 'cover', borderRadius: '10px' }}/>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={onBack} /*style={{ marginTop: 16 }}*/ fullWidth
        sx={{ 
          mt: 3,
          maxWidth: { sm: 200 }
        }}>
        Back
      </Button>
    </Paper>
  );
};