import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { fetchStore, storeSelector, putStore } from './storeSlice'
import StoreForm from '../component/StoreForm'

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


const StoreEdit = ({ match, currentStore, authUser }) => {
  const dispatch = useDispatch()
  const { store, loading: StoreLoading } = useSelector(storeSelector, shallowEqual)
  const isAdmin = authUser && authUser.email.toString().toLowerCase().endsWith('@sjsu.edu');

  useEffect(() => {
    // console.log('currentStore: ', currentStore)
    if (isAdmin && !currentStore.id) {
      const { id } = match.params
      // console.log('id: ', id)
      dispatch(fetchStore(id))
    }

  }, [dispatch, match, currentStore, isAdmin])

  const onSubmit = (data) => {
    console.log('data: ', data)

    dispatch(putStore(data))
    window.location = `/store/${data.id}`;
  }

  const renderStore = () => {
    if (!currentStore && StoreLoading) return <Loading />
    currentStore = store
    console.log('Store: ', currentStore)
    const thisStore = currentStore && store
    return thisStore.id ? <StoreForm Store={thisStore} onSubmit={onSubmit} excerpt /> : <Alert severity="warning">no such Store</Alert>;
  }

  return (
    <section>
      {isAdmin && 
      <div>
        <h1>Edit Store</h1>
        <Grid container spacing={3}>
          {renderStore()}
        </Grid>
      </div>}
      {!isAdmin && <NoPermission/>}
    </section>
  )
}

export default StoreEdit
