import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import CartItem from './CartItem'
import StoreImg from './imgs/store.png'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '70vw',
        textAlign: 'left'
        // height: '15vw'
    },
}));

const getStoreName = (store) => {
    if (store !== undefined) {
        var s = store.split(',')[1].split('=')[1];
        return s.substring(1, s.length - 1)
    } else {
        return 'Store Name'
    }
}

const getStoreImageUrl = (store) => {
    if (store !== undefined) {
        var s = store.split(',')[3].split('=')[1];
        return s.substring(1, s.length - 2)
    } else {
        return StoreImg
    }
}

export default function CartStore({ store, costs, cartItems, handleQuantityChange, handleClickRemove }) {
    const classes = useStyles();
    // var cardStyle = {
    //     display: 'block',
    //     width: '50vw',
    //     transitionDuration: '0.3s',
    //     height: '15vw'
    // }
    const storeName = getStoreName(store)
    const storeImageUrl = getStoreImageUrl(store)
    const subtotal = (costs === undefined) ? '0' : Number.parseFloat(costs[storeName]).toFixed(2)
    console.log('subtotal', typeof (costs[storeName]))
    // console.log('first time render cart store')
    // console.log(store, cartItems)
    // console.log('url', storeImageUrl)
    // console.log('cartItems', cartItems, typeof (cartItems))
    return (
        //<Card variant="outlined" style={cardStyle}>
        // console.log('cartItems', cartItems, typeof (cartItems))
        <Card className={classes.root} variant="outlined">
            <CardHeader
                avatar={<Avatar alt="Store" src={storeImageUrl} className={classes.large} />}
                title={storeName}
                subheader={'Subtotal: $' + subtotal}
            />
            <CardContent >
                {cartItems.map(item => (
                    <CartItem
                        key={item.id}
                        cartItem={item}
                        handleQuantityChange={handleQuantityChange}
                        handleClickRemove={handleClickRemove} />
                ))}
            </CardContent>
        </Card>
    );
}