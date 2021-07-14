import React from 'react';
import { Button, Link, Typography } from '@material-ui/core';
import CheckedOutImg from './imgs/checkedout.png'

export default function CheckedOut(authUser) {
    if (authUser === null) {
        return <Typography variant="h6" component="h2">Please sign in first</Typography>
    } else {
        return (
            <div>
                <img src={CheckedOutImg} alt='checkout successfully'></img>
                <Typography variant="h6" component="h2">Thank you for using Cart Share</Typography>
                <Typography variant="h6" component="h2">You have successfully checked out!</Typography>
                <Link href="/orderhistory">
                    <Button variant="contained" color="primary">Go to order history</Button>
                </Link>
            </div>
        );
    }
}