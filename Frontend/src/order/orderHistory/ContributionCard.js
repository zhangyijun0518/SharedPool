import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { yellow, red, lightGreen } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 300,
    },
    yellow: {
        color: theme.palette.getContrastText(yellow[500]),
        backgroundColor: yellow[500],
    },
    red: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
    },
    green: {
        color: theme.palette.getContrastText(lightGreen[400]),
        backgroundColor: lightGreen[400],
    },
}));

export default function ContributionCard({ screenname, score, status }) {
    const classes = useStyles();

    const contributionStatus = "Contribution Status: " + status
    const contributionScore = "Contribution Score: " + score

    const getAvator = (status) => {
        if (status === 'red') {
            console.log('red')
            return <Avatar aria-label="user" className={classes.red}>{screenname}</Avatar>
        } else if (status === 'yellow') {
            console.log('yellow')
            return <Avatar aria-label="user" className={classes.yellow}>{screenname}</Avatar>
        } else {
            return <Avatar aria-label="user" className={classes.green}>{screenname}</Avatar>
        }
    }

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={getAvator(status)}
                title={contributionScore}
                subheader={contributionStatus}
            />
        </Card>
    );
}
