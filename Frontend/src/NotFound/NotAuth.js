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

export default function NotAuth() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Alert severity="error">Please login with Pooler account to view this page.</Alert>
        </div>
    );
}