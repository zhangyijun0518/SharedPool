import React, {Component} from 'react';
import axios from 'axios'
import NotAuth from "../NotFound/NotAuth";
import NotReceiver from "../NotFound/NotReceiver";
import Button from '@material-ui/core/Button'
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import NotFound from "../NotFound/NotFound";
import Loading from '../component/Loading';


class PoolRefer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            user_id: null,
            msg: '',
            disabled : false,
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
                })
                .catch(err => {
                    console.log(err);
                });

            const thisUser = this.props.authUser;
            if(thisUser.email !== this.state.receiver.email){
                this.setState({accessControl: false});
            } else {
                this.setState({accessControl: true});
            }

        }

    }


    handleApprove(){
        if (this.state.disabled) {
            return;
        }
        this.setState({disabled: true});
        const { rid } = this.props.match.params;
        const { uid } = this.props.match.params;
        const url = process.env.REACT_APP_API_SERVER + '/pool/refer/toleader?sender_id=' +  uid + "&pooler_id=" + rid;
        console.log("url" + url);
        axios.post(url)
        // .then(res => res.json())
            .then(res => {
                console.log(res);
                alert("Refer has been send to pool leader");
            })
            .catch(err => {
                console.log(err);
            });


        this.setState({
            msg: 'Refer has been send to pool leader'
        })
    }

    handleReject(){
        if (this.state.disabled) {
            return;
        }
        this.setState({disabled: true});

        this.setState({
            msg: 'You have rejected the refer request'
        })
    }

    render() {
        const user = this.props.authUser;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            if(this.state.accessControl !== null && this.state.accessControl){
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
                            </Card>
                            <br/>
                            {/*<h1> {this.state.username} wants to join your pool </h1>*/}
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={this.state.disabled} onClick={this.handleApprove}> Support </Button> &nbsp;&nbsp;
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={this.state.disabled} onClick={this.handleReject}> Reject </Button>
                            <br/><br/><h2 style={{ color: 'blue' }}>{this.state.msg}</h2>
                        </div>
                    )
                } else { return (<NotFound/>)}
            } else if(this.state.accessControl !== null && !this.state.accessControl){
                console.log("access control"+this.state.accessControl);
                return(<NotReceiver/>);
            } else {return(<Loading/>);}
        }else {
            return (<NotAuth/>)
        }
    }
}


export default PoolRefer;