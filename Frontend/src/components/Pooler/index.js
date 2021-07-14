import React from 'react';
import Button from '@material-ui/core/Button';
import Stores from '../../stores/Stores';

const Pooler = ({authUser}) => {
  console.log("...Here in pooler :authUser status", authUser );
  if(authUser && authUser.emailVerified) {
    var e = authUser.email;
    var lcEmail = e.toString().toLowerCase();
    if(!lcEmail.endsWith('@sjsu.edu')){
    return (
      <div>
        <h1>Pooler Services:</h1>
        <Button variant="contained" color="primary" href="/pools">
          View All Pools
        </Button>
        <p/>
        <Button variant="contained" color="primary" href="/pool/create">
          Create Pool
        </Button>
        <p/>
        <Button variant="contained" color="primary" href="/mypool">
          My Pool
        </Button>
        <p/>
      </div>
    )}
    else{
      return <Stores/>;
    }
  } 
  else{
    return <Stores/>;
  }
};

export default Pooler;