import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

export default function QRCodeButton({ orderId }) {

    const QRCode = require('qrcode.react');
    // const qrCodeUrl = "http://facebook.github.io/react/"
    const qrCodeUrl = process.env.REACT_APP_API_SERVER + "/qrcode/" + orderId

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" size="small" onClick={handleClickOpen}>
                View QR Code
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="qrcode"
                aria-describedby="QR Code for checking out orders"
            >
                <DialogContent>
                    <QRCode value={qrCodeUrl} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Ok
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}