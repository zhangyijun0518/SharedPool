import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function CustomizedInputBase() {
  const classes = useStyles();

  const [key, setKey] = useState('');

  const handleSubmit = (event) => {
     //Make a network call somewhere
     event.preventDefault();

  }
  return (
    <Paper component="form" className={classes.root} onSubmit={handleSubmit}>
      <InputBase
        className={classes.input}
        placeholder="Search product..."
        inputProps={{ 'aria-label': 'search product...' }}
        onChange={(e) => setKey(e.target.value)}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search" href={`/products/${key}`}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
