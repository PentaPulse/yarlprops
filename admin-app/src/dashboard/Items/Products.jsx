import React, { useState } from "react";
import {
  Container,
  Button,
  ButtonGroup,
  IconButton,
  styled,
  Paper,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  TableCell,
  tableCellClasses,
  TableRow,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Menu,
  TableSortLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addProduct,
  fetchSelectedProduct,
  updateProduct,
} from "../../api/db/products";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../api/firebase";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../../api/AuthContext";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { productFilters } from "../../components/menuLists";
import { addItemByMerchant } from "../../api/db/logsManager";

export default function MerchantProducts() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [viewingProductId, setViewingProductId] = useState(null);

  const handleAddProduct = () => {
    setEditingProductId(null);
    setShowAddProduct(true);
    setViewingProductId(null);
  };

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setShowAddProduct(true);
    setViewingProductId(null);
  };

  const handleViewProduct = (productId) => {
    setViewingProductId(productId);
    setShowAddProduct(false);
  };

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
      <Container>
        {showAddProduct ? (
          <ProductForm
            pid={editingProductId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : viewingProductId ? (
          <ProductDetail pid={viewingProductId} onBack={handleCancel} />
        ) : (
          <ProductList
            onEditProduct={handleEditProduct}
            onViewProduct={handleViewProduct}
          />
        )}
      </Container>
    </>
  );
}

