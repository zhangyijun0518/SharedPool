import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios'

export default function PickUpChoice({ handleStatusChange, orderId, status }) {

  const [open, setOpen] = React.useState(false);
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [zip, setZip] = React.useState('');

  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleZipChange = (event) => {
    setZip(event.target.value);
  };

  const handleClickOpen = () => {
    console.log("handleClickOpen")
    setOpen(true);
  };

  const handleClose = () => {
    console.log("handleClose")
    setOpen(false);
  };

  const handleConfirm = () => {
    // http://localhost:8080/chooseotherpickup/1?street=test&city=test&state=CA&zip=12345
    console.log('address', street, city, state, zip)
    if (street === '' || city === '' || state === '' || zip === '') {
      //TODO add some alert to fill the form
    }
    else {
      const url = process.env.REACT_APP_API_SERVER + '/chooseotherpickup/' + orderId + '?street=' + street + '&city=' + city + '&state=' + state + '&zip=' + zip
      axios.get(url)
        .then(res => {
          console.log(url)
          console.log("updatedOrderInfo", res.data);
        })
        .catch(err => {
          console.log(err);
        });
      handleStatusChange()
      setOpen(false)
    }
  };

  return (
    <div>
      {/* <Button size="small" variant="contained" color="primary">Pick up myself</Button> */}
      {/* <Button size="small" variant="contained" color="primary" href="/pickuplist">Pick up myself</Button> */}
      <Button size="small" variant="outlined" color="primary" onClick={handleClickOpen}>
        Pick up by others
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-other-pickup">
        <DialogTitle id="form-dialog-title">Pick up by others</DialogTitle>
        <DialogContent>
          {status !== "normal" &&
            <Alert severity="warning">
              Your current status is {status}. Every delivery from your fellow with cost you one contribution points.
              Are you sure you want your order picked up by others?
            </Alert>}
          <DialogContentText>
            If you choose to have your order picked up by others. Please enter your delivery address and confirm your choice.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="street"
            label="Street"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={street}
            onChange={handleStreetChange}
          />
          <TextField
            margin="dense"
            id="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={city}
            onChange={handleCityChange}
          />
          <TextField
            margin="dense"
            id="state"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={state}
            onChange={handleStateChange}
          />
          <TextField
            margin="dense"
            id="zip"
            label="Zip"
            type="text"
            fullWidth
            variant="outlined"
            required
            value={zip}
            onChange={handleZipChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}