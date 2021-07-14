import React, {Component} from 'react';
import axios from 'axios'
import NotAuth from "../NotFound/NotAuth";
import NotReceiver from "../NotFound/NotReceiver";
import Button from '@material-ui/core/Button'
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card/Card";
import NotFound from '../NotFound/NotFound';
import Loading from '../component/Loading';

class PoolApprove extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            user_id: null,
            msg: '',
            disabled : false,
            checkIfInPool: null,
            receiver_id: '',
            receiver: '',
            accessControl: null,
            user: this.props.authUser,
        };
        this.handleApprove = this.handleApprove.bind(this);
        this.handleReject = this.handleReject.bind(this);
    }

    async componentDidMount() {
        console.log("In DidMount");
        const { uid } = this.props.match.params;
        console.log("uid" + uid);
        this.setState({user_id: uid});
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            //Get the  username
            await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/' + uid)
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    this.setState({
                        username: data.screenname,
                        checkIfInPool: data.pool,
                    });
                })
                .catch(err => {
                    console.log(err);
                });

            //get leader id
            const { rid } = this.props.match.params;
            this.setState({receiver_id: rid});
            await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/' + rid)
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    this.setState({
                        receiver: data,
                    });
                    console.log("receiver" + this.state.receiver);

                })
                .catch(err => {
                    console.log(err);
                });

            const thisUser = this.props.authUser;
            console.log("thisUser" + thisUser.email);
            if(this.state.receiver.email === thisUser.email){
                this.setState({accessControl: true});
            } else {
                this.setState({accessControl: false});
            }
        }

    }

    handleApprove(){
        if (this.state.disabled) {
            return;
        }
        this.setState({disabled: true});

        if (this.state.checkIfInPool == null){
            const { rid } = this.props.match.params;

            const url = process.env.REACT_APP_API_SERVER + '/pooler/' +  this.state.user_id + "/" + rid;
            console.log("url" + url);
            axios.put(url)
                .then(res => {
                    console.log(res);
                    alert("Application is approved");})
                .catch(err => {
                    console.log(err);
                });
            this.setState({msg:"Application is approved"});
        } else {
            this.setState({
                msg: "Approve Failed： " + this.state.username +' has already in a pool.'
            })
        }

    }

    handleReject(){
        if (this.state.disabled) {
            return;
        }
        this.setState({disabled: true});
        this.setState({
        msg: 'Application is rejected'
    })
    }

    render() {
        const user = this.props.authUser;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            if(this.state.accessControl === null){return(<Loading/>)}
            else if(this.state.accessControl){
                if(this.state.username){
                    return (
                        <div>
                            <Card >
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Hi, {this.state.receiver.screenname}!
                                        </Typography>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {this.state.username} wants to join your pool
                                        </Typography>
                                    </CardContent>
                            </Card> <br/>
                            {/*<h1> {this.state.username} wants to join your pool </h1>*/}
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={this.state.disabled}  onClick={this.handleApprove}> Approve </Button>&nbsp;&nbsp;
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    disabled={this.state.disabled}  onClick={this.handleReject}> Reject </Button>
                            <br/><br/><h2 style={{ color: 'blue' }}>{this.state.msg}</h2>
                        </div>
                    )
                } else { return (<NotFound/>)}
            } else {
                return(<NotReceiver/>);
            }
        }else {
            return (<NotAuth/>)
        }
    }
}

export default PoolApprove;