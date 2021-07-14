import React, {Component} from 'react';
import axios from 'axios';
import NotAuth from "../NotFound/NotAuth";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import Alert from '@material-ui/lab/Alert';
import TextField from "@material-ui/core/TextField/TextField";
import SaveIcon from '@material-ui/icons/Save';
import Paper from '@material-ui/core/Paper';



function PoolerList(props){
    const poolers =  props.poolers;
    let link = "/sendmsg/";
    const ListPooler = poolers.map((pooler) =>
        <ul><a href={link + pooler.toString()}> {pooler} </a></ul>
    );
    return (
        <p> {ListPooler} </p>
    )
}

const useStyles = makeStyles({
    root: {
        minWidth: 155,
    },
    media: {
        height: 355,
    },
    title: {
        fontWeight: 700,
    }
});

class PoolInfo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            zip: null,
            description: null,
            neighborhood: null,
            poolers_in_pool: [],
            pool_id: null,
            user_id: null,
            leader_id: null,
            isLeader:false,
            msg:"",
            shouldShowButton: false,
            info:"",
            user: this.props.authUser,
            classes: useStyles,
            edit:false,
            cart: null,
        };
        this.handleQuit = this.handleQuit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    async componentDidMount() {
        // const myname = "zhang"; //TODO: get screenname of actor
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            const myname = user.displayName;
            console.log("user"+this.state.user + "name" + myname);
            await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/search/' + myname)
                .then(res => {
                    const data = res.data;
                    const pool = data.pool;
                    if(pool==null){
                            this.setState({msg:" You are not in any pool!"})
                    }
                    this.setState({
                        user_id: data.id,
                        name: pool.name,
                        zip: pool.zip,
                        description: pool.description,
                        neighborhood: pool.neighborhood,
                        pool_id: pool.id,
                    });
                    console.log("user: " + this.state.user_id);
                    if(this.state.pool_id != null){
                        this.setState({
                            msg: "Member List",
                            info: "Click name to send message",
                            shouldShowButton: true,
                        })
                    }
                    console.log("getmypool" + this.state.pool_id);
                    console.log("pool" + this.state.pool);
                })
                .catch(err => {
                    console.log(err);
                });

            await axios.get(process.env.REACT_APP_API_SERVER + '/pooler/pool/' + this.state.pool_id)
                .then(res => {
                    console.log("poolers in pool" + res);
                    const data = res.data;
                    this.setState({
                        poolers_in_pool: data});
                    console.log("poolers " + this.state.poolers_in_pool);
                })
                .catch(err => {
                    console.log(err);
                });

            await axios.get(process.env.REACT_APP_API_SERVER + '/pool/' + this.state.pool_id)
                .then(res => {

                    const data = res.data;
                    this.setState({
                        leader_id: data.leader.id,
                    });
                    if(this.state.user_id === this.state.leader_id){
                        this.setState({
                            isLeader: true,
                        });
                    }
                    console.log("leader: " + this.state.leader_id);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    async handleQuit(event){
        event.preventDefault();
        const user = this.state.user_id;
        const leader = this.state.leader_id;
        //check if cart is empty
        await axios.get(process.env.REACT_APP_API_SERVER + '/cart/' + this.state.user_id)
            .then(res => {
                this.setState({
                    cart: Object.keys(res.data),
                })
            });

        if(user === leader ){
            if(this.state.poolers_in_pool.length > 1){
                console.log("In leader delete fail");
                alert("QUIT NOT ALLOWED! \nAs the Pool leader, you can only quit and delete the pool when there is no pooler in the pool.");
            } else {
                if(this.state.cart.length > 0){
                    console.log("cart" + this.state.cart );
                    alert("Please clear cart before quit the pool!");
                } else {
                    console.log("In leader delete success");
                    await axios.delete(process.env.REACT_APP_API_SERVER + '/pool/' + this.state.pool_id)
                        .then(res => {
                            this.setState({
                                name: null,
                                zip: null,
                                description: null,
                                neighborhood: null,
                                poolers_in_pool: [],
                                pool_id: null,
                                user_id: null,
                                leader_id: null,
                                info: "",
                                msg: "You have quit and delete " + this.state.name,
                                shouldShowButton: false,
                                edit:false,
                                cart:null,
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }

        } else {
            console.log("In pooler quit success");
            if(this.state.cart.length > 0){
                console.log("cart" + this.state.cart );
                alert("Please clear cart before quit the pool!");
            } else {
                await axios.delete(process.env.REACT_APP_API_SERVER + '/pooler/' + this.state.user_id + '/' + this.state.pool_id)
                    .then(res => {
                        this.setState({
                            msg: "You have quit " + this.state.name,
                            name: null,
                            zip: null,
                            description: null,
                            neighborhood: null,
                            poolers_in_pool: [],
                            pool_id: null,
                            user_id: null,
                            leader_id: null,
                            info:"",
                            shouldShowButton: false,
                            edit:false,
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }


    handleEdit(event){
        event.preventDefault();
        this.setState({edit: true});

    }

    handleInputChange(event){
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        })
    }

    async handleSubmit(event){
        event.preventDefault();
        const name = this.state.name;
        const pool_id = this.state.pool_id;
        const neighborhood = !!(this.state.neighborhood)?this.state.neighborhood:"No neighborhood name yet.";
        const description = !!(this.state.description)?this.state.description:"No description yet.";

        const url = process.env.REACT_APP_API_SERVER + "/pool/" + pool_id + "?name=" + name
            + "&neighborhood=" + neighborhood + "&description=" + description;

        console.log(url);
        await axios.put(url)
            .then(res => {
                alert("Pool infor Saved");
                this.setState({edit: false});
            })
            .catch(err => {console.log(err);});
    }

    render() {
        const user = this.state.user;
        const isPooler = user && !user.email.toString().toLowerCase().endsWith('@sjsu.edu');
        if (isPooler) {
            return (
               < div>
                   <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                   <Paper>
                   <br/>{!this.state.edit && <h1>  {this.state.name}</h1>}
                       {this.state.edit && <h1> <TextField
                           name = 'name'
                           label="Pool name"
                           size="large"
                           variant="outlined"
                           defaultValue={this.state.name}
                           onChange={this.handleInputChange}
                           required
                       /></h1>}

                       {this.state.shouldShowButton && !this.state.edit&&
                       <Button
                       color="primary"
                       size="small"
                       variant="contained"
                       onClick = {this.handleQuit} > Quit </Button>}&nbsp;&nbsp;
                       {this.state.isLeader && !this.state.edit && this.state.shouldShowButton &&
                       <Button
                           color="secondary"
                           size="small"
                           variant="contained"
                           href={`/pool/edit`}
                           onClick = {this.handleEdit}> Edit </Button>}

                   {this.state.shouldShowButton && !this.state.edit &&
                   <Grid item xs={12} sm={12}>
                       <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
                           <Card className={this.state.classes.root}>
                                   <CardContent>
                                       <Typography variant="body2" color="textSecondary" component="p">
                                           {this.state.description}
                                       </Typography>
                                       <Typography variant="body2" color="primary" component="p">
                                           {this.state.neighborhood}
                                       </Typography>
                                       <Typography variant="body2" color="primary" component="p">
                                           {this.state.zip}
                                       </Typography>
                                   </CardContent>
                           </Card>
                       </Box>
                   </Grid> }

                   {this.state.edit &&
                       <form onSubmit={this.handleSubmit}>

                   <Grid item xs={12}>
                       <TextField
                       name = 'neighborhood'
                       label="Neighborhood name"
                       size="large"
                       variant="outlined"
                       defaultValue = {this.state.neighborhood}
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
                       defaultValue = {this.state.description}
                       onChange={this.handleInputChange}/></Grid>
                           <br/><Button
                           type="submit"
                           size="small"
                           variant="contained"
                           color="primary"
                           startIcon={<SaveIcon />}
                       >Save</Button></form>}
                       <br/>
                   </Paper>
                   <br/>
                       <h1> {this.state.msg} </h1>
                     <p>{this.state.info}</p>


                    <PoolerList
                        poolers = {this.state.poolers_in_pool}/>

                </div>
            )
        }  else {
            console.log("poolist: not pooler" + this.props.authUser);
            return (<NotAuth/>)
        }
    }
}


export default PoolInfo;