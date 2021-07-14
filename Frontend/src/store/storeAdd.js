import React from 'react'
import axios from 'axios'
import StoreForm from '../component/StoreForm'
import Grid from '@material-ui/core/Grid';
import NoPermission from '../component/NoPermission'
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "80%",
//     margin: 20,
//   },
// }));

export default function Addstore({ authUser }) {
  // const classes = useStyles();
  // console.log('auth: ', authUser)

  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');
  const onSubmit = (data) => {
    const link = `${process.env.REACT_APP_API_SERVER}/store`;
    console.log(link, data)
    axios.post(link, data);
    window.location = '/';
  }

  return (
    <section>
      { isAdmin &&
      <div>
        <h1>Add store</h1>
        <Grid container spacing={3}>
          <StoreForm onSubmit={onSubmit} Store={{}}></StoreForm>
        </Grid>
      </div>
      } 
      {!isAdmin &&
        <NoPermission/>
      }
    </section>
  );
}