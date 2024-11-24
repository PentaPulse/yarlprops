import React, { useState } from 'react';
import { Container, Button, IconButton, styled, Paper, Typography, TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Grid, TableCell, tableCellClasses, TableRow, TableContainer, Table, TableHead, TableBody, TablePagination, CircularProgress, Select, InputLabel, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../api/firebase';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../api/AuthContext';
import { arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { addRental, fetchSelectedRental, updateRental } from '../../api/db/rentals';
import { rentalFilters } from '../../components/menuLists';

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
    <Container maxWidth={false} sx={{ p: { xs: 1, sm: 2, md: 3} }}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAddRental}
            // style={{ margin: '20px' }}
            sx={{
              m: { xs: 1, sm: 2 },
              width: { xs: 'auto', sm: 'auto' }
            }}
          >
            Add Rental
          </Button>
        </Grid>
        <Grid item xs={12}>
          
            {
              showAddRental ? (
                <RentalForm rid={editingRentalId} onSuccess={handleSuccess} onCancel={handleCancel} />
              ) : viewingRentalId ? (
                <RentalDetail rid={viewingRentalId} onBack={handleCancel} />
              ) : (
                <RentalList onEditrental={handleEditRental} onViewrental={handleViewRental} />
              )
            }
          
        </Grid>
      </Grid>
      
    </Container>
  );
};

