import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        width: 200,
    },
    media: {
        height: 200,
    },
});

export default function ProductCard({ productInfo }) {
    const classes = useStyles();

    return (
        <Grid item xs={3}>
            <Card className={classes.root}>
                <CardMedia
                    className={classes.media}
                    image={productInfo.product.imageUrl}
                    title={productInfo.product.productName}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {productInfo.product.productName}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2" component="h2">
                        Quantity: {productInfo.quantity}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2" component="h2">
                        Price: {productInfo.product.price}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}