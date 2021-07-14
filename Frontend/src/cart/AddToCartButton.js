import React from 'react';
import { Button, Select, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';

export default class AddToCartButton extends React.Component {

    state = {
        inPool: false,
        sameStore: false,
        quantity: 1
    }

    handleClickAddToCart = () => {
        console.log("click add to cart")
        const uid = localStorage.uid
        //PUT: http://localhost:8080/cart/10?productId=3&quantity=2
        const url = process.env.REACT_APP_API_SERVER + '/cart/' + uid + '?productId=' + this.props.productId + '&quantity=' + this.state.quantity;
        console.log(url)
        axios.post(url)
            .then(res => {
                console.log("updated product", res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleClickClearAndAddToCart = () => {
        console.log("click clear and add to cart")
        const uid = localStorage.uid
        //PUT: http://localhost:8080/cart/10?productId=3&quantity=2
        const url = process.env.REACT_APP_API_SERVER + '/clearandaddcart/' + uid + '?productId=' + this.props.productId + '&quantity=' + this.state.quantity;
        console.log(url)
        axios.post(url)
            .then(res => {
                console.log("updated product", res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleClickOpen = () => {
        console.log("handleClickOpen")
        this.setState({ open: true })
    };

    handleClose = () => {
        console.log("handleClose")
        this.setState({ open: false })
    };

    handleNumberChange = (event) => {
        this.setState({ quantity: event.target.value });
        console.log("new quantity", this.state.quantity)
    };

    render() {
        const numberArray = Array.from(Array(11).keys())
        const { productId, quantity } = this.props;
        if (!this.state.inPool) {
            return <Button size="small" variant="contained" color="primary" disabled>Add to cart</Button>
        } else {
            return (
                <div>
                    {!this.state.sameStore &&
                        <Alert severity="warning">
                            To add this product at different store, current cart will be cleared first.
                        </Alert>}
                    <Grid container alignContent="stretch">
                        <Grid item xs={4}>
                            <Select
                                native
                                variant='outlined'
                                value={this.state.quantity}
                                onChange={this.handleNumberChange}
                                inputProps={{
                                    name: 'number',
                                    id: 'number-of-orders',
                                }}
                            >
                                {numberArray.map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={8}>
                            {this.state.sameStore ?
                                <Button href="#text-buttons" color="primary" onClick={this.handleClickAddToCart}>Add to cart</Button> :
                                <Button href="#text-buttons" color="secondary" onClick={this.handleClickClearAndAddToCart}>Add to cart</Button>}
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }

    componentDidMount() {
        console.log("component did mount");
        const uid = localStorage.uid
        //GET: http://localhost:8080/canAddToCart?poolerId=48&productId=5
        if (uid !== undefined) {
            const url = process.env.REACT_APP_API_SERVER + '/canAddToCart?' + 'poolerId=' + uid + '&productId=' + this.props.productId;
            axios.get(url)
                .then(res => {
                    if (res.data !== null) {
                        this.setState({
                            inPool: res.data[0],
                            sameStore: res.data[1]
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}