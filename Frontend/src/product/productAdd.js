import React from 'react'
import axios from 'axios'
import ProductForm from '../component/ProductForm'
import Grid from '@material-ui/core/Grid';
import NoPermission from '../component/NoPermission';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "80%",
//     margin: 20,
//   },
// }));

export default function AddProduct({ authUser}) {
  // const classes = useStyles();
  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');
  const onSubmit = (data) => {
    console.log('data: ', data)
    const { stores } = data;
    const link = `${process.env.REACT_APP_API_SERVER}/product?store_ids=${stores}`;
  
    axios.post(link, data);
    window.location = '/products';
  }

  return (
    <section>
      {isAdmin && 
      <div>
        <h1>Add Product</h1>
        <Grid container spacing={3}>
          <ProductForm onSubmit={onSubmit}></ProductForm>
        </Grid>
      </div>}
      {!isAdmin && <NoPermission/>}
    </section>
  );
}