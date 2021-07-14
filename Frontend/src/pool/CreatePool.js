import React, {Component} from 'react';
import axios from 'axios'
import NotAuth from "../NotFound/NotAuth";
import { Redirect } from "react-router-dom"
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Button from '@material-ui/core/Button'
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import InPoolStatus from "../NotFound/InPoolStatus";



const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        margin: 100,
    },
    buttons: {
        '& > *': {
            margin: theme.spacing(1),
        },
    }
}));

class CreatePool extends Component{
    constructor(props) {
        super(props);
        this.state = {
            leader_id: null,
            name: null,
            zip: null,
            neighborhood: null,
            description: null,
            checkIfInPool: null,
            redirect: false,
            msg: '',
            user: this.props.authUser,
            classes: useStyles,
            display: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            const sender = user.displayName; //TODO: get screenname of actor
            //check if already in a pool
            axios.get(process.env.REACT_APP_API_SERVER + '/pooler/search/' + sender)
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    this.setState({
                        checkIfInPool: data.pool,
                    });
                    if(!this.state.checkIfInPool){
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

    async handleSubmit(event){
        event.preventDefault();
        if(this.state.checkIfInPool){
            const poolname = this.state.checkIfInPool.name;
            this.setState({msg:  "Cannot create Pool! You have already in pool " + poolname});
        } else {
            const user = this.props.authUser;  //TODO: get user id based on how it is stored
            const email = user.email.toString();
            const leader_id = email;
            console.log("email" + leader_id);
            const name = this.state.name;
            const zip = this.state.zip;
            const neighborhood = !!(this.state.neighborhood)?this.state.neighborhood:"No neighborhood name yet.";
            const description = !!(this.state.description)?this.state.description:"No description yet.";

            const url = process.env.REACT_APP_API_SERVER + "/pool?leader_id=" + leader_id + "&name=" + name
                                + "&zip=" + zip + "&neighborhood=" + neighborhood + "&description=" + description;


            console.log(url);
            await axios.post(url)
                .then(res => {
                    alert("New pool created");
                    this.setState({
                        leader_id: null,
                        name: null,
                        zip: null,
                        neighborhood: null,
                        description: null,
                        redirect: true
                    })

                })
                .catch(err => {console.log(err);});
        }
    }

    handleInputChange(event){
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/mypool' />
        }
    }

    render() {
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            if(this.state.checkIfInPool){
                return(<InPoolStatus/>);
            } else {
                return (
                    <div>
                        {this.renderRedirect()}
                        {this.state.display && <h1>Create a New Pool</h1>}
                        {this.state.display && <Box>
                        <form onSubmit={this.handleSubmit} className={this.state.classes.root}>
                            <Grid item xs={12}>
                                <TextField
                                    name = 'name'
                                    label="Pool name"
                                    size="large"
                                    variant="outlined"
                                    value = {this.state.name}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Grid> <br/>
                            <Grid item xs={12}>
                                <TextField
                                    name = 'zip'
                                    label="Zip code"
                                    size="large"
                                    variant="outlined"
                                    value = {this.state.zip}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Grid><br/>
                            <Grid item xs={12}>
                                <TextField
                                    name = 'neighborhood'
                                    label="Neighborhood name"
                                    size="large"
                                    variant="outlined"
                                    value = {this.state.neighborhood}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Grid><br/>
                            <Grid item xs={12}>
                                <TextField
                                    name = 'description'
                                    label="Pool description"
                                    multiline
                                    rows={5}
                                    variant="outlined"
                                    value = {this.state.description}
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <br/><Button
                                type="submit"
                                size="medium"
                                variant="contained"
                                color="primary"
                                >Submit</Button>
                        </form></Box>}
                        <h3>{this.state.msg}</h3>
                    </div>
                )}
        }else {
            return (<NotAuth/>)
        }
    }
}

export default CreatePool;