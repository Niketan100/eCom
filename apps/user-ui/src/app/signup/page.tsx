'use client'

import React, { useRef } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleSignInButton from '../../shared/widget/components/Google'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import axiosInstance from '../../utils/axiosInstance'


type Formdata = {
  username: string
  email: string
  phoneNumber: string
  country: string
  password: string
}

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [canSend , setCanSend] = useState(true);
  const [timer , setTimer] = useState(60);
  const [showotp , setShowOtp] = useState(false);
  const [otp , setotp] = useState(["", "", "", "", "", ""]);
  const [userdata , setuserdata] = useState<Formdata>({
    username : '',
    email : '',
    phoneNumber : '',
    country : '',
    password : ''
  })
  const router = useRouter()

  const startTimer = () =>{
    const interval = setInterval(() =>{
      setTimer((prev) => {
        if(prev <= 1){
          clearInterval(interval);
          setCanSend(true);
          return 60;
        }
        return prev -1;
      })
    }, 1000)
  }

  const SignupMutation = useMutation({
    mutationFn : async (data : Formdata) =>{
      const res = await axiosInstance.post('/auth/register', data)
      return res.data
    }, 

    onSuccess : (_,data) =>{
      setShowOtp(true);
      setuserdata(data);
      setCanSend(false);
      setTimer(60);
      startTimer();

    },
    onError : (error : any) =>{
      setServerError(error.message || 'Signup failed');
    }
  })
  const inputRefs = useRef<(HTMLInputElement | null )[]>([]);

  const handleotpChange = (index : number  , value : string) =>{
    if(!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setotp(newOtp);

    if(value && index < inputRefs.current.length -1){
        inputRefs.current[index +1]?.focus();
    }
  }

const handlekeyBack = (index : number , e: React.KeyboardEvent<HTMLInputElement> ) =>{
    if(e.key === 'Backspace' && !otp[index] && index > 0){
        inputRefs.current[index -1]?.focus();
    }
}
   

  const { register, handleSubmit, formState: { errors } } = useForm<Formdata>()
  const isSubmitting = SignupMutation.isPending

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const otpValue = otp.join('')
      const res = await axiosInstance.post('/auth/verify', {
        email: userdata.email,
        otp: otpValue,
        password: userdata.password,
        name: userdata.username
      })
      return res.data
    }
  })

  const onsubmit = async (data: Formdata) => {
    setServerError(null)
    try {
      await SignupMutation.mutateAsync(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
        setServerError(message || 'Signup failed')
      } else {
        setServerError('Signup failed')
      }
    }
  }

  const handleOtpSubmit = async () =>{
    setServerError(null)
    try {
      await verifyOtpMutation.mutateAsync()
      router.push('/login')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
        setServerError(message || 'OTP verification failed')
      } else {
        setServerError('OTP verification failed')
      }
    }
  }

  const handleresendOtp = async () =>{
    setServerError(null)
    try {
      await SignupMutation.mutateAsync(userdata)
      setCanSend(false)
      setTimer(60)
      startTimer()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
        setServerError(message || 'Failed to resend OTP')
      } else {
        setServerError('Failed to resend OTP')
      }
    }
  }

  return (
    <div className='w-full py-10 min-h-[200vh]'>
      <h1 className='text-3xl font-bold text-center mb-6'>Sign Up</h1>

        {!showotp ? (
             <form onSubmit={handleSubmit(onsubmit)} className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
        <div className='mb-4'>
          <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>UserName</label>
          <input
            type="text"
            id="username"
            {...register('username', { required: 'Username is required' })}
            className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
        </div>
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>Email</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
        </div>
        <div className='mb-4'>
          <label htmlFor="phone" className='block text-gray-700 font-bold mb-2'>Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            {...register('phoneNumber', { required: 'Phone number is required' })}
            className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.phoneNumber && <p className='text-red-500 text-sm mt-1'>{errors.phoneNumber.message}</p>}
        </div>
        <div className='mb-4'>
          <label htmlFor="country" className='block text-gray-700 font-bold mb-2'>Country</label>
          <input
            type="text"
            id="country"
            {...register('country', { required: 'Country is required' })}
            className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.country && <p className='text-red-500 text-sm mt-1'>{errors.country.message}</p>}
        </div>
        <div className='mb-4'>
          <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>Password</label>
          <div className='relative'>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              {...register('password', { required: 'Password is required' })}
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600'
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
        </div>
  {serverError && <p className='text-red-500 text-sm mb-4'>{serverError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
        >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        <div className='mt-4 justify-center items-center flex'>
          <span>
            Already have an account?
          </span>
                    <Link href={'/login'} className='ml-5 font-poppins text-blue-500'>
            Login
          </Link>
        </div>
        <GoogleSignInButton />
      </form>
        ):
            <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>

                 <div className='mt-4 justify-center items-center flex'>
            <span>
                Already have an account?
            </span>
                        <Link href={'/login'} className='ml-5 font-poppins text-blue-500'>
                Login
            </Link>
            </div>
            <GoogleSignInButton />

                <h1 className='text-2xl justify-center items-center flex font-poppins mt-4'> Enter OTP</h1>
                <div className='flex justify-center gap-6 mt-4'>
                    {otp?.map((digit, index) =>(
                        <input type="text" key={index} ref={(el =>{
                            if(el) inputRefs.current[index] = el;
                        })} 
                        maxLength={1}
                        className='w-12 h-12 text-center border border-gray-500 outline-none !rounded'
                        value={digit}
                        onChange={(e) => handleotpChange(index, e.target.value)}
                        onKeyDown={(e) => handlekeyBack(index, e)}

                        />
                         
                    ))}
                </div>
                {serverError && <p className='text-red-500 text-sm mb-4'>{serverError}</p>}
                <div className='mt-6'>
                  <button
                    type="button"
                    onClick={handleOtpSubmit}
                    disabled={verifyOtpMutation.isPending}
                    className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'>
                      {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Account'}
                  </button>
                </div>
                <div className='w-full mt-4 justify-center items-center flex text-blue-500 cursor-pointer'>
                {canSend ? (
                    <button onClick={handleresendOtp}>
                        Resend OTP 
                    </button>
                ): (
                    <button>
                        Resend OTP in {timer}
                    </button>
                )}
                </div>
            </div>
        }

    </div>
  )
}
export default Signup
