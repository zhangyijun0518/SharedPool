import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogContent, AppBar, Toolbar, IconButton, Typography, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import OrderDetails from './OrderDetails'

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: '#FFFFFF',
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderDetailsDialog({ orderId, orderItems, subtotal, tax, fee, total, address, receipentName }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button size="small" color="primary" onClick={handleClickOpen}>Order Details</Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Order #{orderId} Details
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <OrderDetails
                        orderItems={orderItems}
                        subtotal={subtotal}
                        tax={tax}
                        fee={fee}
                        total={total}
                        address={address}
                        receipentName={receipentName}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}