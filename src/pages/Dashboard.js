import { Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './auth/ChangePassword';
import { removeToken } from '../services/cookies';
import { useDispatch } from 'react-redux'; // add this
import { unSetUserToken } from '../features/authSlice';

const Dashboard = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch() // add this

  const handleLogout = () => {
    // console.log("Logout Clicked");
    dispatch(unSetUserToken({ access_token : null})) // add this
    removeToken()
    navigate('/login')
  }
  return <>
    <CssBaseline />
    <Grid container>
      <Grid item sm={4} sx={{ backgroundColor: 'gray', p: 5, color: 'white' }}>
        <h1>Dashboard</h1>
        <Typography variant='h5'>Email: sonam@gmail.com</Typography>
        <Typography variant='h6'>Name: Sonam</Typography>
        <Button variant='contained' color='warning' size='large' onClick={handleLogout} sx={{ mt: 8 }}>Logout</Button>
      </Grid>
      <Grid item sm={8}>
        <ChangePassword />
      </Grid>
    </Grid>
  </>;
};

export default Dashboard;
