import React from 'react';
import * as ROUTES from '../../constants/routes';
import { Link } from '@material-ui/core';


const Navigation = ({ authUser }) => {
  if (authUser === null || !authUser.emailVerified) {
    return (<NavigationWithoutAuth />)
  }
  else {
    return null;
  }
};

const NavigationWithoutAuth = () => (
  <div align="right">
    <Link href={ROUTES.SIGN_IN}>Sign In | </Link>
    <Link href={ROUTES.SIGN_UP}>Register</Link>
  </div>
);

export default Navigation;