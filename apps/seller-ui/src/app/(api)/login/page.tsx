'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Eye, EyeOff, ShoppingBag } from 'lucide-react'
import axiosInstance from '../../../utils/axiosInstance'

type Formdata = {
  email: string
  password: string
}

const Login = () => {
  const router = useRouter()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>()

  const loginMutation = useMutation({
    mutationFn: async (data: Formdata) => {
      const res = await axiosInstance.post('/auth/seller-login', data)
      return res.data
    },
  })

  const onsubmit = async (data: Formdata) => {
    setServerError(null)
    setSuccessMessage(null)

    try {
      await loginMutation.mutateAsync(data)

      setSuccessMessage('Login successful!')

      setTimeout(() => {
        router.push('/')
      }, 800)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (
          err as AxiosError<{ message?: string }>
        ).response?.data?.message

        setServerError(message || 'Login failed')
      } else {
        setServerError('Login failed')
      }
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600">
            <ShoppingBag size={30} />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-white">
            Seller Login
          </h1>

          <p className="mt-2 text-zinc-400">
            Welcome back. Let's get your store running.
          </p>

        </div>

        <form
          onSubmit={handleSubmit(onsubmit)}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl"
        >
          <div className="space-y-6">

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Email
              </label>

              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                })}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
                placeholder="you@example.com"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>

              <label className="mb-2 block text-sm text-zinc-300">
                Password
              </label>

              <div className="relative">

                <input
                  type={passwordVisible ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-12 text-white outline-none transition focus:border-violet-500"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setPasswordVisible(!passwordVisible)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {passwordVisible ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}

            </div>

            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-zinc-400">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-violet-600"
                />

                Remember me

              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                Forgot password?
              </Link>

            </div>

            {serverError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loginMutation.isPending
                ? 'Signing In...'
                : 'Sign In'}
            </button>

          </div>

          <div className="mt-8 border-t border-zinc-800 pt-6 text-center text-zinc-400">

            Don't have an account?

            <Link
              href="/signup"
              className="ml-2 font-semibold text-violet-400 hover:text-violet-300"
            >
              Create Seller Account
            </Link>

          </div>

        </form>

      </div>

    </main>
  )
}

export default Login