import React from 'react';
// import axios from 'axios';
import { Grid, Typography } from '@material-ui/core';
import ProductCard from './ProductCard'

export default function OrderDetails({ orderItems, subtotal, tax, fee, total, address, receipentName }) {

    console.log('details', orderItems)
    if (orderItems !== undefined) {
        return (
            <div>
                <Grid container justify="center" spacing={3}>
                    <Grid container item xs={8} spacing={2}>
                        {orderItems.map(productInfo => (
                            <ProductCard
                                key={productInfo.id}
                                productInfo={productInfo} />
                        ))}
                    </Grid>
                    <Grid container item xs={4} direction="column" spacing={3}>
                        <Grid item>
                            <Typography variant="h6" component="h2">
                                Order Summary:
                            </Typography>
                            <Typography variant="subtitle1" component="h3">
                                Tax: ${tax}
                            </Typography>
                            <Typography variant="subtitle1" component="h3">
                                Fee: ${fee}
                            </Typography>
                            <Typography variant="subtitle1" component="h3">
                                Subtotal: ${subtotal}
                            </Typography>
                            <Typography variant="subtitle1" component="h3">
                                Total: ${total}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {address != null &&
                                <div>
                                    <Typography variant="h6" component="h2">
                                        Receipent Screen Name:
                                    </Typography>
                                    <Typography variant="subtitle1" component="h2">
                                        {receipentName}
                                    </Typography>
                                    <Typography variant="h6" component="h2">
                                        Delivery Address:
                                    </Typography>
                                    <Typography variant="subtitle1" component="h2">
                                        {address.address}
                                    </Typography>
                                </div>}
                        </Grid>

                    </Grid>
                </Grid>
            </div>
        )
    } else {
        return <div></div>
    }
}