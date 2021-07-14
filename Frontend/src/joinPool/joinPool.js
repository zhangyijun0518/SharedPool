import React, {Component} from 'react';
import axios from 'axios'
import NotAuth from "../NotFound/NotAuth";
import InPoolStatus from "../NotFound/InPoolStatus";
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';


class JoinPool extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pool_name: null,
            leader_name: null,
            poolers_in_pool: [],
            pooler_name: null,
            knowLeader: false,
            disabled: false,
            msg: null,
            sender_name: null,
            checkIfInPool: null,
            user: this.props.authUser,
            display:false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    async componentDidMount() {
        console.log("In DidMount");
        const { pid } = this.props.match.params;
        console.log("pid" + pid);
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            const user = this.props.authUser;
            console.log("join pool authuser" + user);
                const sender = user.displayName; //TODO: get screenname of actor
                this.setState({
                    sender_name: sender,
                });
                //Get the  pool info
                await axios.get(process.env.REACT_APP_API_SERVER + '/pool/' + pid)
                    .then(res => {
                        console.log("pool" + res);
                        const data = res.data;
                        const leader = data.leader;
                        this.setState({
                            pool_name: data.name,
                            leader_name: leader.screenname});
                    })
                    .catch(err => {
                        console.log(err);
                    });

                await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/pool/' + pid)
                    .then(res => {
                        console.log("poolers in pool" + res);
                        const data = res.data;
                        this.setState({
                            poolers_in_pool: data});
                    })
                    .catch(err => {
                        console.log(err);
                    });

                //check if already in a pool
                await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/search/' + sender)
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

        handleSubmit(event){
            event.preventDefault();
            const sender_name = this.state.sender_name; //TODO: get screenname of actor
            let pooler_name = this.state.pooler_name;
            let poolerList = this.state.poolers_in_pool;
            if(this.state.checkIfInPool){
                const poolname = this.state.checkIfInPool.name;
            this.setState({msg:  "Cannot Join Pool! You have already in pool " + poolname});
        } else if (poolerList.indexOf(pooler_name) < 0) {
            this.setState({msg: pooler_name + " is not in this pool" })
        } else {
            if(poolerList.indexOf(pooler_name) > -1){
                const url = process.env.REACT_APP_API_SERVER + '/pool/refer?sender='+ sender_name + "&name=" + pooler_name;
                console.log(url);
                 axios.post(url)
                    .then(res => {
                        alert("Join pool request has been send");})
                    .catch(err => {
                        console.log(err);
                    });
                this.setState({msg: "Join pool request has been send"});
            }
        }
    }

    handleInputChange(event){
        this.setState({msg: null})
        const target = event.target;
        const name = target.name;
        const value = target.name === "knowLeader" ? target.checked : target.value;
        console.log( "check value "+ target.checked);
        this.setState({
            [name]: value
        });

        if(target.checked){
            this.setState({disabled: true});
            this.setState({pooler_name: this.state.leader_name})
        } else {
            this.setState({disabled: false});
            if(this.state.pooler_name === this.state.leader_name){
                this.setState({pooler_name: ""})}
        }

    }

    render() {
        const user = this.props.authUser;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            if(this.state.checkIfInPool){
                return(<InPoolStatus/>);
            } else{
                return (
                     <div>
                         <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                         { this.state.display && <h1>Join {this.state.pool_name}</h1>}
                         {/*{ this.state.display && <h3>Enter Pool Member Name to get refer</h3>}*/}
                         { this.state.display && <form onSubmit={this.handleSubmit}>
                            <label style={{ color: 'red' }}>
                                I know the pool leader
                                <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                                          name="knowLeader"
                                          checked={this.state.knowLeader}
                                          onChange={this.handleInputChange}
                                />
                            </label><br/>
                             <TextField
                                 type="search"
                                 variant="outlined"
                                 size="small"
                                 name = 'pooler_name'
                                 helperText="Enter Pool Member Name to get refer"
                                 value = {this.state.pooler_name}
                                 onChange={this.handleInputChange}
                                 disabled={this.state.disabled}
                                 required
                             /><br/>
                             <br/><Button
                                    type="submit"
                                    Button color="primary"
                                    size="small"
                                    variant="contained"
                                    startIcon={<Icon>send</Icon>}>Submit</Button>
                             <br/><br/><h2 style={{ color: 'blue' }}>{this.state.msg}</h2>
                        </form>}
                    </div>
                )
            }
        }else {
            return (<NotAuth/>)
        }
    }
}


export default JoinPool;