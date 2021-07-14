import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, Grid } from '@material-ui/core';
import DeliveryConfirmation from './DeliveryConfirmation'
import OrderDetailsDialog from '../OrderDetailsDialog'
import PickUpByOthersDialog from './PickUpByOthersDialog'
import PickUpBySelfDialog from './PickUpBySelfDialog'


const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    borderRadius: 30,
    spacing: 10,
    margin: 10
  },
  root: {
    display: 'flex',
    minWidth: 800,
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

export default function OrderInfoCard({ orderInfo, uid, status, handleStatusChange }) {
  const classes = useStyles();

  console.log('render order info card')

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
            {/* render different button in different order status */}
            {(orderInfo.status === 'PLACED') &&
              <div>
                <Typography variant="subtitle2" color="secondary">Please choose to self pick up or pick up by other in two days, or your order will be canceled</Typography>
                <Grid container justify="center">
                  <PickUpBySelfDialog
                    handleStatusChange={handleStatusChange}
                    orderId={orderInfo.id}
                    uid={uid}
                  />
                  <PickUpByOthersDialog
                    handleStatusChange={handleStatusChange}
                    status={status}
                    orderId={orderInfo.id}
                  />
                </Grid>
              </div>
            }
            {(orderInfo.status === 'DELIVERED') &&
              <DeliveryConfirmation handleStatusChange={handleStatusChange} orderId={orderInfo.id} />
            }
          </div>
        </CardContent>
      </div>
    </Card>
  );
}