const RentalForm = ({ rid, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [rental, setRental] = useState({
    merchantId: user.uid,
    merchantName:user.displayName,
    title: '',
    category: '',
    subCategory: '',
    description: [''],
    quantity: '',
    location: '',
    status: 'For Rent',
    images: [],
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

  const handleDescriptionChange = (index, event) => {
    const newRentDescription = [...rental.description];
    newRentDescription[index] = event.target.value;
    setRental({ ...rental, description: newRentDescription });
  };

  const addDescriptionLine = () => {
    setRental({ ...rental, description: [...rental.description, ''] });
  };

  const handleRemoveDescriptionLine = (index) => {
    const updatedDescriptions = rental.description.filter((_, i) => i !== index);
    setRental({ ...rental, description: updatedDescriptions });
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

    if (rental.category!=='Bordims'&&rental.quantity < 1) {
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
        await updateRental(rid, { ...rental,quantity:rental.category==='Bordims'?1:rental.quantity, images: allImageUrls ,visibility:false});
        //await itemNotification(user,rental,'rental','update')
      } else {
        console.log("Stage 2", rental)

        await addRental({ ...rental,quantity:rental.category==='Bordims'?1:rental.quantity, images: allImageUrls,visibility:false});      }
        //await itemNotification(user,rental,'rental','add')

      Swal.fire({
        icon: 'success',
        title: 'Rental details saved successfully and request sent to the admin panel',
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form state
      setRental({
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
    <Paper /*style={{ padding: 16 }}*/ sx={{ p: { xs: 2, sm: 3, md: 4}, mr: {xs: 1, sm: 1, md: 1, lg: -10, xl: -30} }}>
      <Typography variant="h6" sx={{ mb: { xs: 2, sm: 3 } }}>{rid ? 'Edit Rental' : 'Add Rental'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={rental.title}
          onChange={handleChange}
          fullWidth
          sx={{ mb: { xs: 2, sm: 3 } }}
          required
        />
        <FormControl fullWidth sx={{ mb: { xs: 2, sm: 3 } }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={rental.category}
            onChange={handleChange}
            required
          >
            {Object.keys(rentalFilters["categories"]).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth  sx={{ mb: { xs: 2, sm: 3 } }}>
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategory"
            value={rental.subCategory}
            onChange={handleChange}
            required
            disabled={!rental.category}
          >
            {rental.category &&
              rentalFilters["categories"][rental.category].map((subCategory) => (
                <MenuItem key={subCategory} value={subCategory}>
                  {subCategory}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {rental.description.map((des, index) => (
          <Grid container key={index} spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={11}>
              <TextField
                label={`Description Line ${index + 1}`}
                value={des}
                onChange={(event) => handleDescriptionChange(index, event)}
                fullWidth
                sx={{ mb: { xs: 1, sm: 2 } }}
                required
              />
            </Grid>
            {index > 0 && (
              <Grid item xs={1}>
                <IconButton onClick={() => handleRemoveDescriptionLine(index)} style={{ marginTop: '1rem' }} aria-label="delete">
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
          sx={{ mb: { xs: 2, sm: 3 }, width: { xs: '100%', sm: 'auto' } }}
        >
          Add new line
        </Button>
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={rental.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 1 }}
          disabled={rental.category === 'Bordims'}
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
            <FormControlLabel
              value="For Rent"
              control={<Radio />}
              label="For Rent" />
            <FormControlLabel
              value="Sold Out"

              control={<Radio />}
              label="Sold Out!"
              disabled={!rid}
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
          Upload Images
          <VisuallyHiddenInput type="file" />
        </Button>

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
          <Button type="submit" variant="contained" color="success" fullWidth>
            Save
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button onClick={onCancel} variant="outlined" fullWidth>
            Cancel
          </Button>
        </Grid>
      </Grid>
      </form>
    </Paper>
  );
};

const RentalList = ({ onEditrental, onViewrental }) => {
  const [rentals, setRentals] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchRentalList = async () => {
      const q = await getDocs(query(collection(db, 'rentals'), where('merchantId', '==', user.uid)))
      const fetchedRentals = q.docs.map(doc => doc.data())
      setRentals(fetchedRentals);
    };
    fetchRentalList();
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
        await deleteDoc(doc(db, 'rentals', id));
        await updateDoc(doc(db,'systemusers',user.uid),{
          myRentals:arrayRemove(id)
        })
        setRentals(rentals.filter(rental => rental.id !== id));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `The rental has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error deleting rental: ", error);
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
    <TableContainer sx={{ maxHeight: { xs: 440, sm: 600, md: 'none' } }}>
      <Table stickyHeader sx={{ minWidth: { xs: 300, sm: 750} }}>
        <TableHead>
          <TableRow>
            {/* <TableCell>ID</TableCell> */}
            <StyledTableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' } }}>Title</StyledTableCell>
            <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Category</StyledTableCell>
            <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Sub category</StyledTableCell>
            {/* <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell> */}
            <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>Current Status</StyledTableCell>
            <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>Visibility On Site</StyledTableCell>
            <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rentals.length > 0 ?
            rentals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(rental => (
              <StyledTableRow key={rental.rid}>
                {/* <TableCell>{rental.id}</TableCell> */}
                <StyledTableCell sx={{ display: { xs: 'table-cell', md: 'table-cell' } }}>{rental.title}</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{rental.category}</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{rental.subCategory}</StyledTableCell>
                {/* <StyledTableCell align="justify">{rental.description}</StyledTableCell>
                <StyledTableCell align="center">{rental.quantity}</StyledTableCell>
                <StyledTableCell align="center">{rental.location}</StyledTableCell> */}
                <StyledTableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>{rental.status}</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: 'table-cell', sm: 'table-cell' } }}>{(rental.visibility === false) ? 'No':'Yes'}</StyledTableCell>


                <StyledTableCell>
                <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Grid item xs={12} sm={10}>
                  <Button onClick={() => onViewrental(rental.rid)} variant="outlined" color="secondary" fullWidth
                            sx={{ mb: { xs: 1, sm:0 } }}>View</Button>
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Button onClick={() => onEditrental(rental.rid)} variant="outlined" color="success"  fullWidth
                            sx={{ mb: { xs: 1, sm: 0 } }}>Edit</Button>
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Button onClick={() => handleDelete(rental.rid)} variant="outlined" color="error" fullWidth>Delete</Button>
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rentals.length}
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
    </TableContainer>
    </Paper>
  );
};

const Image = styled('img')({
  width: 200,
  height: 200,
  objectFit: 'cover',
  margin: 5,
});

const RentalDetail = ({ rid, onBack }) => {
  const [rental, setrental] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchrental = async () => {
      const fetchedrental = await fetchSelectedRental(rid);
      if (fetchedrental) {
        setrental(fetchedrental);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchrental();
  }, [rid]);

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mr: {xs: 1, sm: 1, md: 1, lg: -10, xl: -30} }}>
      <Typography variant="h4" sx={{ 
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}>{rental.title}</Typography>
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Category: {rental.category}</Typography>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Sub category: {rental.subCategory}</Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>Description:</Typography>
      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
      {rental.description.map((item, index) => (
        // <Typography key={index} variant="body1">{item}</Typography>
        <li key={index}><Typography variant='body1' sx={{ mb: 0.5 }}>{item}</Typography></li>
      ))}
      </ul>
      </Grid>
      <Grid item xs={12} md={6}>
      <Typography variant="body1"  sx={{ mb: 1 }}>Quantity: {rental.quantity}</Typography>
      <Typography variant="body1"  sx={{ mb: 1 }}>Location: {rental.location}</Typography>
      <Typography variant="body1"  sx={{ mb: 1 }}>Status: {rental.status}</Typography>
      <Typography variant="body1"  sx={{ mb: 1 }}>Visibility: {(rental.visibility === false) ? 'No':'Yes'}</Typography>
      </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
      
        {rental.images && rental.images.map((src, index) => (
          <Grid item key={index}>
          <Image src={src} alt={`rental ${index}`} style={{ width: '185px', height: '175px', objectFit: 'cover', borderRadius: '10px'}}/>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={onBack} fullWidth sx={{ 
          mt: 3,
          maxWidth: { sm: 200 }
        }}>
        Back
      </Button>
    </Paper>
  );
};
