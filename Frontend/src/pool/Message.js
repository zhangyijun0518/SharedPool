import React, {Component} from 'react';
import axios from 'axios'
import NotAuth from "../NotFound/NotAuth";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card/Card";
import { Redirect } from "react-router-dom"

class Message extends Component{
    constructor(props) {
        super(props);
        this.state = {
            receiver_name: '',
            sender_name: '',
            msg: '',
            user: this.props.authUser,
            checkIfExist: '',
            display: false,
            redirect: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            console.log("In DidMount");
            const user = this.props.authUser;  //TODO: get user id based on how it is store
            const sender = user.displayName;
            this.setState({
                sender_name: sender,
            });
        }

    }

    async handleSubmit(event){
        event.preventDefault();
        //Get the  receiver
        await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/search/' + this.state.receiver_name)
            .then(res => {
                console.log(res);
                const data = res.data;
                this.setState({
                    checkIfExist: data.email,
                });
            })
            .catch(err => {
                console.log(err);
            });

        if(this.state.checkIfExist){
            this.setState({redirect: true});
        } else{
            this.setState({msg: "User not found."});
        }

    }

    handleInputChange(event){
        this.setState({msg: null});
        const target = event.target;
        const value = target.value;
        this.setState({
            receiver_name: value,
        });

    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={"/sendmsg/" + this.state.receiver_name} />
        }
    }

    render() {
        const user = this.props.authUser;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            return (
                <div>
                    {this.renderRedirect()}
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                    {/*<br/><a href={"/mypool"}> My pool</a>*/}
                    <Card >
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Messages
                            </Typography>
                        </CardContent>
                    </Card>
                    {/*<h1>Messages</h1>*/}<br/>
                    <TextField
                        type="search"
                        variant="outlined"
                        size="small"
                        name = 'pooler_name'
                        helperText="Enter pooler name to send message"
                        value = {this.state.receiver_name}
                        onChange={this.handleInputChange}
                        required
                    />
                    <br/><br/>
                    <Button onClick={this.handleSubmit}
                            color="primary"
                            variant="contained">Find</Button>
                    <br/><br/><h3 style={{ color: 'blue' }}>{this.state.msg}</h3>
                </div>
            )
        }  else {
            console.log("poolist: not pooler" + this.props.authUser);
            return (<NotAuth/>)
        }
    }
}


export default Message;