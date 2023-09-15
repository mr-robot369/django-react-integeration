import { TextField, Button, Box, Alert } from '@mui/material';
import { useState, useEffect } from 'react';  // add useEffect
import { useNavigate } from 'react-router-dom';

// login hook
import { useVerifyOTPMutation } from '../../services/userAuthApi';

import { storeToken, getToken } from '../../services/cookies';

// dispatch // add this
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../features/authSlice';

const UserVerify = () => {
    // To get the unique token
    // const { token } = useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    // const token = new URLSearchParams().get("token");
    // setToken(token);
    // console.log("tokennn",token)

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
    const [verifyOTP, { isLoading }] = useVerifyOTPMutation()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        // ------------- get form data -------------
        // console.log("Token is",token)
        const actualData = {
            otp: data.get('otp'),
            token: token
        }

        // start-form frontend validation : These are used for showing form validation
        if (!actualData.otp) {
            setError({ status: true, msg: "OTP is Required", type: 'error' })
            return;
        }
        // end-form validation

        // ------------- sending form data to userAuthApi -------------
        const res = await verifyOTP(actualData)
        if (res.error) {
            console.log(res.error)
            setServerError(res.error.data.errors)
        }
        if (res.data) {
            console.log(res.data)
            storeToken(res.data.token)
            // setting in state // add this
            let { access_token } = getToken()
            dispatch(setUserToken({ access_token: access_token }))
            navigate('/dashboard')
        }
    }

    // but if someone refresh the page then redux lose its state, to avoid this // add this
    let { access_token } = getToken()
    useEffect(() => {
        dispatch(setUserToken({ access_token: access_token }))
    }, [access_token, dispatch])

    return <>
        <Box component='form' noValidate sx={{ mt: 1 }} id='login-form' onSubmit={handleSubmit}>
            <TextField margin='normal' required fullWidth id='otp' name='otp' label='OTP' />
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Submit</Button>
        </Box>

        {/* frontend validation error */}
        {error.status ? <Alert severity={error.type} sx={{ mt: 3 }}>{error.msg}</Alert> : ''}

        {/* backend validation error */}
        {server_error.token ? <Alert severity='error'>Timed Out! Try Again</Alert> : ''}
        {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
    </>;
};

export default UserVerify;
