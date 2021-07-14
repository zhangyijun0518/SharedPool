import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export default function DeliveryConfirmation({ handleStatusChange, orderId }) {

  const handleClickReceived = () => {
    console.log("markReceived")
    console.log('/received/' + orderId)
    axios.put(process.env.REACT_APP_API_SERVER + '/received/' + orderId)
      .then(res => {
        console.log("receivedOrder", res.data);
      })
      .catch(err => {
        console.log(err);
      });
    handleStatusChange();
  }

  const handleClickNotDelivered = () => {
    console.log("markNotDelivered")
    console.log('/notdelivered/' + orderId)
    axios.put(process.env.REACT_APP_API_SERVER + '/notdelivered/' + orderId)
      .then(res => {
        console.log("updatedOrder", res.data);
      })
      .catch(err => {
        console.log(err);
      });
    handleStatusChange();
  }

  return (
    <div>
      <Button size="small" variant="contained" onClick={handleClickReceived}>Order Received</Button>
      <Button size="small" variant="outlined" onClick={handleClickNotDelivered}>Order Not received</Button>
    </div>
  );
}