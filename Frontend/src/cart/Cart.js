import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import Loading from '../component/Loading';
import CartStore from './CartStore';
import EmptyCart from './EmptyCart';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

export default class Cart extends React.Component {
    state = {
        uid: localStorage.uid,
        storeCartItems: undefined,
        storeCosts: undefined,
    }

    fetchCartData = () => {
        // GET: http://localhost:8080/cart/{poolerId}
        console.log("uid in fetch cart data", this.state.uid)
        axios.get(process.env.REACT_APP_API_SERVER + '/cart/' + this.state.uid)
            .then(res => {
                console.log("object keys cart", Object.keys(res.data));
                const map = Array.from((Object.entries(res.data))).sort();
                this.setState({ storeCartItems: map });
            })
            .catch(err => {
                console.log(err);
            });
        // GET: http://localhost:8080/carttotal/{poolerId}
        axios.get(process.env.REACT_APP_API_SERVER + '/carttotal/' + this.state.uid)
            .then(res => {
                this.setState({ storeCosts: res.data });
            })
            .catch(err => {
                console.log(err);
            });

    }

    handleClickRemove = (productId) => {
        // http://localhost:8080/cart/10?productId=2
        console.log('handle click remove ' + productId.toString())
        axios.delete(process.env.REACT_APP_API_SERVER + '/cart/' + this.state.uid + '?productId=' + productId)
            .then(res => {
                console.log("deleted data", res.data);
                this.fetchCartData()
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleQuantityChange = (productId, quantity) => {
        console.log('handleQuantityChange')
        //PUT: http://localhost:8080/cart/10?productId=3&quantity=2
        const url = process.env.REACT_APP_API_SERVER + '/cart/' + this.state.uid + '?productId=' + productId + '&quantity=' + quantity;
        console.log(url)
        axios.put(url)
            .then(res => {
                console.log("data", res.data);
                this.fetchCartData()
            })
            .catch(err => {
                console.log(err);
            });
    };

    handleCheckout = () => {
        console.log('handleCheckout')
        //POST: http://localhost:8080/checkout/10
        const url = process.env.REACT_APP_API_SERVER + '/checkout/' + this.state.uid;
        console.log(url)
        axios.post(url)
            .then(res => {
                console.log("checkout data", res.data);
            })
            .catch(err => {
                console.log(err);
            });
        this.setState({ checkedOut: '/checkedout' })
    }

    render() {
        let key = 0;
        // console.log('checking state changes', this.state)
        console.log('authuser in cart', this.props.authUser)
        if (this.props.authUser === null || this.props.authUser.email.toString().toLowerCase().endsWith('@sjsu.edu')) {
            return <Typography variant="h6" component="h2">Please sign in with Pooler account to view this page</Typography>
        } else if (this.state.storeCartItems === undefined || this.state.storeCosts === undefined) {
            console.log(this.state.uid)
            console.log(this.state.storeCartItems)
            console.log(this.state.storeCosts)
            return <Loading />
        }
        else if ((this.state.storeCartItems.length) === 0) {
            return <EmptyCart />
        } else if (this.state.checkedOut) {
            return <Redirect to={this.state.checkedOut} />
        }
        else {
            console.log('firsttime render cart page')
            // console.log(this.state)
            // console.log(this.state.storeCartItems)
            return (
                <div>
                    <Typography variant="h6" component="h2">Shopping Cart</Typography>
                    <Grid container alignItems="center" direction="column" spacing={2}>
                        {this.state.storeCartItems.map(storeItems => (
                            <Grid item key={key++}>
                                <CartStore
                                    key={key * 2}
                                    store={storeItems[0]}
                                    costs={this.state.storeCosts}
                                    cartItems={storeItems[1]}
                                    handleQuantityChange={this.handleQuantityChange}
                                    handleClickRemove={this.handleClickRemove} />
                            </Grid>
                        ))}
                        <Typography variant="h6" component="h2">Cart Total: ${Number.parseFloat(this.state.storeCosts['Subtotal']).toFixed(2)}</Typography>
                        <Typography variant="h6" component="h2">Service Fee: ${Number.parseFloat(this.state.storeCosts['Service fee']).toFixed(2)}</Typography>
                        <Typography variant="h6" component="h2">Tax: ${Number.parseFloat(this.state.storeCosts['Tax']).toFixed(2)}</Typography>
                        <Typography variant="h6" component="h2">Total: ${Number.parseFloat(this.state.storeCosts['Total']).toFixed(2)}</Typography>
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            startIcon={<ShoppingCartIcon />}
                            onClick={this.handleCheckout}>
                            Check out
                        </Button>
                    </Grid>
                </div>
            )
        }
    }

    componentDidMount() {
        console.log("uid:", this.state.uid);
        console.log("Cart component did mount");
        this.fetchCartData();
    }
}