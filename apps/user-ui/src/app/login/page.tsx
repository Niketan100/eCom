'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

type Formdata = {
    email: string
    password: string
}

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [rememberMe, setRememberMe] = useState(false)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<Formdata>()

    const onsubmit = async (data: Formdata) => {
        setServerError(null)
        try {
            // TODO: Replace with your actual login API call
            // Example:
            // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) })
            // if (!res.ok) throw new Error('Login failed')
            // router.push('/dashboard')
            // For now, just simulate success:
            router.push('/')
        } catch (err: any) {
            setServerError(err.message || 'Login failed')
        }
    }

    return (
        <div className='w-full py-10 min-h-[200vh]'>
            <h1 className='text-3xl font-bold text-center mb-6'>Login</h1>
            <form onSubmit={handleSubmit(onsubmit)} className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
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
                <div className='mb-4 flex items-center'>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className='mr-2'
                    />
                    <label htmlFor="rememberMe" className='text-gray-700'>Remember Me</label>
                </div>
                {serverError && <p className='text-red-500 text-sm mb-4'>{serverError}</p>}
                <button
                    type="submit"
                    className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'
                >
                    Login
                </button>
                <div className='mt-4 justify-center items-center flex'>
                    <span className=''>
                     Dont have an acount ?
                     </span>
                    <Link href={'/signup'} className='text-gray-700 ml-5 font-poppins text-blue-500'>
                        SignUp
                    </Link>
                </div>
            </form>

           
        </div>
    )
}

export default Login
