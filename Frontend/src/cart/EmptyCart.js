import React from 'react';
import EmptyCartImg from './imgs/emptycart.png'
import { Typography, Button, Link } from '@material-ui/core';

export default function EmptyCart() {

    return (
        <div>
            <img src={EmptyCartImg} alt='Empty Cart'></img>
            <Typography variant="h6" component="h2">Your Shopping Cart is empty.</Typography>
            <Link href="/">
                <Button variant="contained" color="primary">Shop Now</Button>
            </Link>
        </div>
    );
}