import React, { PureComponent } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& .MuiTextField-root': {
//       margin: theme.spacing(1),
//       width: '25ch',
//     },
//   },
// }));

class Content extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }
    
    render() {
        // const classes = useStyles();
        return (
            <Container spacing={3}>
                <form  onSubmit = { this.props.handleSubmit } >
                    <div>
                        <TextField id="outlined-search" label="Email" type="text" variant="outlined" name="email" />
                    </div>
                    <div>
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            name="password"
                        />
                    </div>
                    <Button type="submit" variant="contained" color="primary">Login</Button>
                </form>
            </Container>           
        )
    }
}

export default Content