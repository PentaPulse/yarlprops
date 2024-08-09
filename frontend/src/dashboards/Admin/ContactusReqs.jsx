import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { Button, styled, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';

export default function ContactusRequests() {
  const [responses, setResponses] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [view, setView] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from the API
        const response = await axios.get('http://localhost:5000/api/c/responses');
        // Set responses data
        setResponses(response.data);
      } catch (err) {
        // Handle error
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCloseView = () => {
    setView(null);
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
              <StyledTableCell align="center">First name</StyledTableCell>
              <StyledTableCell align="center">Last name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Message</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.length > 0 ? (
              responses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(response => (
                <StyledTableRow key={response.id}>
                  <StyledTableCell align="center">{response.firstName}</StyledTableCell>
                  <StyledTableCell align="center">{response.lastName}</StyledTableCell>
                  <StyledTableCell align="center">{response.email}</StyledTableCell>
                  <StyledTableCell align="center">{response.status}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button 
                      onClick={() => setView(response)}
                      variant="outlined" 
                      color="secondary" 
                      style={{ margin: '5px', width: '100%' }}
                    >
                      View
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  No data available
                </StyledTableCell>
              </StyledTableRow>
            )}
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

      {/* View Dialog */}
      <Dialog open={!!view} onClose={handleCloseView}>
        <DialogTitle>Message Details</DialogTitle>
        <DialogContent>
          {view && (
            <>
              <Typography variant="h6">{view.firstName} {view.lastName}</Typography>
              <Typography variant="subtitle1">{view.email}</Typography>
              <Typography variant="body1">{view.status}</Typography>
              <Typography variant="body2" paragraph>{view.message}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Typography color="error" style={{ textAlign: 'center', margin: '10px' }}>
          Error fetching data: {error}
        </Typography>
      )}
    </>
  );
}
