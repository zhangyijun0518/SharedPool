import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';

export default function CartItem({ cartItem, handleQuantityChange, handleClickRemove }) {
    // console.log('cartItem', cartItem)
    const [number, setNumber] = React.useState(cartItem.quantity);

    const handleNumberChange = (event) => {
        setNumber(event.target.value);
        handleQuantityChange(cartItem.product.id, event.target.value);
    };

    const numberArray = Array.from(Array(11).keys())

    return (
        <Grid container spacing={2} alignContent='flex-start' alignItems='center'>
            <Grid item xs={2}>
                <img src={cartItem.product.imageUrl} alt={"grocery"} width="100" />
            </Grid>
            <Grid container item xs={4} direction="column">
                <Typography variant="h6" component="h2">
                    {cartItem.product.productName}
                </Typography>
                <Typography variant="subtitle1" component="h2">
                    {cartItem.product.brand}
                </Typography>
            </Grid>
            <Grid container item xs={2} direction="column">
                <Typography variant="h6" component="h2">
                    ${cartItem.product.price}
                </Typography>
                <Typography variant="h6" component="h2">
                    {/* productInfo.product.productName */}
                    unit: {cartItem.product.unit}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <Typography variant="h6" component="h2">
                    <Select
                        native
                        value={number}
                        onChange={handleNumberChange}
                        inputProps={{
                            name: 'number',
                            id: 'number-of-orders',
                        }}
                    >
                        {numberArray.map(i => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </Select>
                </Typography>
            </Grid>
            <Grid container item xs={2} direction="column">
                {/* <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleQuantityChange.bind(this, cartItem.product.id)}>Update</Button> */}
                <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<DeleteIcon />}
                    onClick={handleClickRemove.bind(this, cartItem.product.id)}>Remove</Button>
            </Grid>
        </Grid>
    )
}