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
import Loading from '../component/Loading';

class SendMessage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            receiver_name: '',
            sender_name: '',
            content: '',
            msg: '',
            user: this.props.authUser,
            checkIfExist: '',
            beforeload: true,
            display: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    async componentDidMount() {
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            console.log("In DidMount");
            const user = this.props.authUser;  //TODO: get user id based on how it is store
            const { name } = this.props.match.params;
            console.log("receive_name" + name);
            const sender = user.displayName;
            this.setState({
                sender_name: sender,
                receiver_name: name,

            });


            //Get the  receiver
            await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/search/' + name)
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    this.setState({
                        checkIfExist: data.email,
                        beforeload: false,
                    });
                    if(!this.state.checkIfExist){
                        this.setState({
                            display: true,
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }

    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.content.isEmpty){
            this.setState({msg: "Please enter the massage!"});
        } else {
            const url = process.env.REACT_APP_API_SERVER + '/pool/message?sender='+ this.state.sender_name +
                                                            "&receiver=" + this.state.receiver_name
                                                            +"&content=" + this.state.content;
            axios.post(url)
                .then(res => {
                    alert("Message has been send");})
                .catch(err => {
                    console.log(err);
                });
            const msg = this.state.content;
            this.setState({
                msg: "Message has been send: " + msg ,
                content: '',});
        }

    }

    handleInputChange(event){
        this.setState({msg: null});
        const target = event.target;
        const value = target.value;
        this.setState({
            content: value
        });

    }

    render() {
        const user = this.props.authUser;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            if(this.state.beforeload){
                return(<Loading/>)
            } else {
                if(this.state.checkIfExist && !this.state.beforeload){
                    return (
                        <div>
                            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                            {/*<br/><a href={"/mypool"}> My pool</a>*/}
                            <Card >
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Messages
                                    </Typography>
                                </CardContent>
                            </Card>
                            {/*<h1>Messages</h1>*/}
                            <br/> <h2 style={{ color: 'blue' }}> To {this.state.receiver_name} </h2>
                            <TextField
                                name = 'msg'
                                type = "text"
                                label="Type here..."
                                multiline
                                rows={10}
                                cols={10}
                                variant="outlined"
                                value = {this.state.content}
                                onChange={this.handleInputChange}
                                required
                            />
                            <br/><br/>
                            <Button onClick={this.handleSubmit}
                                    color="primary"
                                    variant="contained"
                                    endIcon={<Icon>send</Icon>}>Send</Button>
                            <br/><br/><h3 style={{ color: 'blue' }}>{this.state.msg}</h3>
                        </div>
                    )
                } else {
                    return (<h1 align="center"> User Not Found</h1>);
                }
            }
        } else {
            console.log("poolist: not pooler" + this.props.authUser);
            return (<NotAuth/>)
        }
    }
}


export default SendMessage;