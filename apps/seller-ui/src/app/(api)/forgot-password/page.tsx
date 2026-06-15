'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import GoogleSignInButton from '../../widget/components/Google'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'


type RequestForm = {
    email: string
}

type ResetForm = {
    newPassword: string
}

const ForgotPassword = () => {
    const [stage, setStage] = useState<'request' | 'verify' | 'reset'>('request')
    const [serverError, setServerError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [canSend, setCanSend] = useState(true)
    const [timer, setTimer] = useState(60)
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [email, setEmail] = useState('')
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<RequestForm>()
    const { register: registerReset, handleSubmit: handleResetSubmit, formState: { errors: resetErrors } } = useForm<ResetForm>()

    const startTimer = () => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setCanSend(true)
                    return 60
                }
                return prev - 1
            })
        }, 1000)
    }

    const requestOtpMutation = useMutation({
        mutationFn: async (data: RequestForm) => {
            const res = await axiosInstance.post('/auth/forgot-password', data)
            return res.data
        }
    })

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            const otpValue = otp.join('')
            const res = await axiosInstance.post('/auth/verify-forgot-password', {
                email,
                otp: otpValue
            })
            return res.data
        }
    })

    const resetPasswordMutation = useMutation({
        mutationFn: async (data: ResetForm) => {
            const otpValue = otp.join('')
            const res = await axiosInstance.post('/auth/reset-password', {
                email,
                otp: otpValue,
                newPassword: data.newPassword
            })
            return res.data
        }
    })

    const handleRequestOtp = async (data: RequestForm) => {
        setServerError(null)
        setSuccessMessage(null)
        try {
            await requestOtpMutation.mutateAsync(data)
            setEmail(data.email)
            setStage('verify')
            setCanSend(false)
            setTimer(60)
            startTimer()
            setSuccessMessage('OTP sent to your email')
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message = (err as AxiosError<{ message?: string }>).response?.data?.message
                setServerError(message || 'Failed to send OTP')
            } else {
                setServerError('Failed to send OTP')
            }
        }
    }

    const handleVerifyOtp = async () => {
        setServerError(null)
        setSuccessMessage(null)
        try {
            await verifyOtpMutation.mutateAsync()
            setStage('reset')
            setSuccessMessage('OTP verified. You can reset your password now.')
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message = (err as AxiosError<{ message?: string }>).response?.data?.message
                setServerError(message || 'OTP verification failed')
            } else {
                setServerError('OTP verification failed')
            }
        }
    }

    const handleResetPassword = async (data: ResetForm) => {
        setServerError(null)
        setSuccessMessage(null)
        try {
            await resetPasswordMutation.mutateAsync(data)
            setSuccessMessage('Password reset successful. You can log in now.')
            router.push('/login');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message = (err as AxiosError<{ message?: string }>).response?.data?.message
                setServerError(message || 'Password reset failed')
            } else {
                setServerError('Password reset failed')
            }
        }
    }

    const handleResendOtp = async () => {
        if (!email) return
        await handleRequestOtp({ email })
    }

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyBack = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    return (
        <div className='w-full py-10 min-h-[200vh]'>
            <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
                <div className='mt-4 justify-center items-center flex'>
                    <span>Already have an account?</span>
                    <Link href={'/login'} className='ml-5 font-poppins text-blue-500'>
                        Login
                    </Link>
                </div>
                <GoogleSignInButton />

                {stage === 'request' ? (
                    <form onSubmit={handleSubmit(handleRequestOtp)} className='mt-6'>
                        <h1 className='text-2xl justify-center items-center flex font-poppins mt-4'>Forgot Password</h1>
                        <div className='mt-4'>
                            <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register('email', { required: 'Email is required' })}
                                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                        </div>
                        {serverError && <p className='text-red-500 text-sm mt-4'>{serverError}</p>}
                        {successMessage && <p className='text-green-600 text-sm mt-4'>{successMessage}</p>}
                        <button
                            type="submit"
                            disabled={requestOtpMutation.isPending}
                            className='w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {requestOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : stage === 'verify' ? (
                    <div className='mt-6'>
                        <h1 className='text-2xl justify-center items-center flex font-poppins mt-4'>Enter OTP</h1>
                        <div className='flex justify-center gap-4 mt-4'>
                            {otp.map((digit, index) => (
                                <input
                                    type="text"
                                    key={index}
                                    ref={(el) => {
                                        if (el) inputRefs.current[index] = el
                                    }}
                                    maxLength={1}
                                    className='w-12 h-12 text-center border border-gray-500 outline-none !rounded'
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyBack(index, e)}
                                />
                            ))}
                        </div>

                        {serverError && <p className='text-red-500 text-sm mt-4'>{serverError}</p>}
                        {successMessage && <p className='text-green-600 text-sm mt-4'>{successMessage}</p>}

                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={verifyOtpMutation.isPending}
                            className='w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <div className='w-full mt-4 justify-center items-center flex text-blue-500 cursor-pointer'>
                            {canSend ? (
                                <button type="button" onClick={handleResendOtp}>
                                    Resend OTP
                                </button>
                            ) : (
                                <button type="button" disabled>
                                    Resend OTP in {timer}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleResetSubmit(handleResetPassword)} className='mt-6'>
                        <h1 className='text-2xl justify-center items-center flex font-poppins mt-4'>Reset Password</h1>
                        <div className='mt-4'>
                            <label htmlFor="resetEmail" className='block text-gray-700 font-bold mb-2'>Email</label>
                            <input
                                type="email"
                                id="resetEmail"
                                value={email}
                                readOnly
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div className='mt-4'>
                            <label htmlFor="newPassword" className='block text-gray-700 font-bold mb-2'>New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                {...registerReset('newPassword', { required: 'New password is required' })}
                                className={`w-full px-3 py-2 border ${resetErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {resetErrors.newPassword && <p className='text-red-500 text-sm mt-1'>{resetErrors.newPassword.message}</p>}
                        </div>

                        {serverError && <p className='text-red-500 text-sm mt-4'>{serverError}</p>}
                        {successMessage && <p className='text-green-600 text-sm mt-4'>{successMessage}</p>}

                        <button
                            type="submit"
                            disabled={resetPasswordMutation.isPending}
                            className='w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword