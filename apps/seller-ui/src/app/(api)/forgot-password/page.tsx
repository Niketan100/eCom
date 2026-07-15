'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import GoogleSignInButton from '../../widget/components/Google'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  Shield,
  Key,
  AlertCircle
} from 'lucide-react'

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
    const [passwordVisible, setPasswordVisible] = useState(false)
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
            setTimeout(() => {
                router.push('/login')
            }, 2000)
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

    const InputField = ({ 
        label, 
        id, 
        register, 
        errors, 
        icon: Icon, 
        type = 'text', 
        readOnly = false,
        value,
        ...props 
    }: any) => (
        <div className="mb-5">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    readOnly={readOnly}
                    {...register}
                    className={`
                        w-full px-4 py-3 bg-gray-800/50 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200 text-white placeholder-gray-500
                        ${Icon ? 'pl-10' : 'pl-4'}
                        ${readOnly ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-600'}
                        ${errors ? 'border-red-500 focus:ring-red-500' : 'border-gray-700'}
                    `}
                    {...props}
                />
            </div>
            {errors && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                </p>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 mb-4">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-400 font-medium">Secure Recovery</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Forgot Password
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        {stage === 'request' && "We'll send you a verification code"}
                        {stage === 'verify' && "Enter the code sent to your email"}
                        {stage === 'reset' && "Create a new password for your account"}
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl shadow-black/20 p-6 sm:p-8">
                    {/* Back to Login */}
                    <Link 
                        href="/login" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>

                    {/* Google Sign In - Only show on request stage */}
                    {stage === 'request' && (
                        <div className="mb-6">
                            <GoogleSignInButton />
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-gray-800/40 text-gray-500">OR</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stage: Request OTP */}
                    {stage === 'request' && (
                        <form onSubmit={handleSubmit(handleRequestOtp)}>
                            <InputField
                                label="Email Address"
                                id="email"
                                register={register('email', { 
                                    required: 'Email is required',
                                    pattern: { 
                                        value: /^\S+@\S+\.\S+$/, 
                                        message: 'Enter a valid email' 
                                    }
                                })}
                                errors={errors.email}
                                icon={Mail}
                                type="email"
                                placeholder="you@example.com"
                            />

                            {serverError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 text-sm">{serverError}</p>
                                </div>
                            )}
                            {successMessage && (
                                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-green-400 text-sm">{successMessage}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={requestOtpMutation.isPending}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {requestOtpMutation.isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Code
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Stage: Verify OTP */}
                    {stage === 'verify' && (
                        <div>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-blue-400" />
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Enter the 6-digit code sent to{' '}
                                    <span className="text-blue-400 font-medium">{email}</span>
                                </p>
                            </div>

                            <div className="flex justify-center gap-3 mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            if (el) inputRefs.current[index] = el
                                        }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyBack(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white transition-all"
                                    />
                                ))}
                            </div>

                            {serverError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 text-sm">{serverError}</p>
                                </div>
                            )}
                            {successMessage && (
                                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-green-400 text-sm">{successMessage}</p>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={verifyOtpMutation.isPending}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {verifyOtpMutation.isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Code
                                        <CheckCircle className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="mt-4 text-center">
                                {canSend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <span className="text-gray-500 text-sm">
                                        Resend code in{' '}
                                        <span className="text-blue-400 font-mono">{timer}s</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stage: Reset Password */}
                    {stage === 'reset' && (
                        <form onSubmit={handleResetSubmit(handleResetPassword)}>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Key className="w-8 h-8 text-green-400" />
                                </div>
                            </div>

                            <InputField
                                label="Email"
                                id="resetEmail"
                                value={email}
                                readOnly={true}
                                icon={Mail}
                                type="email"
                            />

                            <div className="mb-5">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="newPassword"
                                        {...registerReset('newPassword', { 
                                            required: 'New password is required',
                                            minLength: { 
                                                value: 8, 
                                                message: 'Password must be at least 8 characters' 
                                            },
                                            maxLength: { 
                                                value: 64, 
                                                message: 'Password is too long' 
                                            }
                                        })}
                                        className={`
                                            w-full px-4 py-3 bg-gray-800/50 border rounded-lg
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            transition-all duration-200 text-white placeholder-gray-500 pl-10
                                            ${resetErrors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-gray-600'}
                                        `}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {passwordVisible ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {resetErrors.newPassword && (
                                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {resetErrors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            {serverError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 text-sm">{serverError}</p>
                                </div>
                            )}
                            {successMessage && (
                                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-green-400 text-sm">{successMessage}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={resetPasswordMutation.isPending}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {resetPasswordMutation.isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <CheckCircle className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-xs">
                        Remember your password?{' '}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword