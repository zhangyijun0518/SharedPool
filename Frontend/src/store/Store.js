import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import AddToCartButton from '../cart/AddToCartButton'

import { fetchStore, storeSelector } from './storeSlice'

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Loading from '../component/Loading';


const useStyles = makeStyles({
  root: {
    minWidth: 155,
  },
  media: {
    height: 155,
  },
  title: {
    fontWeight: 700,
  }
});

const ProductCard = ({ Product }) => {
  const classes = useStyles();

  return (
    <Grid item xs={2} sm={2}>
      <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
        <Card className={classes.root}>
          <CardActionArea href={`/product/${Product.id}`}>
            <CardMedia
              className={classes.media}
              image={Product.imageUrl}
              media="img"
              title={Product.productName}
            />
            <CardContent>
              <Typography gutterBottom component="h2" className={classes.title}>
                {Product.productName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {Product.description}
              </Typography>
              <Typography variant="body2" color="primary" component="p">
                ${Product.price}/{Product.unit}
              </Typography>

            </CardContent>
          </CardActionArea>
          <CardActions>
            <AddToCartButton productId={Product.id} quantity="1" />
          </CardActions>
        </Card>
      </Box>
    </Grid>
  );
}

const Store = ({ match, authUser }) => {
  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');
  const dispatch = useDispatch()
  const { store, loading: storeLoading } = useSelector(storeSelector, shallowEqual)

  useEffect(() => {
    const { id } = match.params

    // dispatch(fetchComments(id))
    dispatch(fetchStore(id))
  }, [dispatch, match])

  const renderHeader = (admin) => {
    if (storeLoading) return <Loading />

    return (
      <Box>
        <h1>{store.storeName}</h1>  
        {admin && <Button variant="contained" color="primary" href={`/store/edit/${store.id}`}>Edit</Button>}
        <h3>{store.storeAddress ? store.storeAddress.address : ''}</h3>
      </Box>
    )
  }

  const renderStore = () => {
    if (storeLoading) return <Loading />

    console.log('store: ', store)
    return store.products && store.products.length ? store.products.map(proudct => <ProductCard key={proudct.id} Product={proudct} excerpt />) :
      <Alert severity="warning">No products in store</Alert>
  }

  return (
    <section>
      {renderHeader(isAdmin)}
      <Grid container spacing={3}>
        {renderStore()}
      </Grid>
    </section>
  )
}

export default Store
