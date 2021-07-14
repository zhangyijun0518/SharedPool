import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import PickUpMenuCard from './PickUpMenuCard'

export default function PickUpTabPanel({ value, index, orderInfos, uid, handleStatusChange }) {

    // console.log('in pickup tab', orderInfos)
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
            {orderInfos.length > 0 ?
                <Grid container justify="center" alignItems="center" direction="column" spacing={2}>
                    {orderInfos.map(orderInfo => (
                        <Grid item key={orderInfo.id}>
                            <PickUpMenuCard
                                key={orderInfo.id}
                                orderInfo={orderInfo}
                                uid={uid}
                                handleStatusChange={handleStatusChange} />
                        </Grid>
                    ))}
                </Grid>
                : <Typography>No orders here.</Typography>}
        </div>
    );
}