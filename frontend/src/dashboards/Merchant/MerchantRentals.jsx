import React, { useState } from 'react';
import { Container, Button, styled, Paper, Typography, TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Grid, TableCell, tableCellClasses, TableRow, TableContainer, Table, TableHead, TableBody, TablePagination, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../api/firebase';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../api/AuthContext';
import {  collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { addRental, fetchSelectedRental, updateRental } from '../../api/db/rentals';

export default function MerchantRentals() {
  const [showAddRental, setShowAddRental] = React.useState(false);
  const [editingRentalId, setEditingRentalId] = React.useState(null);
  const [viewingRentalId, setViewingRentalId] = React.useState(null);

  const handleAddRental = () => {
    setEditingRentalId(null);
    setShowAddRental(true);
    setViewingRentalId(null);
  }

  const handleEditRental = (rentalId) => {
    setEditingRentalId(rentalId);
    setShowAddRental(true);
    setViewingRentalId(null);
  }

  const handleViewRental = (rentalId) => {
    setViewingRentalId(rentalId);
    setShowAddRental(false);
  }

  const handleSuccess = () => {
    setShowAddRental(false);
    setViewingRentalId(null);
  };

  const handleCancel = () => {
    setShowAddRental(false);
    setViewingRentalId(null);
  };

  return (
    <>
      <h2>MY RENTALS</h2>

      <Button
        variant="contained"
        color="success"
        startIcon={<AddIcon />}
        onClick={handleAddRental}
        style={{ margin: '20px' }}
      >
        Add Rental
      </Button>

      <Container>
        {
          showAddRental ? (
            <RentalForm rid={editingRentalId} onSuccess={handleSuccess} onCancel={handleCancel} />
          ) : viewingRentalId ? (
            <RentalDetail rid={viewingRentalId} onBack={handleCancel} />
          ) : (
            <RentalList onEditProduct={handleEditRental} onViewProduct={handleViewRental} />
          )
        }
      </Container>
    </>
  );
};

const RentalForm = ({ rid, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [rental, setRental] = useState({
    merchantId: user.uid,
    title: '',
    category: '',
    type: '',
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
    if (rid) {//rid = rentalId
      const fetchRental = async () => {
        const fetchedRental = await fetchSelectedRental(rid);
        if (fetchedRental) {
          setRental(fetchedRental);
          setExistingImages(fetchedRental.images || []);
        } else {
          console.log('No such document!');
        }
      };
      fetchRental();
    }
  }, [rid]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRental({ ...rental, [name]: value });
  };

  const handleStatusChange = (event) => {
    setRental({ ...rental, status: event.target.value });
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

    if (rental.quantity <= 1) {
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

      // Add or update rental with the combined image URLs
      if (rid) {
        await updateRental(rid, { ...rental, images: allImageUrls });
      } else {
        console.log("Stage 2", rental)

        await addRental({ ...rental, images: allImageUrls });
      }

      Swal.fire({
        icon: 'success',
        title: 'Rental details saved successfully',
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form state
      setRental({
        title: '',
        category: '',
        type: '',
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
        title: 'Error saving rental',
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
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">{rid ? 'Edit Rental' : 'Add Rental'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={rental.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Category"
          name="category"
          value={rental.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Type"
          name="type"
          value={rental.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={rental.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={rental.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Location"
          name="location"
          value={rental.location}
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
            value={rental.status}
            onChange={handleStatusChange}
            required
          >
            <FormControlLabel value="For Rent" control={<Radio />} label="For Rent" />
            <FormControlLabel value="For Sale" control={<Radio />} label="For Sale" />
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

const RentalList = ({ onEditProduct, onViewProduct }) => {
  const [rentals, setRentals] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const {user}=useAuth();  
  
  React.useEffect(() => {
      const fetchRentalList = async () => {
          const q = await getDocs(query(collection(db,'rentals'),where('merchantId','==',user.uid)))
          const fetchedRentals = q.docs.map(doc=>doc.data()) 
          setRentals(fetchedRentals);
      };
      fetchRentalList();
  }, []);

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

          if (result.isConfirmed){
              await deleteDoc(doc(db, 'rentals', id));
              setRentals(rentals.filter(rental => rental.id !== id));

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
              text: 'There was an error deleting the rental.',
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
                      <StyledTableCell align="center">Type</StyledTableCell>
                      <StyledTableCell align="center">Description</StyledTableCell>
                      <StyledTableCell align="center">Quantity</StyledTableCell>
                      <StyledTableCell align="center">Location</StyledTableCell>
                      <StyledTableCell align="center">Current Status</StyledTableCell>
                      <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {rentals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(rental => (
                  <StyledTableRow key={rental.rid}>
                      {/* <TableCell>{rental.id}</TableCell> */}
                      <StyledTableCell align="center">{rental.title}</StyledTableCell>
                      <StyledTableCell align="center">{rental.category}</StyledTableCell>
                      <StyledTableCell align="center">{rental.type}</StyledTableCell>
                      <StyledTableCell align="justify">{rental.description}</StyledTableCell>
                      <StyledTableCell align="center">{rental.quantity}</StyledTableCell>
                      <StyledTableCell align="center">{rental.location}</StyledTableCell>
                      <StyledTableCell align="center">{rental.status}</StyledTableCell>
                      
                      <StyledTableCell align="center">
                          <Button onClick={() => onViewProduct(rental.rid)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
                          <Button onClick={() => onEditProduct(rental.rid)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
                          <Button onClick={() => handleDelete(rental.rid)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
                      </StyledTableCell>
                  </StyledTableRow>
                 ))}
              </TableBody>
          </Table>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rentals.length} 
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

const RentalDetail = ({ rid, onBack }) => {
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await fetchSelectedRental(rid);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [rid]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 16 }}>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16 }}>
        Back to Product List
      </Button>
      <Typography variant="h4">{product.title}</Typography>
      <Typography variant="subtitle1">Category: {product.category}</Typography>
      <Typography variant="subtitle1">Type: {product.type}</Typography>
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
