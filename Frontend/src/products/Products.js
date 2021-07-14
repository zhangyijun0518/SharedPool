import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { fetchProducts, productsSelector } from './productsSlice'

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
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';

import AddToCartButton from '../cart/AddToCartButton'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 155,
  },
  media: {
    height: 155,
  },
  title: {
    fontWeight: 700,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  header: {
    backgroundColor: '#add8e6',
  }
}));

const ProductCard = ({ Product }) => {
  const classes = useStyles();
  return (
    <Grid item xs={2} sm={2}>
      <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
        <Card className={classes.root}>
          <CardActionArea href={`/store/${Product.sid}`}>
            <CardHeader
              avatar={
                <Avatar alt={Product.sname} src={Product.simage} />
              }
              title=""
              subheader={Product.sname}
              className={classes.header}
            />
          </CardActionArea>
          <CardActionArea href={`/product/${Product.id}`}>
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

const Products = ({ match, authUser }) => {
  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');
  const dispatch = useDispatch()
  const { products, loading, hasErrors } = useSelector(productsSelector, shallowEqual)

  const [key, setKey] = useState('');

  useEffect(() => {
    const { q } = match.params
    setKey(q);
    console.log('key: ', q)
    dispatch(fetchProducts(q))
  }, [dispatch, match])


  const renderProducts = () => {
    if (loading) return <Loading />
    if (hasErrors) return <p>Unable to display products.</p>

    console.log('products: ', products)
    return products.length ? products.map(p => <ProductCard key={p.id} Product={p} excerpt />) : <Alert severity="warning">no such product</Alert>;
  }

  return (
    <section>
      <h1>Products {key && `search result for "${key}"`} </h1> 
      {isAdmin && <Button variant="contained" color="primary" href="/product/add">Add Product</Button>}
      <Grid container spacing={3}>
        {renderProducts()}
      </Grid>
    </section>
  )
}

export default Products
