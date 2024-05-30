import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import Categories from './Filters/Categories';
import ProductsContents from './ProContent/ProductsContents';
import SearchIcon from '@mui/icons-material/Search';
import { Divider, Grid, List, ListItem, ListItemText, Pagination, TextField } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../backend/db/products';

function Home() {

  return (
    <>
      <Grid container justifyContent='center' spacing={3} columns={12}>
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Slidshow />
        </Grid>
        <Divider />
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Search />
        </Grid>
        <Grid item md={3}>
          <Categories />
        </Grid>
        <Grid item md={9}>
          <ProductsContents />
          <Pagination sx={{width:'100%'}} count={10} />
        </Grid>
      </Grid>
    </>
  )
}

export default Home;

function Search() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        const q = query(collection(db, 'products'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResults(items);
      } else {
        setResults([]);
      }
    };

    fetchData();
  }, [searchTerm]);
  return (
    <>
    <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />      
      <List>
        {results.map((result) => (
          <ListItem key={result.id}>
            <ListItemText primary={result.name} />
          </ListItem>
        ))}
      </List>
    </>
  )
}