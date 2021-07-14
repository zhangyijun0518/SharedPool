import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { fetchProduct, productSelector, putProduct } from './productSlice'
import ProductForm from '../component/ProductForm'

import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/core/styles';
import Loading from '../component/Loading';
import Alert from '@material-ui/lab/Alert';
import NoPermission from '../component/NoPermission';

// const useStyles = makeStyles({
//   root: {
//     minWidth: 155,
//   },
//   media: {
//     height: 355,
//   },
//   title: {
//     fontWeight: 700,
//   }
// });


const ProductEdit = ({ match, authUser }) => {
  const dispatch = useDispatch()
  const { product, loading: productLoading } = useSelector(productSelector, shallowEqual)
  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');

  useEffect(() => {
    const { id } = match.params
    if (isAdmin)
      dispatch(fetchProduct(id))
  }, [dispatch, match, isAdmin])

  const onSubmit = (data) => {
    // console.log('data: ', data)
    let {stores} = data;
    
    dispatch(putProduct({ ...data, id: product.id, store_ids: stores}))  
    window.location = `/product/${product.id}`;
  }

  const renderProduct = () => {
    if (productLoading) return <Loading />

    console.log('product: ', product)
    return product ? <ProductForm Product={product} onSubmit={onSubmit} excerpt /> : <Alert severity="warning">no such product</Alert>;
  }

  return (
  <section>
    {isAdmin && 
    <div>
    <h1>Edit Product</h1>
    <Grid container spacing={3}>
        {renderProduct()}
    </Grid>

    </div>
    }
    {!isAdmin && <NoPermission/>}
  </section>
  )
}

export default ProductEdit
