import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    margin: 100,
    '& > * + *': {
      marginTop: theme.spacing(10),
    },
  },
}));

export default function NoPermission() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error">You don't have permission to acceess this page.</Alert>
    </div>
  );
}