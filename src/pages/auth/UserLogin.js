import { TextField, Button, Box, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getToken, storeToken } from '../../services/cookies';
// login hook
import { useLoginUserMutation } from '../../services/userAuthApi';

// dispatch // add this
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../features/authSlice';

const UserLogin = () => {
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: ""
  })
  const navigate = useNavigate();

  // Used to store backend errors
  const [server_error, setServerError] = useState({})

  const dispatch = useDispatch()   // add this

  // hook's functionality
  const [loginUser, { isLoading }] = useLoginUserMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    // ------------- get form data -------------
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }

    // start-form frontend validation : These are used for showing form validation
    if (!(actualData.email && actualData.password)) {
      setError({ status: true, msg: "All Fields are Required", type: 'error' })
      return;
    }
    // end-form validation

    // ------------- sending form data to userAuthApi -------------
    const res = await loginUser(actualData)
    if (res.error) {
      // console.log(res.error)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      // console.log(res.data) 
      if (res.data.verify){
        storeToken(res.data.token)
        // setting in state // add this
        let {access_token } = getToken()
        dispatch(setUserToken({access_token : access_token}))
        navigate('/dashboard')
      }else{
        navigate(`/verify/?token=${res.data.token}`)
      }
    }
  }
  
  // but if someone refresh the page then redux lose its state, to avoid this // add this
  let {access_token } = getToken()
  useEffect(() =>{
    dispatch(setUserToken({access_token : access_token}))
  }, [access_token, dispatch] )

  return <>
    <Box component='form' noValidate sx={{ mt: 1 }} id='login-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {server_error.email ? <i>{server_error.email[0]}</i> : ""}
      <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
      <Box textAlign='center'>
        {/* <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Login</Button> */}
        {isLoading ? <Button type='submit' variant='contained' disabled sx={{ mt: 3, mb: 2, px: 5 }}>Login</Button> :
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Login</Button> }
      </Box>
      <NavLink to='/sendpasswordresetemail' >Forgot Password ?</NavLink> <br />
      <NavLink to='/register' >Don't have account?</NavLink>
      
      {/* frontend validation error */}
      {error.status ? <Alert severity={error.type} sx={{ mt: 3 }}>{error.msg}</Alert> : ''}
      
      {/* backend validation error */}
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
      {/* {server_error.verify ? <Alert severity='error'>{server_error.verify}</Alert> : ''} */}
    </Box>
  </>;
};

export default UserLogin;
