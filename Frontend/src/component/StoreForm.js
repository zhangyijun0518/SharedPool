import React from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
// import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import axios from 'axios'
// import { fetchStores, storesSelector } from '../stores/storesSlice'

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

export default function StoreForm({Store, onSubmit}) {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  const onDelete = async () => {
    // console.log('id: ', Store.id);
    if (window.confirm("are you sure to delete this Store?")) {
      const res = await axios.get(`${process.env.REACT_APP_API_SERVER}/openorders_s?storeId=${Store.id}`)
      // console.log(res.data);
      if (res.data.length > 0) {
        alert("There's an open order of this store. Please handle that order first before deleting this stpre.");
      } else {
        axios.delete(`${process.env.REACT_APP_API_SERVER}/store/${Store.id}`);
        window.location = '/stores';
      }

    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
      <input type="hidden" id="id" name="id" defaultValue={!Store ? "" : Store.id} ref={register({ required: false })}/>
        <Grid container spacing={3}>
          <Grid item xs={12}> 
            <TextField
              required
              id="storeName"
              name="storeName"
              label="Store name"
              fullWidth
            defaultValue={!Store ? "" : Store.storeName }
              inputRef={register({ required: true })}
            />
          </Grid>
        {errors.storeName && errors.storeName.message}

          <Grid item xs={12}>
            <TextField
              required
            id="storeAddress.street"
            name="storeAddress.street"
            label="Street"
              fullWidth
            defaultValue={!Store.storeAddress ? "" : Store.storeAddress.street}
            inputRef={register({ required: true })}
            />
          </Grid>
        {errors.storeAddress && errors.storeAddress.message}

          <Grid item xs={4}>
            <TextField
              required
            id="storeAddress.city"
            name="storeAddress.city"
            label="City"
            fullWidth
            defaultValue={!Store.storeAddress ? "" : Store.storeAddress.city}
            inputRef={register({ required: true })}
            />
          </Grid>
        {errors.storeAddress && errors.storeAddress.message}

          <Grid item xs={4}>
            <TextField
              required
            id="storeAddress.state"
            name="storeAddress.state"
            label="State"
            defaultValue={!Store.storeAddress ? "" : Store.storeAddress.state}
            inputRef={register({ required: true })}
            fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              required
            id="storeAddress.zip"
            name="storeAddress.zip"
            label="zip"
            defaultValue={!Store.storeAddress ? "" : Store.storeAddress.zip}
            inputRef={register({ required: true })}
            fullWidth
            />
          </Grid>        

          <Grid item xs={12}>
            <TextField
              required
            id="image"
            name="image"
            label="Image URL"
            defaultValue={!Store ? "" : Store.image}
            inputRef={register({ required: true })}
            fullWidth
            />
          </Grid> 
        {errors.image && errors.image.message}

          <Grid item xs={12} sm={6} className={classes.buttons}>
              <Button variant="contained" color="primary" type="submit" >
                  {Store.id ? "Submit" : "Add"}
              </Button>
          {Store.id && 
              <Button variant="contained" color="secondary" onClick={onDelete} >
                Delete
              </Button>
              }
          </Grid>

        </Grid>
    </form>

  );
}