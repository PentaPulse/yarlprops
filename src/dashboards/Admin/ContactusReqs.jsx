import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, styled, Typography, Container, CircularProgress, TextField, ButtonGroup, Divider } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { fetchSelectedRequest } from '../../api/db/contactus';
import Swal from 'sweetalert2';
import { db } from '../../api/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '../../api/AuthContext';

export default function ContactusRequests() {
  const [viewingResponseId, setViewingResponseId] = React.useState(null);
  const {user}=useAuth()

  const handleViewresponse = (responseId) => {
    setViewingResponseId(responseId);
  }

  const handleCancel = () => {
    setViewingResponseId(null);
  };

  return (
    <>
      <Container>
        {user.approved?(viewingResponseId ? (
          <ContactusResponseDetail id={viewingResponseId} onBack={handleCancel} />
        ) : (
          <ContactusRequestsList onViewresponse={handleViewresponse} />
        )):'wait for admin approval'}
      </Container>
    </>
  );
};

function ContactusRequestsList({ onViewresponse }) {
  const {user} =useAuth()
  const [responses, setResponses] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    const fetchresponseList = async () => {
      const q = await getDocs(collection(db, 'contactus'))
      const responses = q.docs.map((doc) => doc.data())
      setResponses(responses);
    };
    fetchresponseList();
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

      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'responses', id));
        setResponses(responses.filter(response => response.id !== id));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `The response has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error deleting response: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error deleting the response.',
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
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">No</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((response, index) => (
              <StyledTableRow key={response.id}>
                <StyledTableCell align="center">{index + 1}</StyledTableCell>
                <StyledTableCell align="center">{response.firstName + ' ' + response.lastName}</StyledTableCell>
                <StyledTableCell align="center">{response.email}</StyledTableCell>
                <StyledTableCell align="center">{response.status}</StyledTableCell>
                <StyledTableCell align="center">
                  {response.status === 'new' ?
                    <Button disabled={!user.approved} onClick={() => onViewresponse(response.id)} variant="outlined" color="secondary" style={{ margin: '5px', width: '100%' }}>Reply</Button> :
                    <Button disabled={!user.approved} onClick={() => handleDelete(response.id)} variant="outlined" color="error" style={{ margin: '5px', width: '100%' }}>Delete</Button>}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={responses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}

const ContactusResponseDetail = ({ id, onBack }) => {
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchResponse = async () => {
      const fetchedResponse = await fetchSelectedRequest(id);
      if (fetchedResponse) {
        setResponse(fetchedResponse);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchResponse();
  }, [id]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 16, display: 'flex', flexDirection: 'column' }} >
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16, width: '25%' }}>
        Back to Response List
      </Button>
      <Typography variant="subtitle1">First name: {response.firstName}</Typography>
      <Typography variant="subtitle1">Last name: {response.lastName}</Typography>
      <Typography variant="body1">Email: {response.email}</Typography>
      <Typography variant="body1">Message: {response.message}</Typography>
      <Typography variant="body1">Status: {response.status}</Typography>
      <Divider/>
      <TextField
        label='Reply'
      />
      <ButtonGroup>
        <Button variant="outlined" color="success" style={{ margin: '5px', width: '50%' }}>Reply</Button>
        <Button variant="outlined" color="secondary" style={{ margin: '5px', width: '50%' }}>Cancel</Button>
      </ButtonGroup>
    </Paper>
  );
};
