import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export default function PickedUpButton({ handleStatusChange, uid, orderId }) {

  const handleClickPickedUp = () => {
    console.log("markPickedUp")
    // http://localhost:8080/pickedup?poolerId=4&orderId=1
    const url = process.env.REACT_APP_API_SERVER + '/pickedup?poolerId=' + uid + '&orderId=' + orderId
    console.log(url)
    axios.put(url)
      .then(res => {
        console.log("pickedUpOrder", res.data);
      })
      .catch(err => {
        console.log(err);
      });
    handleStatusChange();
  }

  return (
    <div>
      <Button size="small" variant="contained" color="primary" onClick={handleClickPickedUp}>I picked up this order</Button>
    </div>
  );
}