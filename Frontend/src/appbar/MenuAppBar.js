import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link } from '@material-ui/core';
import Search from '../component/Search';
import UserMenu from './userMenu';
import {Tabs, Tab} from '@material-ui/core/'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MenuAppBar({ authUser }) {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root} >
      {/* <FormGroup>
        <FormControlLabel
          control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
          label={auth ? 'Logout' : 'Login'}
        />
      </FormGroup> */}
      <AppBar position="static">
        <Toolbar>
          <Link className={classes.menuButton} color="inherit" href="/">
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> */}
            <MenuIcon />
            {/* </IconButton> */}
          </Link>
          <Typography variant="h6" className={classes.title} align="left" color="inherit">
            Spring 2020 CMPE275 Term Project: CartShare
          </Typography>

          <Tabs indicatorColor="primary" value={0}>
            <Tab label="Pools" href="/pools"/>
            <Tab label="Stores" href="/stores"/>
            <Tab label="Products" href="/products" />
          </Tabs>
          <Search />
          {/* {auth && ( */}
          {authUser && authUser.emailVerified && (
            <div>
              <IconButton authuser={authUser}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle authuser={authUser} />
              </IconButton>
              <UserMenu
                authUser={authUser}
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
              />
              {/* <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <Link href="/orderhistory">
                  <MenuItem>Order History</MenuItem>
                </Link>
                <Link href="/pickupmenu">
                  <MenuItem>Pick Up Menu</MenuItem>
                </Link>
                <Link href="/cart">
                  <MenuItem>My Cart</MenuItem>
                </Link>
                <Navigation authUser/>
              </Menu> */}
            </div>
          )}
        </Toolbar>
      </AppBar>

    </div>
  );
}
