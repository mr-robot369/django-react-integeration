// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
    reducerPath: 'userAuthApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (user) => {
                return {
                    url: 'register/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        loginUser: builder.mutation({
            query: (user) => {
                return {
                    url: 'login/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        verifyOTP: builder.mutation({
            query: ({ otp, token }) => {
                return {
                    url: `otp/verify/?token=${token}`,
                    method: 'POST',
                    body: { otp, token }, // Include the OTP and user ID in the request body
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
    }),
})

export const { useRegisterUserMutation, useLoginUserMutation, useVerifyOTPMutation } = userAuthApi
