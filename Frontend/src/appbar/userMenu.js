import React from 'react';
import * as ROUTES from '../constants/routes';
// import SIGN_OUT from '../components/SignOut';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from '@material-ui/core';
import SIGN_OUT from '../components/SignOut';

export default function userMenu({authUser,anchorEl, open, handleClose}) {
  if (authUser !== null){
    if (authUser.emailVerified) {
      var e = authUser.email;
      var lcEmail = e.toString().toLowerCase();
      if(lcEmail.endsWith('@sjsu.edu')){
        return (<MenuForAuthAdmin 
          anchorEl = {anchorEl}
          open = {open}
          handleClose = {handleClose}
          />)
      } else{
        return (<MenuForAuthPooler
          anchorEl = {anchorEl}
          open = {open}
          handleClose = {handleClose}
          />)
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const MenuForAuthPooler = ({anchorEl, open, handleClose}) => (
  <Menu
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
  <Link href={ROUTES.ACCOUNT}>
    <MenuItem>Profile</MenuItem>
  </Link>
  {/*<Link href={ROUTES.POOLER}>*/}
  {/*  <MenuItem>Pooler</MenuItem>*/}
  {/*</Link>*/}
  <Link href="/orderhistory">
    <MenuItem>Order History</MenuItem>
  </Link>
  <Link href="/pickupmenu">
    <MenuItem>Pick Up Menu</MenuItem>
  </Link>
  <Link href="/cart">
    <MenuItem>My Cart</MenuItem>
  </Link>
  {/*<Link href="/pool/create">*/}
  {/*  <MenuItem>Create Pool</MenuItem>*/}
  {/*</Link>*/}
  <Link href="/mypool">
    <MenuItem>My Pool</MenuItem>
  </Link>
    <Link href="/msg">
      <MenuItem>Message</MenuItem>
    </Link>
  <Link href={ROUTES.SIGN_OUT} onClick={SIGN_OUT}>
    <MenuItem>Logout</MenuItem>
  </Link>
</Menu>
);

const MenuForAuthAdmin = ({anchorEl, open, handleClose}) => (
  <Menu
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
  {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
  <MenuItem onClick={handleClose}>My account</MenuItem> */}
  <Link href={ROUTES.ACCOUNT}>
    <MenuItem>Profile</MenuItem>
  </Link>
  <Link href={ROUTES.SIGN_OUT} onClick={SIGN_OUT}>
    <MenuItem>Logout</MenuItem>
  </Link>
</Menu>
);
