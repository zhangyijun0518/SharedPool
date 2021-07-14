import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { fetchProduct, productSelector } from './productSlice'

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Loading from '../component/Loading';

import AddToCartButton from '../cart/AddToCartButton'


const useStyles = makeStyles({
  root: {
    minWidth: 155,
  },
  media: {
    height: 355,
  },
  title: {
    fontWeight: 700,
  }
});

const ProductCard = ({ Product }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={12}>
      <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={Product.imageUrl}
              component="img"
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

const Product = ({ match, authUser }) => {
  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');
  const dispatch = useDispatch()
  const { product, loading: productLoading } = useSelector(productSelector, shallowEqual)

  useEffect(() => {
    const { id } = match.params

    // dispatch(fetchComments(id))
    dispatch(fetchProduct(id))
  }, [dispatch, match])

  const renderHeader = (admin) => {
    if (productLoading) return <Loading />

    return (
      <Box>
        <h1>{product.productName} </h1>
        {admin && <Button variant="contained" color="primary" href={`/product/edit/${product.id}`} > Edit </Button>}
      </Box>
    )
  }

  const renderProduct = () => {
    if (productLoading) return <Loading />

    // console.log('product: ', product)
    return product.imageUrl ? <ProductCard key={product.id} Product={product} excerpt /> : <Alert severity="warning">no such product</Alert>;
  }

  return (
    <section>
      {renderHeader(isAdmin)}
      <Grid container spacing={3}>
        {renderProduct()}
      </Grid>
    </section>
  )
}

export default Product
