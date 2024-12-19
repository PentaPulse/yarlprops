import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Badge,
} from "@mui/material";
import { countAdmins, countUsers, fetchUserList } from "../api/db/users";
import { countProducts } from "../api/db/products";
import { countservices } from "../api/db/services";
import { countRentals, fetchRentals } from "../api/db/rentals";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { fetchProducts } from "../api/db/products";
import { fetchServices } from "../api/db/services";

import { db } from "../api/firebase";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const [adminCount, setadminCount] = React.useState(0);
  const [merchantCount, setmerchantCount] = React.useState(0);
  const [customerCount, setcustomerCount] = React.useState(0);
  const [productCount, setProductCount] = React.useState(0);
  const [serviceCount, setServiceCount] = React.useState(0);
  const [rentalCount, setRentalCount] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCounts = async () => {
      const admins = await countAdmins();
      const merchants = await countUsers(true); //ismerchant
      const customers = await countUsers(false); //ismerchant
      const products = await countProducts();
      const rentals = await countRentals();
      const services = await countservices();
      setadminCount(admins);
      setmerchantCount(merchants);
      setcustomerCount(customers);
      setProductCount(products);
      setRentalCount(rentals);
      setServiceCount(services);
    };
    fetchCounts();
  }, []);

  const cards = (title, count) => {
    return (
      <>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            width: 120,
            height: 100,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{count}</Typography>
        </Paper>
      </>
    );
  };

  const userCounts = [
    ["Admins", adminCount],
    ["Merchants", merchantCount],
    ["Customers", customerCount],
  ];
  const itemCounts = [
    ["Products", productCount],
    ["Rentals", rentalCount],
    ["Services", serviceCount],
  ];
  return (
    <>
      <Grid item spacing={2} display={"flex"} gap={2}>
        {userCounts.map((userc) => cards(userc[0], userc[1]))}
      </Grid>
      <Grid item spacing={2} display={"flex"} gap={2}>
        {itemCounts.map((itemc) => cards(itemc[0], itemc[1]))}
      </Grid>
      <Grid item xs={12}>
        <UsersTable navigate={navigate} />
      </Grid>
      <Grid item xs={12}>
        <ContactResponsesTable navigate={navigate} />
      </Grid>
      <Grid item xs={12}>
        <ProductsTable navigate={navigate} />
      </Grid>
      <Grid item xs={12}>
        <RentalsTable navigate={navigate} />
      </Grid>
      <Grid item xs={12}>
        <ServicesTable navigate={navigate} />
      </Grid>
    </>
  );
}

function UsersTable({ navigate }) {
  const { user } = useAuth();
  const [users, setUsers] = React.useState([]);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const data = await fetchUserList();
      setUsers(data);
    }
    fetchData();
  }, []);

  const cols = ["No", "Name", "Email", "Role"];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>
      <Paper sx={{ width: "100%", mb: 4 }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {cols.map((column, index) => (
                  <TableCell
                    key={index}
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, 5).map((usr, index) => (
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{usr.firstName + " " + usr.lastName}</TableCell>
                  <TableCell>{usr.email}</TableCell>
                  <TableCell>
                    {usr.isMerchant ? "Merchant" : "Customer"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/customerlist")}
          sx={{ mt: 2 }}
        >
          See all customers
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/merchantlist")}
          sx={{ mt: 2 }}
        >
          See all merchants
        </Button>
      </Paper>
    </>
  );
}

function ContactResponsesTable({ navigate }) {
  const [responses, setResponses] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const q = await getDocs(
          query(
            collection(db, "contactus"),
            where("status", "==", "new"),
            limit(5)
          )
        );
        const responses = q.docs.map((doc) => doc.data());
        setResponses(responses);
      } catch (err) {
        //setError(err.message);
      }
    }
    fetchData();
  }, []);

  const cols = ["No", "Name", "Email", "Status", "Message"];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Contact Us Responses
      </Typography>
      <Paper sx={{ width: "100%", mb: 4 }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {cols.map((column, index) => (
                  <TableCell
                    key={index}
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.length > 0 ? (
                responses.map((response, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {response.firstName + " " + response.lastName}
                    </TableCell>
                    <TableCell>{response.email}</TableCell>
                    <TableCell>{response.status}</TableCell>
                    <TableCell>{response.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={cols.length}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/contactreqs")}
          sx={{ mt: 2 }}
        >
          See all
        </Button>
      </Paper>
    </>
  );
}

function ProductsTable({ navigate }) {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchProductList = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    fetchProductList();
  }, []);
  const cols = ["No", "Name", "Quantity", "Visibility"];
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Products
      </Typography>
      <Paper sx={{ width: "100%", mb: 4 }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {cols.map((column) => (
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? (
                products.slice(0, 5).map((product, index) => (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {product.visibility === false ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={cols.length}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/productlist")}
          sx={{ mt: 2 }}
        >
          See all
        </Button>
      </Paper>
    </>
  );
}

function RentalsTable({ navigate }) {
  const [rentals, setRentals] = React.useState([]);

  React.useEffect(() => {
    const fetchRentalsList = async () => {
      const fetchedRentals = await fetchRentals();
      setRentals(fetchedRentals);
    };
    fetchRentalsList();
  }, []);
  const cols = ["No", "Name", "Quntity", "Visibility"];
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Rentals
      </Typography>
      <Paper sx={{ width: "100%", mb: 4 }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {cols.map((column) => (
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rentals.length > 0 ? (
                rentals.slice(0, 5).map((rental, index) => (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{rental.title}</TableCell>
                    <TableCell>{rental.quantity}</TableCell>
                    <TableCell>
                      {rental.visibility === false ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={cols.length}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/rentallist")}
          sx={{ mt: 2 }}
        >
          See all
        </Button>
      </Paper>
    </>
  );
}

function ServicesTable({ navigate }) {
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const fetchServiceList = async () => {
      const fetchedServices = await fetchServices();
      setServices(fetchedServices);
    };
    fetchServiceList();
  }, []);
  const cols = ["No", "Name", "Category", "Visibility"];
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Services
      </Typography>
      <Paper sx={{ width: "100%", mb: 4 }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {cols.map((column) => (
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length > 0 ? (
                services.slice(0, 5).map((service, index) => (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{service.title}</TableCell>
                    <TableCell>{service.location}</TableCell>
                    <TableCell>
                      {service.visibility === false ? "No" : "Yes"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={cols.length}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/servicelist")}
          sx={{ mt: 2 }}
        >
          See all
        </Button>
      </Paper>
    </>
  );
}
