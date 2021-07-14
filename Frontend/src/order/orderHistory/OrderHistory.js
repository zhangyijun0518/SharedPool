import React from 'react';
import axios from 'axios';
import { Grid, Typography} from '@material-ui/core';
import OrderInfoCard from './OrderInfoCard';
import ContributionCard from './ContributionCard'
import Loading from '../../component/Loading';

export default class OrderHistory extends React.Component {
    state = {
        uid: localStorage.uid,
        orderInfos: undefined,
    }

    fetchOrderInfos = () =>{
        console.log("fetch order in order history", process.env.REACT_APP_API_SERVER + '/orders/' + this.state.uid)

        axios.get(process.env.REACT_APP_API_SERVER + '/orders/' + this.state.uid)
        .then(res => {
            console.log("orderInfos", res.data);
            this.setState({ orderInfos: res.data });
        })
        .catch(err => {
            console.log(err);
        });
    }

    handleStatusChange = () => {
        console.log('handleStatusChange')
        setTimeout(() => { this.fetchOrderInfos() }, 1000);
    };

    render() {
        if (this.props.authUser === null || this.props.authUser.email.toString().toLowerCase().endsWith('@sjsu.edu')) {
            return <Typography variant="h6" component="h2">Please sign in with Pooler account to view this page</Typography>
        }
        else if (this.state.orderInfos === undefined){
            return <Loading />
        }else if (this.state.orderInfos.length > 0){
            console.log('in order history, render when has data', this.state.orderInfos)
            return (
            <div>
                <Grid container justify="center" alignItems="center" direction="column" spacing={2}>
                    {/* <Grid item><Typography variant="h5" component="h2">Contribution</Typography></Grid> */}
                    
                    <Grid item>
                        <ContributionCard 
                            screenname = {this.state.orderInfos[0].pooler.screenname.charAt(0)} 
                            score = {this.state.orderInfos[0].pooler.contributionScore} 
                            status = {this.state.orderInfos[0].pooler.contributionStatus}/>
                    </Grid>
                    {/* <Typography variant="h5" component="h2">Orders</Typography> */}
                    {this.state.orderInfos.map(orderInfo => (
                        <Grid item key={orderInfo.id}>
                            <OrderInfoCard
                                key={orderInfo.id}
                                uid={this.state.uid}
                                orderInfo={orderInfo}
                                handleStatusChange={this.handleStatusChange}
                                status = {this.state.orderInfos[0].pooler.contributionStatus}/>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )}
        else return (<Typography variant="h5" component="h2">Your don't have any order yet</Typography>)
    }


    componentDidMount() {
        console.log("uid:", this.state.uid);
        console.log("component did mount");
        this.fetchOrderInfos();
    }
}