import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { fetchStores, storesSelector } from './storesSlice'

// import { Store } from '../store/Store'
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Loading from '../component/Loading';

import HomeImg from '../home/imgs/home.png'


const useStyles = makeStyles({
  root: {
    width: "80%",
    minWidth: 330,
  },
  media: {
    height: 250,
  },
  title: {
    fontWeight: 700,
  }
});

const StoreCard = ({Store}) => {
  const classes = useStyles();

  return (
    <Grid item xs={4} sm={4}>
    <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
    
    <Card className={classes.root}>
          <CardActionArea href={`/store/${Store.id}`}>
        <CardMedia
          className={classes.media}
          image={Store.image}
          media="img"
          title={Store.storeName}
        />
        <CardContent>
          <Typography gutterBottom component="h2" className={classes.title}>
            {Store.storeName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {Store.storeAddress.address}
          </Typography>
        </CardContent>
      
      <CardActions>
        <Button size="small" color="primary" fullWidth={true}  >
          {Store.products.length} Products
        </Button>      
      </CardActions>

          </CardActionArea>
    </Card>
    
    </Box>
    </Grid>
  );
}

const Stores = ({authUser}) => {
  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');
  const dispatch = useDispatch()
  const { stores, loading, hasErrors } = useSelector(storesSelector, shallowEqual)

  useEffect(() => {
    dispatch(fetchStores())
  }, [dispatch])

  useEffect(()=>{
    // if(authUser){
    console.log("what's the current auth status on home page: ", authUser);
    //}
  },[authUser])

  const renderStores = () => {
    if (loading) return <Loading />
    if (hasErrors) return <p>Unable to display Stores.</p>

    console.log('stores: ', stores)
    return stores ? stores.map(Store => <StoreCard key={Store.id} Store={Store} excerpt />) : <p>No stores</p>
  }

  return (
    <section >
      { !window.location.href.includes('stores') &&
      <img src={HomeImg} alt={"Home"} style={{ width: "100%" }}/> 
  }
      <h1>Stores</h1>  
      {isAdmin && <Button variant="contained" color="primary" href="/store/add">Add Store</Button>}
      <Grid container spacing={3}>
        {renderStores()}
      </Grid>
    </section>
  )
}

export default Stores
