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

export default function InPoolStatus() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Alert severity="error">You have already in a pool.</Alert>
        </div>
    );
}