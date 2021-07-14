import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import axios from 'axios'
import { fetchStores, storesSelector } from '../stores/storesSlice'

import Loading from '../component/Loading';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    margin: 100,
  },
  buttons: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

export default function ProductForm({Product, onSubmit}) {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  const dispatch = useDispatch()
  const { stores, loading, hasErrors } = useSelector(storesSelector, shallowEqual)

  useEffect(() => {
    dispatch(fetchStores())
  }, [dispatch])

  const renderStores = (register) => {
    if (loading) return <Loading />
    if (hasErrors) return <p>Unable to display Stores.</p>

    console.log('stores: ', stores)
    return (
    <span component="fieldset">
      <FormLabel component="legend">Stores</FormLabel>
        { stores && stores.map(Store => 
        <FormControlLabel
          key={Store.id}
            control={<Checkbox value={Store.id} name='stores' inputRef={register} defaultChecked={Product && Store.id === Product.sid ? true : false}/>}
          label={Store.storeName}
            
        />) }
    </span>
    );

  }

  const onDelete = async () => {
    console.log('id: ', Product.id);
    if (window.confirm("are you sure to delete this product?")) {
      const res = await axios.get(`${process.env.REACT_APP_API_SERVER}/openorders_p?productId=${Product.id}`)
      // console.log(res.data);
      if (res.data.length > 0) {
        alert("There's an open order of this product. Please handle that order first before deleting this product.");
      } else {
        axios.delete(`${process.env.REACT_APP_API_SERVER}/product/${Product.id}`);
        window.location = '/products';
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}> 
            <TextField
              required
              id="productName"
              name="productName"
              label="Product name"
              fullWidth
            defaultValue={ !Product ? "" : Product.productName }
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="brand"
              name="brand"
              label="Brand"
              fullWidth
            defaultValue={!Product ? "" : Product.brand}
            inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="description"
              name="description"
              label="Description"
            defaultValue={!Product ? "" : Product.description}
              fullWidth
            inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="sku"
              name="sku"
              label="SKU"
              fullWidth
            defaultValue={!Product ? "" : Product.sku}
            inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="unit"
              name="unit"
              label="Unit"
            defaultValue={!Product ? "" : Product.unit}
              fullWidth
            inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={errors.price ? true : false}
              helperText={errors.price && errors.price.message}
              required
              id="price"
              name="price"
              label="Price"
              fullWidth
            defaultValue={!Product ? "" : Product.price}
            inputRef={register({ required: true,
            pattern: {
              value: /^[0-9.,]+$/i,
              message: "invalid number price"
            } })}
            />
          
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="imageUrl"
            name="imageUrl"
            label="Image URL"
              fullWidth
            defaultValue={!Product ? "" : Product.imageUrl}
            inputRef={register({ required: true })}
            />
          </Grid>
        {renderStores(register)}
        <Grid item xs={12} sm={6} className={classes.buttons}>
            <Button variant="contained" color="primary" type="submit" >
                {Product ? "Submit" : "Add"}
            </Button>
            {Product && 
            <Button variant="contained" color="secondary" onClick={onDelete} >
              Delete
            </Button>
            }
          </Grid>
        </Grid>
    </form>

  );
}