import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import OrderDetailsDialog from '../OrderDetailsDialog'
import PickedUpButton from './PickedUpButton'
import DeliveredButton from './DeliveredButton'
import QRCodeButton from './QRCodeButton'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    borderRadius: 30,
    spacing: 10,
    margin: 10
  },
  root: {
    display: 'flex',
    minWidth: 1000,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  image: {
    width: 30,
    padding: '10%',
  },
}));

export default function PickUpMenuCard({ orderInfo, uid, handleStatusChange }) {
  const classes = useStyles();

  // console.log('render order info card')
  // console.log(uid)
  // console.log('pick up menu card', orderInfo)
  const fellowOrderIds = orderInfo.fellowOrders.map(order => order.id)
  // console.log(fellowOrderIds)
  return (
    <Card className={classes.root} variant="outlined">
      <CardMedia
        className={classes.image}
        image={orderInfo.store.image}
        title="Store Image"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Grid item xs={12}>
            <Typography component="h1" variant="subtitle2">{orderInfo.store.storeName}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Store Address: {orderInfo.store.storeAddress.address}
            </Typography>
            <OrderDetailsDialog
              orderId={orderInfo.id}
              orderItems={orderInfo.orderItems}
              subtotal={Number.parseFloat(orderInfo.subtotal).toFixed(2)}
              tax={Number.parseFloat(orderInfo.tax).toFixed(2)}
              fee={Number.parseFloat(orderInfo.fee).toFixed(2)}
              total={Number.parseFloat(orderInfo.total).toFixed(2)}
              address={orderInfo.address}
              receipentName={orderInfo.pooler.screenname}
            />
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <Typography component="h1" variant="subtitle2">Order # {orderInfo.id}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography component="h1" variant="subtitle2">Order Placed: {orderInfo.dateCreated}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2">Order Total: ${Number.parseFloat(orderInfo.total).toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography component="h1" variant="subtitle2">Status: {orderInfo.status}</Typography>
            </Grid>
          </Grid>
          <div className={classes.buttons}>
            {(orderInfo.status === 'SELF_PICK_UP') &&
              <Grid container justify="center">
                <QRCodeButton orderId={orderInfo.id} />
                <PickedUpButton handleStatusChange={handleStatusChange} uid={uid} orderId={orderInfo.id} />
              </Grid>}
            {(orderInfo.status === 'PICKED_UP_BY_OTHER') && <DeliveredButton handleStatusChange={handleStatusChange} orderId={orderInfo.id} />}
          </div>
          <div>
            {orderInfo.fellowOrders.length > 0 &&
              <Alert severity="info">
                You will pick up your fellow's order #{fellowOrderIds.join(',')} along with this order.
              </Alert>}
            {orderInfo.status === 'NOT_DELIVERED' &&
              <Alert severity="warning">
                Your fellow didn't receive your order, please contact him/her ASAP.
            </Alert>}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}