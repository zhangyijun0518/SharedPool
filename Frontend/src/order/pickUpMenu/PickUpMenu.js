import React from 'react';
import axios from 'axios';
import { Tabs, Tab, Typography } from '@material-ui/core';
import PickUpTabPanel from './PickUpTabPanel';
import Loading from '../../component/Loading';

export default class OrderPickUpList extends React.Component {
    state = {
        uid: localStorage.uid,
        pickupOrderInfos: undefined,
        toDeliverOrderInfos: undefined,
        deliveredOrderInfos: undefined,
        tabValue: 0,
    }

    fetchOrderInfos = () => {
        // http://localhost:8080/pickUpOrders/{poolerId}
        axios.get(process.env.REACT_APP_API_SERVER + '/pickUpOrders/' + this.state.uid)
            .then(res => {
                console.log("pick up orderInfos", res.data);
                this.setState({ pickupOrderInfos: Array.from(res.data) });
            })
            .catch(err => {
                console.log(err);
            });
        axios.get(process.env.REACT_APP_API_SERVER + '/deliveryOrders/' + this.state.uid)
            .then(res => {
                console.log("to deliver orderInfos", res.data);
                this.setState({ toDeliverOrderInfos: res.data });
            })
            .catch(err => {
                console.log(err);
            });
        axios.get(process.env.REACT_APP_API_SERVER + '/deliveredOrders/' + this.state.uid)
            .then(res => {
                console.log("delivered orderInfos", res.data);
                this.setState({ deliveredOrderInfos: res.data });
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleStatusChange = () => {
        console.log('handleStatusChange')
        setTimeout(() => { this.fetchOrderInfos() }, 2000);
    };


    handleTabChange = (event, newValue) => {
        this.setState({ tabValue: newValue });
    };

    render() {
        if (this.props.authUser === null || this.props.authUser.email.toString().toLowerCase().endsWith('@sjsu.edu')) {
            return <Typography variant="h6" component="h2">Please sign in with Pooler account to view this page</Typography>
        }
        else if (this.state.pickupOrderInfos !== undefined && this.state.toDeliverOrderInfos !== undefined && this.state.deliveredOrderInfos !== undefined) {
            console.log('in render', this.state.pickupOrderInfos)
            console.log('type', typeof (this.state.pickupOrderInfos))
            return (
                <div>
                    <Tabs
                        value={this.state.tabValue}
                        onChange={this.handleTabChange}
                        aria-label="pick-up-order-tabs"
                        centered={true}
                    >
                        <Tab label="To Pick Up" />
                        <Tab label="To Deliver" />
                        <Tab label="Delivered" />
                    </Tabs>
                    <PickUpTabPanel
                        value={this.state.tabValue}
                        index={0}
                        orderInfos={this.state.pickupOrderInfos}
                        uid={this.state.uid}
                        handleStatusChange={this.handleStatusChange}
                    />
                    <PickUpTabPanel
                        value={this.state.tabValue}
                        index={1}
                        orderInfos={this.state.toDeliverOrderInfos}
                        uid={this.state.uid}
                        handleStatusChange={this.handleStatusChange}
                    />
                    <PickUpTabPanel
                        value={this.state.tabValue}
                        index={2}
                        orderInfos={this.state.deliveredOrderInfos}
                        uid={this.state.uid}
                        handleStatusChange={this.handleStatusChange}
                    />
                </div>
            )
        } else {
            return <Loading />
        }

    }


    componentDidMount() {
        console.log("uid:", this.state.uid);
        console.log("component did mount");
        this.fetchOrderInfos();
    }
}