import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export default function DeliveredButton({ handleStatusChange, uid, orderId }) {

  const handleClickPickedUp = () => {
    console.log("markDelivered")
    // http://localhost:8080/delivered/1
    axios.put(process.env.REACT_APP_API_SERVER + '/delivered/' + orderId)
      .then(res => {
        console.log("deliveredOrder", res.data);
      })
      .catch(err => {
        console.log(err);
      });
    handleStatusChange();
  }

  return (
    <div>
      <Button size="small" variant="contained" color="secondary" onClick={handleClickPickedUp}>I delivered this order</Button>
    </div>
  );
}