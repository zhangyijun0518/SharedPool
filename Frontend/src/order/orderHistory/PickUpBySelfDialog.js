import React from "react";
// import clsx from "clsx";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
// import SingleLineGridList from "./SingleLineGridList";
import { withStyles } from "@material-ui/styles";
import axios from "axios";
import { Grid, DialogContent } from "@material-ui/core";
import ProductCard from "../ProductCard";
import Alert from "@material-ui/lab/Alert";
// import { Paper } from '@material-ui/core';
import Select from '@material-ui/core/Select';

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  alert: {
    position: "relative",
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
  },
  fixedMaxHeight: {
    height: 200,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class PickUpBySelfDialog extends React.Component {
  // const[open, setOpen] = React.useState(false);
  state = {
    open: false,
    orderInfos: [],
    number: 0,
    maxNumber: 10
  };

  fetchOrderInfos = () => {
    console.log("get fellow orders")
    // http://localhost:8080/getFellowOrders/{orderId}
    axios
      .get(process.env.REACT_APP_API_SERVER + "/getFellowOrders/" + this.props.orderId)
      .then((res) => {
        console.log("orderInfos", res.data);
        this.setState({ orderInfos: res.data });
        this.setState({ maxNumber: res.data.length });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  getPickUpOrderIds = () => {
    const orderIds = [this.props.orderId]
    for (let i = 0; i < this.state.number; i++) {
      orderIds.push(this.state.orderInfos[i].id)
    }
    return orderIds;
  }

  handleClickConfirm = () => {
    // http://localhost:8080/assignorders?poolerId=10&orderIds=1,2
    const orderIds = this.getPickUpOrderIds().join(',')
    console.log(orderIds)
    console.log('uid in handle click info:', this.props.uid)
    const url = process.env.REACT_APP_API_SERVER + "/assignorders?poolerId=" + this.props.uid + '&orderIds=' + orderIds
    console.log(url)
    axios
      .put(url)
      .then((res) => {
        console.log("orderInfos", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    this.props.handleStatusChange();
    this.handleClose();
  }

  handleSelectChange = (event) => {
    this.setState({ number: event.target.value });
  }

  render() {
    const { classes } = this.props;
    // const fixedMaxHeightPaper = clsx(classes.paper, classes.fixedMaxHeight);
    console.log("in render select number", this.state.number);
    console.log("in render max number", this.state.maxNumber);
    const numberArray = Array.from(Array(this.state.maxNumber + 1).keys())
    console.log("in render numberArray", numberArray);
    return (
      <div>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Pick Up By Self
        </Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Pick Up By Self
              </Typography>
              <Button autoFocus color="inherit" onClick={this.handleClickConfirm}>
                Confirm
              </Button>
            </Toolbar>
          </AppBar>

          <DialogContent dividers>
            {this.state.maxNumber > 0 ?
              <Alert severity="info" className={classes.alert}>
                <p>Please choose how many fellow ordes following you can pick along with your own order.</p>
            Number of Orders Selected:{'   '}
                <Select
                  native
                  value={this.state.number}
                  onChange={this.handleSelectChange}
                  inputProps={{
                    name: 'number',
                    id: 'number-of-orders',
                  }}
                >
                  {numberArray.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </Select>
              </Alert> :
              <Alert severity="info" className={classes.alert}>
                <p>You don't have fellow orders available to pick up along with your own order.</p>
                <p>Please wait for later decision if any fellow orders come up or feel free to checkout to pick up your own order only.</p>
              </Alert>
            }
            {this.state.orderInfos.map((orderInfo) => (
              <div key={orderInfo.id}>
                <Grid key={orderInfo.id * 2} container justify="center">
                  <Typography key={orderInfo.id * 4} variant="subtitle1">
                    Order # {orderInfo.id} Total: ${Number.parseFloat(orderInfo.total).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid key={orderInfo.id * 3} container>
                  {orderInfo.orderItems.map((item) => (
                    <ProductCard key={item.id} productInfo={item} />
                  ))}
                </Grid>
                <Divider />
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </div >
    );
  }

  componentDidMount() {
    {/* console.log("PickUpBySelfDialog component did mount"); */ }
    this.fetchOrderInfos();
  }
}

export default withStyles(styles)(PickUpBySelfDialog);
