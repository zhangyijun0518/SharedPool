import React, {Component} from 'react';
import axios from 'axios'
import PoolList from './PoolList';
import NotAuth from "../NotFound/NotAuth";
import { Redirect } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
        margin: theme.spacing(1),
        },
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
}));

class PoolResults extends Component{
    constructor(props) {
        super(props);
        this.state = {
            keywords: '',
            pools: [],
            user: this.props.authUser,
            classes: useStyles,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.redirect = this.redirect.bind(this);


    }



   componentDidMount() {
        console.log("In DidMount poollist");
       // if (this.props.authUser !== null) {
       //     this.setState({
       //         user: this.props.authUser,
       //     });
       //     console.log("authUser" + this.state.user);
       // }
        const url = process.env.REACT_APP_API_SERVER + '/pool';
        console.log(url);
        axios.get(process.env.REACT_APP_API_SERVER + '/pool')
            // .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({pools: res.data});
                if((this.state.pools.length < 1)){
                    this.setState({msg : "No Pool yet!"})
                }
            })
            .catch(err => {
                console.log(err);
            });

    }

    handleInputChange(event){
        event.preventDefault();
        console.log('handleInputChange');
        const target = event.target;
        const value = target.value;
        this.setState({
            keywords: value
        });
        console.log('input: ' + this.state);

    }

    async handleSearch(event){
        event.preventDefault();
        this.setState({pools: []});
        this.setState({msg : ""})
        console.log('handleSearch');
        await axios.get(process.env.REACT_APP_API_SERVER + '/pool/search', {
            params: {
                keywords: this.state.keywords,
            }
        })
            .then(res => {
                this.setState({pools: res.data});
                if((this.state.pools.length < 1)){
                    this.setState({msg : "No result found!"})
                }
                console.log('search: ' + this.state);
            })
            .catch(err => {
                console.log(err);
            });


    }

    handleReset(event){
        event.preventDefault();
        console.log('handleReset');
        this.setState({keywords:""});
        axios.get(process.env.REACT_APP_API_SERVER + '/pool')
        // .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({pools: res.data});
            })
            .catch(err => {
                console.log(err);
            });

    }

    redirect = () => {
        return <Redirect to='/pool/create' />
    }


    render() {
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            console.log("poolist authUser" + this.props.authUser);
            return (
                <div  className={this.state.classes.root} >
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                    <Paper>
                    <h1>&nbsp;&nbsp; Pools&nbsp;&nbsp;
                        <Button color="primary"
                                size="small"
                                variant="contained"
                                href={`/pool/create`}
                                startIcon={<Icon >add_circle</Icon>}>New</Button><br/>
                    </h1>
                    <TextField
                        type="search"
                        label="Search Pool"
                        variant="outlined"
                        size="small"
                        helperText= "Enter pool name, zip code or neighborhood name"
                        value={this.state.keywords}
                        onChange={this.handleInputChange}
                        required
                    />
                    <Button size="medium"
                            variant="contained"
                            className={this.state.classes.margin}
                            onClick={this.handleSearch}>Search</Button>

                    <br/><br/>
                    </Paper>

                    <PoolList
                        pools={this.state.pools}/><br/><br/>
                    <h2>{this.state.msg}</h2>
                </div>
            )
        } else {
            console.log("poolist: not pooler" + this.props.authUser);
            return (<NotAuth/>)
        }
    }
}

export default PoolResults;