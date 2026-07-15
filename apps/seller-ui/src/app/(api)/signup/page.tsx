'use client'

import React, { useRef } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import axiosInstance from './../../../utils/axiosInstance'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Globe,
  Store,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Shield
} from 'lucide-react'

type SellerForm = {
  name: string
  email: string
  phoneNumber: string
  country: string
  password: string
  businessName: string
  address: string
  city: string
  state: string
  postalCode: string
}

type ShopForm = {
  name: string
  description: string
  category: string
  openingHours: string
  website?: string
  socialMediaLinks?: string
  coverImage?: string
}

type BankDetailsForm = {
  accountName: string
  accountNumber: string
  bankName: string
  ifsc: string
}

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [canSend, setCanSend] = useState(true)
  const [timer, setTimer] = useState(60)
  const [activeStep, setActiveStep] = useState(1)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setotp] = useState(["", "", "", "", "", ""])
  const [sellerId, setSellerId] = useState<string | null>(null)
  const [sellerData, setSellerData] = useState<SellerForm>({
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    password: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  })
  const [shopDetails, setShopDetails] = useState<ShopForm>({
    name: '',
    description: '',
    category: '',
    openingHours: '',
    website: '',
    socialMediaLinks: '',
    coverImage: ''
  })
  const [bankDetails, setBankDetails] = useState<BankDetailsForm>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    ifsc: ''
  })
  const [bankCompleted, setBankCompleted] = useState(false)
  const router = useRouter()

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

  const SignupMutation = useMutation({
    mutationFn: async (data: SellerForm) => {
      const res = await axiosInstance.post('/auth/register-seller', data)
      return res.data
    },
    onSuccess: (_, data) => {
      setShowOtp(true)
      setSellerData(data)
      setCanSend(false)
      setTimer(60)
      startTimer()
    },
    onError: (error: any) => {
      setServerError(error.message || 'Signup failed')
    }
  })

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleotpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setotp(newOtp)

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlekeyBack = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm<SellerForm>()
  const {
    register: registerShop,
    handleSubmit: handleShopSubmit,
    formState: { errors: shopErrors }
  } = useForm<ShopForm>()

  const {
    register: registerBank,
    handleSubmit: handleBankSubmit,
    formState: { errors: bankErrors }
  } = useForm<BankDetailsForm>()
  const isSubmitting = SignupMutation.isPending

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const otpValue = otp.join('')
      const res = await axiosInstance.post('/auth/verify-seller-otp', {
        email: sellerData?.email,
        otp: otpValue
      })
      return res.data
    }
  })

  const createSellerMutation = useMutation({
    mutationFn: async (data: SellerForm) => {
      const res = await axiosInstance.post('/auth/create-seller', data)
      return res.data
    }
  })

  const createShopMutation = useMutation({
    mutationFn: async (data: Omit<ShopForm, 'socialMediaLinks'> & { sellerId: string; socialMediaLinks: string[] }) => {
      const res = await axiosInstance.post('/auth/create-shop', data)
      return res.data
    }
  })

  const onsubmit = async (data: SellerForm) => {
    setServerError(null)
    setSellerData(data)

    try {
      await SignupMutation.mutateAsync(data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
        setServerError(message || 'Signup failed')
      } else {
        setServerError('Signup failed')
      }
    }
  }

  const handleOtpSubmit = async () => {
    setServerError(null)
    try {
      await verifyOtpMutation.mutateAsync()
      const response = await createSellerMutation.mutateAsync(sellerData)
      const createdId = response?.seller?.id as string | undefined
      if (createdId) {
        setSellerId(createdId)
      }
      setShowOtp(false)
      setActiveStep(2)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
        setServerError(message || 'OTP verification failed')
      } else {
        setServerError('OTP verification failed')
      }
    }
  }

  const handleresendOtp = async () => {
    setServerError(null)
    try {
      await SignupMutation.mutateAsync(sellerData)
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

  const onShopSubmit = async (data: ShopForm) => {
    setServerError(null)
    setShopDetails(data)
    if (!sellerId) {
      setServerError('Please verify seller details first')
      return
    }
    const socialMediaLinks = data.socialMediaLinks
      ? data.socialMediaLinks.split(',').map((link) => link.trim()).filter(Boolean)
      : []

    try {
      await createShopMutation.mutateAsync({
        ...data,
        sellerId,
        socialMediaLinks
      })
      setActiveStep(3)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
        setServerError(message || 'Failed to create shop')
      } else {
        setServerError('Failed to create shop')
      }
    }
  }

  const onBankSubmit = async (data: BankDetailsForm) => {
    setServerError(null)
    setBankDetails(data)
    setBankCompleted(true)
  }

  const StepIndicator = ({ step, label }: { step: number; label: string }) => (
    <div className="flex items-center gap-3">
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
        ${activeStep >= step 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
          : 'bg-gray-700 text-gray-400'
        }
        ${activeStep === step ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 scale-110' : ''}
      `}>
        {activeStep > step ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <span className={`
        text-sm font-medium hidden sm:block
        ${activeStep >= step ? 'text-white' : 'text-gray-500'}
      `}>
        {label}
      </span>
      {step < 3 && (
        <div className={`
          w-12 h-0.5 mx-2
          ${activeStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-700'}
        `} />
      )}
    </div>
  )

  const InputField = ({ 
    label, 
    id, 
    register, 
    errors, 
    icon: Icon, 
    type = 'text', 
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
          {...register}
          className={`
            w-full px-4 py-3 bg-gray-800/50 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 text-white placeholder-gray-500
            ${Icon ? 'pl-10' : 'pl-4'}
            ${errors ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-gray-600'}
          `}
          {...props}
        />
      </div>
      {errors && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
          <span>•</span> {errors.message}
        </p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 mb-4">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400 font-medium">Secure Registration</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Join as a Seller
          </h1>
          <p className="text-gray-400 mt-2">Start your business journey with us today</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-10 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-6 bg-gray-800/30 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-700">
            <StepIndicator step={1} label="Account" />
            <StepIndicator step={2} label="Shop" />
            <StepIndicator step={3} label="Banking" />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl shadow-black/20 p-6 sm:p-8">
          {activeStep === 1 && (
            !showOtp ? (
              <form onSubmit={handleSubmit(onsubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    id="name"
                    register={register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name is too short' },
                      maxLength: { value: 60, message: 'Name is too long' }
                    })}
                    errors={errors.name}
                    icon={User}
                    placeholder="Enter your full name"
                  />
                  <InputField
                    label="Email Address"
                    id="email"
                    register={register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
                    })}
                    errors={errors.email}
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                  />
                  <InputField
                    label="Phone Number"
                    id="phoneNumber"
                    register={register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: { value: /^\d{7,15}$/, message: 'Enter a valid phone number' }
                    })}
                    errors={errors.phoneNumber}
                    icon={Phone}
                    type="tel"
                    placeholder="1234567890"
                  />
                  <InputField
                    label="Country"
                    id="country"
                    register={register('country', {
                      required: 'Country is required',
                      minLength: { value: 2, message: 'Country is too short' },
                      maxLength: { value: 56, message: 'Country is too long' }
                    })}
                    errors={errors.country}
                    icon={Globe}
                    placeholder="Enter your country"
                  />
                  <InputField
                    label="Business Name"
                    id="businessName"
                    register={register('businessName', {
                      required: 'Business name is required',
                      minLength: { value: 2, message: 'Business name is too short' },
                      maxLength: { value: 80, message: 'Business name is too long' }
                    })}
                    errors={errors.businessName}
                    icon={Building}
                    placeholder="Your business name"
                  />
                  <div className="mb-5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Must be at least 8 characters' },
                          maxLength: { value: 64, message: 'Password is too long' }
                        })}
                        className={`
                          w-full px-4 py-3 bg-gray-800/50 border rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200 text-white placeholder-gray-500
                          ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-gray-600'}
                        `}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <span>•</span> {errors.password.message}
                      </p>
                    )}
                  </div>
                  <InputField
                    label="Address"
                    id="address"
                    register={register('address', {
                      required: 'Address is required',
                      minLength: { value: 5, message: 'Address is too short' },
                      maxLength: { value: 120, message: 'Address is too long' }
                    })}
                    errors={errors.address}
                    icon={MapPin}
                    placeholder="Street address"
                  />
                  <InputField
                    label="City"
                    id="city"
                    register={register('city', {
                      required: 'City is required',
                      minLength: { value: 2, message: 'City is too short' },
                      maxLength: { value: 60, message: 'City is too long' }
                    })}
                    errors={errors.city}
                    placeholder="Enter your city"
                  />
                  <InputField
                    label="State/Province"
                    id="state"
                    register={register('state', {
                      required: 'State is required',
                      minLength: { value: 2, message: 'State is too short' },
                      maxLength: { value: 60, message: 'State is too long' }
                    })}
                    errors={errors.state}
                    placeholder="Enter your state"
                  />
                  <InputField
                    label="Postal Code"
                    id="postalCode"
                    register={register('postalCode', {
                      required: 'Postal code is required',
                      pattern: { value: /^[A-Za-z0-9\- ]{3,10}$/, message: 'Enter a valid postal code' }
                    })}
                    errors={errors.postalCode}
                    placeholder="Enter postal code"
                  />
                </div>

                {serverError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{serverError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <span className="text-gray-400">Already have an account?</span>
                  <Link href="/login" className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
                  <p className="text-gray-400 text-sm mt-2">
                    We've sent a 6-digit code to <span className="text-blue-400">{sellerData?.email}</span>
                  </p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { if (el) inputRefs.current[index] = el }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleotpChange(index, e.target.value)}
                      onKeyDown={(e) => handlekeyBack(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white transition-all"
                    />
                  ))}
                </div>

                {serverError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{serverError}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOtpSubmit}
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
                      Verify Account
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  {canSend ? (
                    <button
                      onClick={handleresendOtp}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-gray-500">
                      Resend OTP in <span className="text-blue-400 font-mono">{timer}s</span>
                    </span>
                  )}
                </div>
              </div>
            )
          )}

          {activeStep === 2 && (
            <form onSubmit={handleShopSubmit(onShopSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Shop Name"
                  id="shopName"
                  register={registerShop('name', {
                    required: 'Shop name is required',
                    minLength: { value: 2, message: 'Shop name is too short' },
                    maxLength: { value: 80, message: 'Shop name is too long' }
                  })}
                  errors={shopErrors.name}
                  icon={Store}
                  placeholder="Your shop name"
                />
                <div className="mb-5">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...registerShop('description', {
                      required: 'Description is required',
                      minLength: { value: 10, message: 'Description is too short' },
                      maxLength: { value: 400, message: 'Description is too long' }
                    })}
                    className={`
                      w-full px-4 py-3 bg-gray-800/50 border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200 text-white placeholder-gray-500 resize-y min-h-[100px]
                      ${shopErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-gray-600'}
                    `}
                    placeholder="Describe your shop..."
                  />
                  {shopErrors.description && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <span>•</span> {shopErrors.description.message}
                    </p>
                  )}
                </div>
                <InputField
                  label="Category"
                  id="category"
                  register={registerShop('category', {
                    required: 'Category is required',
                    minLength: { value: 2, message: 'Category is too short' },
                    maxLength: { value: 40, message: 'Category is too long' }
                  })}
                  errors={shopErrors.category}
                  placeholder="e.g., Electronics, Fashion"
                />
                <InputField
                  label="Opening Hours"
                  id="openingHours"
                  register={registerShop('openingHours', {
                    required: 'Opening hours are required',
                    minLength: { value: 2, message: 'Opening hours are too short' },
                    maxLength: { value: 80, message: 'Opening hours are too long' }
                  })}
                  errors={shopErrors.openingHours}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                />
                <InputField
                  label="Website (Optional)"
                  id="website"
                  register={registerShop('website', {
                    pattern: { value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/, message: 'Enter a valid URL' }
                  })}
                  errors={shopErrors.website}
                  placeholder="https://yourshop.com"
                />
                <InputField
                  label="Social Media Links (Optional)"
                  id="socialMediaLinks"
                  register={registerShop('socialMediaLinks', {
                    maxLength: { value: 200, message: 'Too many links' }
                  })}
                  errors={shopErrors.socialMediaLinks}
                  placeholder="https://instagram.com/..., https://facebook.com/..."
                />
                <InputField
                  label="Cover Image URL (Optional)"
                  id="coverImage"
                  register={registerShop('coverImage', {
                    pattern: { value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/, message: 'Enter a valid URL' }
                  })}
                  errors={shopErrors.coverImage}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              {serverError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{serverError}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="flex-1 py-3 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={createShopMutation.isPending}
                  className="flex-[2] py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createShopMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Shop...
                    </>
                  ) : (
                    <>
                      Continue to Banking
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeStep === 3 && (
            <div>
              {!bankCompleted ? (
                <form onSubmit={handleBankSubmit(onBankSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Account Name"
                      id="accountName"
                      register={registerBank('accountName', {
                        required: 'Account name is required',
                        minLength: { value: 2, message: 'Account name is too short' },
                        maxLength: { value: 80, message: 'Account name is too long' }
                      })}
                      errors={bankErrors.accountName}
                      icon={User}
                      placeholder="Full name on account"
                    />
                    <InputField
                      label="Account Number"
                      id="accountNumber"
                      register={registerBank('accountNumber', {
                        required: 'Account number is required',
                        pattern: { value: /^\d{8,20}$/, message: 'Enter a valid account number' }
                      })}
                      errors={bankErrors.accountNumber}
                      icon={CreditCard}
                      type="text"
                      placeholder="Account number"
                    />
                    <InputField
                      label="Bank Name"
                      id="bankName"
                      register={registerBank('bankName', {
                        required: 'Bank name is required',
                        minLength: { value: 2, message: 'Bank name is too short' },
                        maxLength: { value: 80, message: 'Bank name is too long' }
                      })}
                      errors={bankErrors.bankName}
                      icon={Building}
                      placeholder="Name of your bank"
                    />
                    <InputField
                      label="IFSC/SWIFT Code"
                      id="ifsc"
                      register={registerBank('ifsc', {
                        required: 'IFSC is required',
                        pattern: { value: /^[A-Za-z0-9]{4,20}$/, message: 'Enter a valid code' }
                      })}
                      errors={bankErrors.ifsc}
                      placeholder="e.g., SBIN0001234"
                    />
                  </div>

                  {serverError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{serverError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="flex-1 py-3 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Complete Setup
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Setup Complete! 🎉</h2>
                  <p className="text-gray-400 mb-6">Your seller profile is ready. You can now log in.</p>
                  
                  <div className="bg-gray-800/50 rounded-xl p-6 mb-6 max-w-sm mx-auto text-left">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400 text-sm">Shop</span>
                      <span className="text-white font-medium">{shopDetails.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400 text-sm">Bank</span>
                      <span className="text-white font-medium">{bankDetails.bankName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400 text-sm">Account</span>
                      <span className="text-white font-medium">••••{bankDetails.accountNumber?.slice(-4) || 'N/A'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Go to Login
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup