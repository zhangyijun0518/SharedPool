import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';



const useStyles = makeStyles({
    root: {
        minWidth: 200,
        maxWidth: 200,
    },
    title: {
        fontWeight: 700,
    }
});

function PoolTable(props) {
    const classes = useStyles();
    const pid = props.id;
    const name = props.name;
    const zip = props.zip;
    let neighborhood = props.neighborhood;
    let description = props.description;
    console.log("descp" + description);

    const link = "/joinpool/" + pid;
    console.log("pid" + pid);
    return (
        <Grid item xs={3} sm={3}>
            <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom component="h2" className={classes.title}>
                                 {name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {!!(description)?description:" "}
                            </Typography>
                            <Typography variant="body2" color="primary" component="p">
                                {!!(neighborhood)?neighborhood:" "}
                            </Typography>
                            <Typography variant="body2" color="primary" component="p">
                                 {zip}
                            </Typography>

                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button variant="outlined" size="small" color="primary" fullWidth={true} href={link} >
                            Join
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
        // <table className='table'>
        //     <th  align="center" aria-colspan={2}> Pool {name} </th>
        //         <tr>
        //             <td align="center"> Neighborhood Name: </td>
        //             <td align="center">{neighborhood}</td>
        //         </tr>
        //         <tr>
        //             <td align="center"> Zip Code: </td>
        //             <td align="center">{zip} </td>
        //         </tr>
        //         <tr>
        //             <td align="center"> Description : </td>
        //             <td align="center">{description}</td>
        //         </tr>
        //
        // </table>
    )
}

function PoolList(props){
    const pools = props.pools;
    const listPools = pools.map((pool) => {
        const {id, name, zip, neighborhood, description} = pool;
        console.log("pool_id" + id);
        return (<PoolTable
                key={id}
                id = {id}
                name = {name}
                zip = {zip}
                neighborhood = {neighborhood}
                description = {description}
            />
        )
    });
    return (
        <section>
            <Grid container spacing={4}>
                {listPools}
            </Grid>
        </section>
    )
}

export default PoolList;
