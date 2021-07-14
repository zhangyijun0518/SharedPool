
import React,{ useState } from 'react';
import Axios from 'axios';
import Stores from '../../stores/Stores';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as ROUTES from '../../constants/routes';

const useStyles = makeStyles({
  root: {
    //maxWidth: 400,
    width: '100%',
    padding: '30px',
    border: 1,
    borderRadius: 5,
  },
  media: {
    height: 140,
  },
});

const Account = (props) => {
  const { authUser } = props;
  const [nickname, setNickname]= useState('');
  const classes = useStyles();
  console.log("...Here in acccount:authUser status", authUser);
  const onClickHandler = ()=>{
    props.history.push(ROUTES.EDIT_NICKNAME);
  }

  const getUserByEmail = (email)=>{
    console.log("email passed in: ", `${email}`);
    try{
      return Axios.get(`${process.env.REACT_APP_API_SERVER}/user/email?email=${email}`, {})      
      .then(function (response) {
        setNickname(response.data.nickname);
      })
    } catch (error){
      console.log(error);
      return error;
    } 
  };

  if (authUser && authUser.emailVerified) {
    getUserByEmail(authUser.email);
    return (

      <Card >
      <CardActionArea className={classes.root}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Welcome,{authUser.displayName}!
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Email: {authUser.email}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Screenname: {authUser.displayName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Nickname: {nickname}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Button size="small" color="primary" onClick={onClickHandler}>
            Edit Nickname
      </Button>
    </Card>
    )
  }
  else {
    return <Stores />;
  }
};

export default Account;