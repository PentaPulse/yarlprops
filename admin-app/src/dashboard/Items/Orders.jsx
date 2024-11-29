import * as React from 'react';
import {
  Paper,  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TablePagination,  TableRow,TableSortLabel,styled} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { fetchOrders } from '../../api/db/items';

export default function Orders({ onViewresponse }) {
    const [orders, setOrders] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    React.useEffect(()=>{
        const fetchOrderlist =async()=>{
            const data = await fetchOrders()
            setOrders(data)
        }
        fetchOrderlist()
    },[])
       
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
  
    const handleSortRequest = (property) => {
      const isAscending = orderBy === property && order === "asc";
      setOrder(isAscending ? "desc" : "asc");
      setOrderBy(property);
    };
    const sortedRows = [...orders].sort((a, b) => {
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
  
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));
    const cols = [
        "ID",
        "title",
        "custName",
        "merchName",
        "itemType",
        "status"
      ];
    
      const headRow = (
        cols.map((col, index) => (
            <StyledTableCell key={index} align="center">
              {(col === "title" || col ==="custName"|| col ==="merchName" || col ==="itemType"|| col ==="status" ||col ==="visibility")? (
                <TableSortLabel
                  active={orderBy === col}
                  direction={orderBy === col ? order : "asc"}
                  onClick={() => handleSortRequest(col)}
                >
                  {col==="custName"?"Customer Name":col==="merchName"?"Merchant Name":col==="itemType"?"Item type":col.charAt(0).toUpperCase() + col.slice(1)}
                </TableSortLabel>
              ) : (
                col.charAt(0).toUpperCase() + col.slice(1) 
              )}
            </StyledTableCell>
          ))
      );
    return (
      <TableContainer component={Paper} sx={{ml:10,mt:10}}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {headRow}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
              <StyledTableRow key={order.id}>
                <StyledTableCell align="center">{order.id}</StyledTableCell>
                <StyledTableCell align="center">{order.title}</StyledTableCell>
                <StyledTableCell align="center">{order.custName}</StyledTableCell>
                <StyledTableCell align="center">{order.merchName}</StyledTableCell>
                <StyledTableCell align="center">{order.itemType}</StyledTableCell>
                <StyledTableCell align="center">{order.status}</StyledTableCell>
                
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    );
  }