const ProductForm = ({ pid, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [visibility, setVisibility] = useState(false);
  const [reason, setReason] = useState("");
  const [product, setProduct] = useState({
    merchantId: user.uid,
    merchantName: user.displayName,
    title: "",
    category: "",
    subCategory: "",
    description: [""],
    quantity: "",
    location: "",
    status: "For Sale",
    images: [],
    id:pid
  });

  const [existingImages, setExistingImages] = React.useState([]);
  const [newImages, setNewImages] = React.useState([]);
  const [validationMessage, setValidationMessage] = React.useState("");

  React.useEffect(() => {
    if (pid) {
      const fetchProduct = async () => {
        const fetchedProduct = await fetchSelectedProduct(pid);
        if (fetchedProduct) {
          setProduct({...fetchedProduct,id:pid});
          setExistingImages(fetchedProduct.images || []);
        } else {
          console.log("No such document!");
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
    setProduct({ ...product, description: [...product.description, ""] });
  };

  const handleRemoveDescriptionLine = (index) => {
    const updatedDescriptions = product.description.filter(
      (_, i) => i !== index
    );
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
    if (type === "existing") {
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
      setValidationMessage(
        "You must upload at least 3 images and no more than 5 images."
      );
      return;
    }

    if (product.quantity < 1) {
      setValidationMessage("Quantity must be greater than 1 or equal to 1.");
      return;
    }
    setValidationMessage("");

    try {
      // Upload new images and get their URLs
      const newImageUrls = await Promise.all(
        newImages.map((image, index) => {
          return new Promise((resolve, reject) => {
            const imageRef = ref(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                //Calculate progress as percentage
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(Math.round(progress));
                console.log(`Upload is ${progress}% done`);
              },
              (error) => {
                console.error("Upload failed: ", error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                resolve(downloadURL);
              }
            );
          });
        })
      );

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Add or update product with the combined image URLs
      if (pid) {
        console.log(product);
        await updateProduct(pid, {
          ...product,
          images: allImageUrls,
          visibility: visibility,
          reason: reason,
        });
        //await itemNotification(user,product,'product','update')
        //notificationManager.addNotification({'update','/d/notification'})
        Swal.fire({
          icon: "success",
          title: "Product updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addProduct({
          ...product,
          images: allImageUrls,
          visibility: visibility,
        });
        await addItemByMerchant(user, product, "product");
        //await itemNotification(user,product,'product','add')
        //notifi
        Swal.fire({
          icon: "success",
          title: "Product saved , request sent to the admin panel for approval",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Reset form state
      setProduct({
        title: "",
        category: "",
        subCategory: "",
        description: [""],
        quantity: "",
        location: "",
        status: "",
        images: [],
      });
      setReason("");
      setExistingImages([]);
      setNewImages([]);
      onSuccess();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error saving product",
        text: e.message,
      });
    }
  };
  const handleApprove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setVisibility(true);
        console.log("Request approved");
        Swal.fire("Approved!", "The request has been approved.", "success");
      }
    });
  };
  const handleReject = () => {
    Swal.fire({
      title: "Reject Request",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter your reason here...",
      inputAttributes: {
        "aria-label": "Reason for rejection",
      },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const reason1 = result.value; // Get the rejection reason
        if (reason1) {
          // Handle rejection logic here
          setVisibility(false);
          setReason(reason1);
          console.log("Request rejected with reason:", reason);
          Swal.fire("Rejected!", "The request has been rejected.", "success");
        } else {
          Swal.fire("Error!", "You must provide a reason to reject.", "error");
        }
      }
    });
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">
        {pid ? "Edit Product" : "Add Product"}
      </Typography>
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
        <FormControl fullWidth margin="normal">
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
        <FormControl fullWidth margin="normal">
          <InputLabel>SubCategory</InputLabel>
          <Select
            name="subCategory"
            value={product.subCategory}
            onChange={handleChange}
            required
            disabled={!product.category}
          >
            {product.category &&
              productFilters["categories"][product.category].map(
                (subCategory) => (
                  <MenuItem key={subCategory} value={subCategory}>
                    {subCategory}
                  </MenuItem>
                )
              )}
          </Select>
        </FormControl>

        {product.description.map((des, index) => (
          <Grid container key={index} spacing={1} alignItems="center">
            <Grid item xs={11.5}>
              <TextField
                label={`Description Line ${index + 1}`}
                value={des}
                onChange={(event) => handleDescriptionChange(index, event)}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            {index > 0 && (
              <IconButton
                onClick={() => handleRemoveDescriptionLine(index)}
                style={{ marginTop: "1rem" }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Grid>
        ))}

        <Button
          onClick={addDescriptionLine}
          variant="outlined"
          startIcon={<AddIcon />}
          color="success"
          style={{ marginTop: "10px", marginBottom: "10px" }}
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
            value={product.status} // Assuming `product.status` is controlled by your state
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
              disabled={!pid} // Disables the option if `pid` is not available
            />
          </RadioGroup>
        </FormControl>
        <br />

        <Button
          accept="image/*"
          multiple
          onChange={handleImageChange}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          style={{ marginTop: "15px", marginBottom: "25px" }}
        >
          Upload Images
          <VisuallyHiddenInput type="file" />
        </Button>

        {uploadProgress > 0 && (
          <Typography variant="body2" color="textSecondary">
            Upload Progress: {uploadProgress}%
          </Typography>
        )}

        <Grid container spacing={2}>
          {existingImages.map((src, index) => (
            <Grid item key={index}>
              <div style={{ position: "relative" }}>
                <img
                  src={src}
                  alt={`Existing Preview ${index}`}
                  style={{
                    width: 150,
                    height: 120,
                    borderRadius: 5,
                    objectFit: "cover",
                  }}
                />
                <Button
                  onClick={() => handleRemoveImage(index, "existing")}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
          {newImages.map((file, index) => (
            <Grid item key={index + existingImages.length}>
              <div style={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New Preview ${index}`}
                  style={{
                    width: 150,
                    height: 120,
                    borderRadius: 5,
                    objectFit: "cover",
                  }}
                />
                <Button
                  onClick={() => handleRemoveImage(index, "new")}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
        {validationMessage && (
          <Typography color="error" sx={{ mt: "1rem" }} gutterBottom>
            {validationMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2, ml: 3 }}
          onClick={handleReject}
        >
          Reject
        </Button>
        <br />
        <Button
          type="submit"
          variant="contained"
          color="success"
          style={{ marginTop: "25px" }}
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          variant="outlined"
          style={{ marginTop: "25px", marginLeft: "10px" }}
        >
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
      const q = await getDocs(query(collection(db, "products")));
      const fetchedProducts = q.docs.map((doc) => doc.data());
      setProducts(fetchedProducts);
    };
    fetchProductList();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "products", id));
        await updateDoc(doc(db, "systemusers", user.uid), {
          myProducts: arrayRemove(id),
        });
        setProducts(products.filter((product) => product.pid !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `The product has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error deleting product: ", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error deleting the product.",
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

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const handleSortRequest = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = [...products].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      "& .MuiTableSortLabel-root": {
        color: theme.palette.common.white, // Sort label color
        "&:hover": {
          color: "grey", // Hover effect
        },
        "&.Mui-active": {
          color: theme.palette.primary.default, // Active state
          "& .MuiTableSortLabel-icon": {
            color: "grey", // Active sort icon
          },
        },
      },
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const cols = [
    "title",
    "category",
    "Sub Category",
    "status",
    "visibility",
    "action",
  ];

  const headRow = (
    <>
      {cols.map((col, index) => (
        <StyledTableCell key={index} align="center">
          {(col === "title" || col ==="category" || col ==="status" ||col ==="visibility")? (
            <TableSortLabel
              active={orderBy === col}
              direction={orderBy === col ? order : "asc"}
              onClick={() => handleSortRequest(col)}
            >
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </TableSortLabel>
          ) : (
            col.charAt(0).toUpperCase() + col.slice(1) 
          )}
        </StyledTableCell>
      ))}
    </>
  );

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headRow}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length > 0 ? (
            sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <StyledTableRow key={product.pid}>
                  {/* <TableCell>{product.id}</TableCell> */}
                  <StyledTableCell align="center">
                    {product.title}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.category}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.subCategory}
                  </StyledTableCell>
                  {/* <StyledTableCell align="justify">{product.description}</StyledTableCell>
                <StyledTableCell align="center">{product.quantity}</StyledTableCell>
                <StyledTableCell align="center">{product.location}</StyledTableCell> */}
                  <StyledTableCell align="center">
                    {product.status}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {product.visibility === false ? "No" : "Yes"}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Button
                      onClick={() => onViewProduct(product.pid)}
                      variant="outlined"
                      color="secondary"
                      style={{ margin: "5px", width: "100%" }}
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => onEditProduct(product.pid)}
                      variant="outlined"
                      color="success"
                      style={{ margin: "5px", width: "100%" }}
                    >
                      {product.visibility === false && (
                        <Badge
                          color="warning"
                          badgeContent={"!"}
                          sx={{ mr: 3 }}
                        />
                      )}
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.pid)}
                      variant="outlined"
                      color="error"
                      style={{ margin: "5px", width: "100%" }}
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
          ) : (
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
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

const Image = styled("img")({
  width: 200,
  height: 200,
  objectFit: "cover",
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
        console.log("No such document!");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [pid]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" gutterBottom>
        {product.title}
      </Typography>
      <Typography variant="subtitle1">Category: {product.category}</Typography>
      <Typography variant="subtitle1">
        Sub category: {product.subCategory}
      </Typography>
      <Typography variant="body1">Description:</Typography>
      <ul>
        {product.description.map((item, index) => (
          <li key={index}>
            <Typography variant="body1">{item}</Typography>
          </li>
        ))}
      </ul>
      <Typography variant="body1">Quantity: {product.quantity}</Typography>
      <Typography variant="body1">Location: {product.location}</Typography>
      <Typography variant="body1">Status: {product.status}</Typography>
      <Typography variant="body1">
        Visibility: {product.visibility === false ? "No" : "Yes"}
      </Typography>
      <Grid container spacing={2} style={{ marginTop: 10, marginBottom: 10 }}>
        {product.images &&
          product.images.map((src, index) => (
            <Grid item key={index}>
              <Image
                src={src}
                alt={`Product ${index}`}
                style={{
                  width: "185px",
                  height: "175px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Grid>
          ))}
      </Grid>
      <ButtonGroup>
        <Button></Button>
        <Button></Button>
      </ButtonGroup>
      <Button
        variant="contained"
        color="primary"
        onClick={onBack}
        style={{ marginTop: 16 }}
      >
        Back
      </Button>
    </Paper>
  );
};

// import React, { useEffect, useState } from 'react';
// import { Container, Button,IconButton, styled, Paper, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Grid, TableCell, TableRow, tableCellClasses, TableContainer, Table, TableHead, TableBody, TablePagination, CircularProgress, Select, InputLabel, MenuItem } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { addProduct, fetchProducts, fetchSelectedProduct, updateProduct } from '../api/db/products';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import { db, storage } from '../api/firebase';
// import Swal from 'sweetalert2';
// import { deleteDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { useAuth } from '../api/AuthContext';
// import { productFilters } from '../components/menuLists';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';

// export default function Products(){
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProductId, setEditingProductId] = useState(null);
//   const [viewingProductId, setViewingProductId] = useState(null);
//   const {user}=useAuth()

//   const handleEditProduct = (productId) => {
//     setEditingProductId(productId);
//     setShowAddProduct(true);
//     setViewingProductId(null);
//   }

//   const handleViewProduct = (productId) => {
//     setViewingProductId(productId);
//     setShowAddProduct(false);
//   }

//   const handleSuccess = () => {
//     setShowAddProduct(false);
//     setViewingProductId(null);
//   };

//   const handleCancel = () => {
//     setShowAddProduct(false);
//     setViewingProductId(null);
//   };

//   return (
//     <>
//       <Container>
//         {user.approved?(showAddProduct ? (
//           <ProductForm pid={editingProductId} onSuccess={handleSuccess} onCancel={handleCancel} />
//         ) : viewingProductId? (
//           <ProductDetail pid={viewingProductId} onBack={handleCancel} />
//         ):(
//           <ProductList onEditProduct={handleEditProduct} onViewProduct={handleViewProduct}/>
//         )):'wait for admin approval'}
//       </Container>
//     </>
//   );
// };

// const ProductForm = ({ pid, onSuccess, onCancel }) => {
//   const {user} = useAuth();
//   const [product, setProduct] = useState({
//     title: '',
//     category: '',
//     type: '',
//     description: [''],
//     quantity: '',
//     location: '',
//     status: 'For Sale',
//     visibility: false,
//     images: [],
//   });

//   const [existingImages, setExistingImages] = useState([]);
//   const [newImages, setNewImages] = useState([]);
//   const [validationMessage, setValidationMessage] = useState('');

//   React.useEffect(() => {
//     if (pid) {
//       const fetchProduct = async () => {
//         const fetchedProduct = await fetchSelectedProduct(pid);
//         if (fetchedProduct) {
//           setProduct(fetchedProduct);
//           setExistingImages(fetchedProduct.images || []);
//         } else {
//           //console.log('No such document!');
//         }
//       };
//       fetchProduct();
//     }
//   }, [pid, user]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setProduct({ ...product, [name]: value });
//   };

//   const handleDescriptionChange = (index, event) => {
//     const newProductDescription = [...product.description];
//     newProductDescription[index] = event.target.value;
//     setProduct({ ...product, description: newProductDescription });
//   };

//   const addDescriptionLine = () => {
//     setProduct({ ...product, description: [...product.description, ''] });
//   };

//   const handleRemoveDescriptionLine = (index) => {
//     const updatedDescriptions = product.description.filter((_, i) => i !== index);
//     setProduct({ ...product, description: updatedDescriptions });
//   };

//   const handleStatusChange = (event) => {
//     setProduct({ ...product, status: event.target.value });
//   };
//   const handleVisibilityChange = (event) => {
//     setProduct({ ...product, visibility: event.target.value });
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setNewImages([...newImages, file]);
//     }
//   };

//   const handleRemoveImage = (index, type) => {
//     if (type === 'existing') {
//       setExistingImages(existingImages.filter((_, i) => i !== index));
//     } else {
//       setNewImages(newImages.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const totalImages = existingImages.length + newImages.length;
//     if (totalImages < 3 || totalImages > 5) {
//       setValidationMessage('You must upload at least 3 images and no more than 5 images.');
//       return;
//     }

//     if (product.quantity < 1) {
//       setValidationMessage('Quantity must be greater than 1 or equal to 1.');
//       return;
//     }
//     setValidationMessage('');

//     try {
//       // Upload new images and get their URLs
//       const newImageUrls = await Promise.all(newImages.map(async (image) => {
//         const imageRef = ref(storage, `images/${image.name}`);
//         await uploadBytes(imageRef, image);
//         return await getDownloadURL(imageRef);
//       }));

//       // Combine existing and new image URLs
//       const allImageUrls = [...existingImages, ...newImageUrls];

//       // Add or update product with the combined image URLs
//       if (pid) {
//         await updateProduct(pid, { ...product, images: allImageUrls });
//       } else {
//         console.log("Stage 2",product)

//         await addProduct({...product, images: allImageUrls });
//       }

//       Swal.fire({
//         icon: 'success',
//         title: 'Product saved successfully',
//         showConfirmButton: false,
//         timer: 1500,
//       });

//       // Reset form state
//       setProduct({
//         title: '',
//         category: '',
//         type: '',
//         description: [''],
//         quantity: '',
//         location: '',
//         status: '',
//         visibility: false,
//         images: [] });
//       setExistingImages([]);
//       setNewImages([]);
//       onSuccess();

//     } catch (e) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error saving product',
//         text: e.message,
//       });
//     }
//   };

//   const VisuallyHiddenInput = styled('input')({
//     clip: 'rect(0 0 0 0)',
//     clipPath: 'inset(50%)',
//     height: 1,
//     overflow: 'hidden',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     whiteSpace: 'nowrap',
//     width: 1,
//   });

//   return (
//     <Paper style={{ padding: 16 }}>
//       <Typography variant="h6">{pid ? 'Edit Product' : 'Add Product'}</Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Title"
//           name="title"
//           value={product.title}
//           onChange={handleChange}
//           fullWidth
//           margin="normal"
//           required
//         />
//         <FormControl fullWidth margin='normal'>
//           <InputLabel>Category</InputLabel>
//           <Select
//             name="category"
//             value={product.category}
//             onChange={handleChange}
//             required
//           >
//             {Object.keys(productFilters["categories"]).map((category) => (
//               <MenuItem key={category} value={category}>
//                 {category}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth margin='normal'>
//           <InputLabel>SubCategory</InputLabel>
//           <Select
//             name="subCategory"
//             value={product.subCategory}
//             onChange={handleChange}
//             required
//             disabled={!product.category}
//           >
//             {product.category &&
//               productFilters["categories"][product.category].map((subCategory) => (
//                 <MenuItem key={subCategory} value={subCategory}>
//                   {subCategory}
//                 </MenuItem>
//               ))}
//           </Select>
//         </FormControl>
//         {product.description.map((des, index) => (
//           <Grid container key={index} spacing={1} alignItems="center">
//             <Grid item xs={11.5}>
//               <TextField
//                 label={`Description Line ${index + 1}`}
//                 value={des}
//                 onChange={(event) => handleDescriptionChange(index, event)}
//                 fullWidth
//                 margin="normal"
//                 required
//               />
//             </Grid>
//             {index > 0 && (
//               <IconButton onClick={() => handleRemoveDescriptionLine(index)} style={{ marginTop: '1rem' }} aria-label="delete">
//                 <DeleteIcon />
//               </IconButton>
//             )}
//           </Grid>
//         ))}

//         <Button
//           onClick={addDescriptionLine}
//           variant="outlined"
//           startIcon={<AddIcon />}
//           color="success"
//           style={{ marginTop: '10px', marginBottom: '10px' }}
//         >
//           Add new line
//         </Button>
//         <TextField
//           label="Quantity"
//           name="quantity"
//           type="number"
//           value={product.quantity}
//           onChange={handleChange}
//           fullWidth
//           margin="normal"
//           required
//           inputProps={{ min: 1 }}
//         />
//         <TextField
//           label="Location"
//           name="location"
//           value={product.location}
//           onChange={handleChange}
//           fullWidth
//           margin="normal"
//           required
//         />

//         <FormControl component="fieldset" sx={{ ml: "14px" }}>
//         <FormLabel component="legend">Status :</FormLabel>
//         <RadioGroup
//           row
//           aria-label="status"
//           name="status"
//           value={product.status}
//           onChange={handleStatusChange}
//           required
//         >
//           <FormControlLabel value="For Sale" control={<Radio />} label="For Sale" />
//           <FormControlLabel
//             value="Sold Out"
//             disabled={!pid}
//             control={<Radio />}
//             label="Sold Out!"
//           />
//         </RadioGroup>
//         </FormControl><br/>
//         <FormControl component="fieldset" sx={{ ml: "14px" }}>
//         <FormLabel component="legend">Visibility :</FormLabel>
//         <RadioGroup
//           row
//           name="visibility"
//           value={product.visibility}
//           onChange={handleVisibilityChange}
//           required
//         >
//           <FormControlLabel value="visible" control={<Radio />} label="Visible" />
//           <FormControlLabel value="not" control={<Radio />} label="Not" />
//         </RadioGroup>
//         </FormControl><br/>

//         <Button
//           disabled={!user.approved}
//           accept='image/*'
//           multiple
//           onChange={handleImageChange}
//           component="label"
//           role={undefined}
//           variant="contained"
//           tabIndex={-1}
//           startIcon={<CloudUploadIcon />}
//           style={{ marginTop:'15px', marginBottom: '25px' }}
//         >
//         Upload Images
//         <VisuallyHiddenInput type="file" />
//         </Button>

//         <Grid container spacing={2}>
//           {existingImages.map((src, index) => (
//             <Grid item key={index}>
//               <div style={{ position: 'relative' }}>
//                 <img src={src} alt={`Existing Preview ${index}`} style={{ width: 150, height: 100, objectFit: 'cover' }} />
//                 <Button
//                 disabled={!user.approved}
//                   onClick={() => handleRemoveImage(index, 'existing')}
//                   variant="contained"
//                   color="error"
//                   size="small"
//                   style={{ position: 'absolute', top: 0, right: 0 }}
//                 >
//                   X
//                 </Button>
//               </div>
//             </Grid>
//           ))}
//           {newImages.map((file, index) => (
//             <Grid item key={index + existingImages.length}>
//               <div style={{ position: 'relative' }}>
//                 <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} style={{ width: 150, height: 120, objectFit: 'cover' }} />
//                 <Button
//                 disabled={!user.approved}
//                   onClick={() => handleRemoveImage(index, 'new')}
//                   variant="contained"
//                   color="error"
//                   size="small"
//                   style={{ position: 'absolute', top: 0, right: 0 }}
//                 >
//                   X
//                 </Button>
//               </div>
//             </Grid>
//           ))}
//         </Grid>
//         {validationMessage && <Typography color="error" sx={{ mt: '1rem'}} gutterBottom>{validationMessage}</Typography>}
//         <Button disabled={!user.approved} type="submit" variant="contained" color="success" style={{ marginTop: '25px' }}>
//           Save
//         </Button>
//         <Button disabled={!user.approved} onClick={onCancel} variant="outlined" style={{ marginTop: '25px', marginLeft: '10px' }}>
//           Cancel
//         </Button>
//       </form>
//     </Paper>
//   );
// };

// const ProductList = ({ onEditProduct, onViewProduct }) => {
//   const {user}=useAuth();
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   useEffect(() => {
//       const fetchProductList = async () => {
//           const fetchedProducts = await fetchProducts();
//           setProducts(fetchedProducts);
//       };
//       fetchProductList();
//   }, []);

//   const handleDelete = async (id) => {
//       try {
//           const result = await Swal.fire({
//               icon: 'warning',
//               title: 'Are you sure?',
//               text: "You won't be able to revert this!",
//               showCancelButton: true,
//               confirmButtonText: 'Yes, delete it!',
//               cancelButtonText: 'No, cancel!',
//           });

//           if (result.isConfirmed){
//             await deleteDoc(doc(db, 'products', id));
//             await updateDoc(doc(db, 'systemusers', user.uid), {
//               myProducts: arrayRemove(id)
//             })
//             setProducts(products.filter(product => product.pid !== id));

//               Swal.fire({
//                   icon: 'success',
//                   title: 'Deleted!',
//                   text: `The product has been deleted.`,
//                   showConfirmButton: false,
//                   timer: 1500,
//               });
//           }
//       } catch (error) {
//           //console.error("Error deleting product: ", error);
//           Swal.fire({
//               icon: 'error',
//               title: 'Error!',
//               text: 'There was an error deleting the product.',
//           });
//       }
//   };

//   const handleChangePage = (event, newPage) => {
//       setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//       setRowsPerPage(+event.target.value);
//       setPage(0);
//   };

//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//       [`&.${tableCellClasses.head}`]: {
//         backgroundColor: theme.palette.common.black,
//         color: theme.palette.common.white,
//       },
//       [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//       },
//     }));

//     const StyledTableRow = styled(TableRow)(({ theme }) => ({
//       '&:nth-of-type(odd)': {
//         backgroundColor: theme.palette.action.hover,
//       },
//       // hide last border
//       '&:last-child td, &:last-child th': {
//         border: 0,
//       },
//     }));

//   return (
//       <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 700 }} aria-label="customized table">
//               <TableHead>
//                   <TableRow>
//                       {/* <TableCell>ID</TableCell> */}
//                       <StyledTableCell align="center">Title</StyledTableCell>
//                       <StyledTableCell align="center">Category</StyledTableCell>
//                       <StyledTableCell align="center">SubCategory</StyledTableCell>
//                       {/* <StyledTableCell align="center">Description</StyledTableCell>
//                       <StyledTableCell align="center">Quantity</StyledTableCell>
//                       <StyledTableCell align="center">Location</StyledTableCell> */}
//                       <StyledTableCell align="center">Current Status</StyledTableCell>
//                       <StyledTableCell align="center">Visibility On Site</StyledTableCell>
//                       <StyledTableCell align="center">Actions</StyledTableCell>
//                   </TableRow>
//               </TableHead>
//               <TableBody>
//                 {products.length > 0 ?
//                   products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
//                   <StyledTableRow key={product.id}>
//                       {/* <TableCell>{product.id}</TableCell> */}
//                       <StyledTableCell align="center">{product.title}</StyledTableCell>
//                       <StyledTableCell align="center">{product.category}</StyledTableCell>
//                       <StyledTableCell align="center">{product.subCategory}</StyledTableCell>
//                       {/* <StyledTableCell align="justify">{product.description}</StyledTableCell>
//                       <StyledTableCell align="center">{product.quantity}</StyledTableCell>
//                       <StyledTableCell align="center">{product.location}</StyledTableCell> */}
//                       <StyledTableCell align="center">{product.status}</StyledTableCell>
//                       <StyledTableCell align="center">{(product.visibility === false) ? 'No':'Yes'}</StyledTableCell>

//                       <StyledTableCell align="center">
//                           <Button disabled={!user.approved} onClick={() => onViewProduct(product.id)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>View</Button>
//                           <Button disabled={!user.approved} onClick={() => onEditProduct(product.id)} variant="outlined" color="success" style={{ margin: '5px', width: '100%' }}>Edit</Button>
//                           <Button disabled={!user.approved} onClick={() => handleDelete(product.id)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>
//                       </StyledTableCell>
//                   </StyledTableRow>
//                  )) : (
//                   <TableRow>
//                     <StyledTableCell colSpan={8} align="center">
//                       No services found.
//                     </StyledTableCell>
//                   </TableRow>
//                  )}
//               </TableBody>
//           </Table>
//           <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={products.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//       </TableContainer>
//   );
// };

// const Image = styled('img')({
//   width: 200,
//   height: 200,
//   objectFit: 'cover',
//   margin: 5,
// });

// const ProductDetail = ({ pid, onBack }) => {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const fetchedProduct = await fetchSelectedProduct(pid);
//       if (fetchedProduct) {
//         setProduct(fetchedProduct);
//       } else {
//         console.log('No such document!');
//       }
//       setLoading(false);
//     };
//     fetchProduct();
//   }, [pid]);

//   if (loading) return <CircularProgress />;

//   return (
//     <Paper style={{ padding: 16 }}>
//       <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16 }}>
//         Back to Product List
//       </Button>
//       <Typography variant="h4">{product.title}</Typography>
//       <Typography variant="subtitle1">Category: {product.category}</Typography>
//       <Typography variant="subtitle1">SubCategory: {product.subCategory}</Typography>
//       <Typography variant="body1">Description:</Typography>
//       <ul>
//         {product.description.map((item, index) => (
//         <li key={index}><Typography variant='body1'>{item}</Typography></li>
//       ))}
//       </ul>
//       <Typography variant="body1">Quantity: {product.quantity}</Typography>
//       <Typography variant="body1">Location: {product.location}</Typography>
//       <Typography variant="body1">Status: {product.status}</Typography>
//       <Typography variant="body1">Visibility: {(product.visibility === false) ? 'No':'Yes'}</Typography>
//       <Grid container spacing={2} style={{ marginTop: 10, marginBottom: 10 }}>
//         {product.images && product.images.map((src, index) => (
//           <Grid item key={index}>
//             <Image src={src} alt={`Product ${index}`} style={{ width: '185px', height: '175px', objectFit: 'cover', borderRadius: '10px' }}/>
//           </Grid>
//         ))}
//       </Grid>
//     </Paper>
//   );
// };
