import { TextField, Button, Box, Alert } from '@mui/material';
import { useState } from 'react';
import { NavLink,useNavigate } from 'react-router-dom';

// this hook provides us many pre defined functionality such as registerUser, isLoading, isSuccess
import { useRegisterUserMutation } from '../../services/userAuthApi';

const Registration = () => {
  // Used to store frontend errors
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: ""
  })

  // Used to store backend errors
  const [server_error, setServerError] = useState({})

  // We use registerUser, isLoading from useRegisterUserMutation hook
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  
  // use to navigate to different urls
  const navigate = useNavigate();

  // start-handleSubmit function 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    // ------------- get form data -------------
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      password2: data.get('password_confirmation'),
    }

    // start-form frontend validation : These are used for showing form validation 
    // if (actualData.name && actualData.email && actualData.password && actualData.password2 !== null) {
    //   if (actualData.password != actualData.password2) {
    //     // console.log(actualData);
    //     setError({ status: true, msg: "Password and Confirm Password Doesn't Match", type: 'error' })
    //     return;
    //   }
    // } else {
    //   setError({ status: true, msg: "All Fields are Required", type: 'error' })
    // }
    // setError({ status: false, msg: "", type: "" });
    // end-form validation 
    
    // ------------- sending form data to userAuthApi -------------
    const res = await registerUser(actualData)
    if (res.error) {
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(res.data) 
      navigate(`/verify/?token=${res.data.token}`)
    }
  }
  // end handlesubmit function 

  return <>
    {/* Registration Form */}
    <Box component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required fullWidth id='name' name='name' label='Name' />
      {server_error.name ? <i>{server_error.name[0]}</i> : ""}
      
      <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {server_error.email ? server_error.email[0].includes("exists") ? '' :<i>{server_error.email[0]}</i> : ""}
      
      <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
      {server_error.password ? <i>{server_error.password[0]}</i> : ""}
      
      <TextField margin='normal' required fullWidth id='password_confirmation' name='password_confirmation' label='Confirm Password' type='password' />
      {server_error.password2 ? <i>{server_error.password2[0]}</i> : ""}
      
      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Join</Button>
      </Box>
      <NavLink to='/login' >Already have account?</NavLink>
      {/* frontend validation error */}
      {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ''}

      {/* backend validation error */}
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
      {server_error.email ? server_error.email[0].includes("exists") ? <Alert severity='error'>{server_error.email[0]}</Alert> : '' : ''}
    </Box>
    {/* form end */}

    {/* Note : When user clicks on Join, onSubmit={handleSubmit} run and it will call handleSubmit function */}
  </>;
};

export default Registration;


// Changes:
// in form add : onSubmit={handleSubmit}
// 