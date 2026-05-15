'use client'

import React, { useRef } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import axiosInstance  from './../../../utils/axiosInstance'


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
  const [canSend , setCanSend] = useState(true);
  const [timer , setTimer] = useState(60);
  const [activeStep, setActiveStep] = useState(1);
  const [showOtp, setShowOtp] = useState(false);
  const [otp , setotp] = useState(["", "", "", "", "", ""]);
  const [sellerId, setSellerId] = useState<string | null>(null)
  const [sellerData , setSellerData] = useState<SellerForm>({
    name : '',
    email : '',
    phoneNumber : '',
    country : '',
    password : '',
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
    mutationFn : async (data : SellerForm) =>{
      const res = await axiosInstance.post('/auth/register-seller', data)
      return res.data
    }, 

    onSuccess : (_,data) =>{
      setShowOtp(true);
      setSellerData(data);
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

  const handleresendOtp = async () =>{
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

  return (
    <div className='w-full py-10 min-h-[100vh]'>

            <div className="w-full mb-20 flex items-center justify-center">
        <div className="flex items-center">
            
            {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center">
                
                {/* Circle */}
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold shadow ${
                    activeStep === step ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                {step}
               
                </div>
              

                {/* Line */}
                {index !== 2 && (
                <div className="w-24 h-1 bg-gray-300"></div>
                )}
            </div>
            ))}

        </div>
        </div>
    
      <h1 className='text-3xl font-bold text-center mb-6'>Sign Up</h1>

        {activeStep === 1 && (
          !showOtp ? (
            <form onSubmit={handleSubmit(onsubmit)} className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
              <div className='mb-4'>
                <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>Name</label>
                <input
                  type="text"
                  id="name"
                  maxLength={60}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name is too short' },
                    maxLength: { value: 60, message: 'Name is too long' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>Email</label>
                <input
                  type="email"
                  id="email"
                  maxLength={120}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="phone" className='block text-gray-700 font-bold mb-2'>Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  inputMode="numeric"
                  maxLength={15}
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: { value: /^\d{7,15}$/, message: 'Enter a valid phone number' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.phoneNumber && <p className='text-red-500 text-sm mt-1'>{errors.phoneNumber.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="country" className='block text-gray-700 font-bold mb-2'>Country</label>
                <input
                  type="text"
                  id="country"
                  maxLength={56}
                  {...register('country', {
                    required: 'Country is required',
                    minLength: { value: 2, message: 'Country is too short' },
                    maxLength: { value: 56, message: 'Country is too long' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.country && <p className='text-red-500 text-sm mt-1'>{errors.country.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="businessName" className='block text-gray-700 font-bold mb-2'>Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  maxLength={80}
                  {...register('businessName', {
                    required: 'Business name is required',
                    minLength: { value: 2, message: 'Business name is too short' },
                    maxLength: { value: 80, message: 'Business name is too long' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.businessName && <p className='text-red-500 text-sm mt-1'>{errors.businessName.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="address" className='block text-gray-700 font-bold mb-2'>Address</label>
                <input
                  type="text"
                  id="address"
                  maxLength={120}
                  {...register('address', {
                    required: 'Address is required',
                    minLength: { value: 5, message: 'Address is too short' },
                    maxLength: { value: 120, message: 'Address is too long' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.address && <p className='text-red-500 text-sm mt-1'>{errors.address.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="city" className='block text-gray-700 font-bold mb-2'>City</label>
                <input
                  type="text"
                  id="city"
                  maxLength={60}
                  {...register('city', {
                    required: 'City is required',
                    minLength: { value: 2, message: 'City is too short' },
                    maxLength: { value: 60, message: 'City is too long' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.city && <p className='text-red-500 text-sm mt-1'>{errors.city.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="state" className='block text-gray-700 font-bold mb-2'>State</label>
                <input
                  type="text"
                  id="state"
                  maxLength={60}
                  {...register('state', {
                    required: 'State is required',
                    minLength: { value: 2, message: 'State is too short' },
                    maxLength: { value: 60, message: 'State is too long' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.state && <p className='text-red-500 text-sm mt-1'>{errors.state.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="postalCode" className='block text-gray-700 font-bold mb-2'>Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  maxLength={10}
                  {...register('postalCode', {
                    required: 'Postal code is required',
                    pattern: { value: /^[A-Za-z0-9\- ]{3,10}$/, message: 'Enter a valid postal code' }
                  })}
                  className={`w-full px-3 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.postalCode && <p className='text-red-500 text-sm mt-1'>{errors.postalCode.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>Password</label>
                <div className='relative'>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    maxLength={64}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      maxLength: { value: 64, message: 'Password is too long' }
                    })}
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
                <span>Already have an account?</span>
                <Link href={'/login'} className='ml-5 font-poppins text-blue-500'>
                  Login
                </Link>
              </div>
            </form>
          ) : (
            <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
              <div className='mt-4 justify-center items-center flex'>
                <span>Already have an account?</span>
                <Link href={'/login'} className='ml-5 font-poppins text-blue-500'>
                  Login
                </Link>
              </div>

              <h1 className='text-2xl justify-center items-center flex font-poppins mt-4'> Enter OTP</h1>
              <div className='flex justify-center gap-6 mt-4'>
                {otp?.map((digit, index) => (
                  <input
                    type="text"
                    key={index}
                    ref={(el => {
                      if (el) inputRefs.current[index] = el;
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
                ) : (
                  <button>
                    Resend OTP in {timer}
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {activeStep === 2 && (
          <form onSubmit={handleShopSubmit(onShopSubmit)} className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
            <div className='mb-4'>
              <label htmlFor="shopName" className='block text-gray-700 font-bold mb-2'>Shop Name</label>
              <input
                type="text"
                id="shopName"
                maxLength={80}
                {...registerShop('name', {
                  required: 'Shop name is required',
                  minLength: { value: 2, message: 'Shop name is too short' },
                  maxLength: { value: 80, message: 'Shop name is too long' }
                })}
                className={`w-full px-3 py-2 border ${shopErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {shopErrors.name && <p className='text-red-500 text-sm mt-1'>{shopErrors.name.message}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor="description" className='block text-gray-700 font-bold mb-2'>Description</label>
              <textarea
                id="description"
                maxLength={400}
                {...registerShop('description', {
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description is too short' },
                  maxLength: { value: 400, message: 'Description is too long' }
                })}
                className={`w-full px-3 py-2 border ${shopErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {shopErrors.description && <p className='text-red-500 text-sm mt-1'>{shopErrors.description.message}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor="category" className='block text-gray-700 font-bold mb-2'>Category</label>
              <input
                type="text"
                id="category"
                maxLength={40}
                {...registerShop('category', {
                  required: 'Category is required',
                  minLength: { value: 2, message: 'Category is too short' },
                  maxLength: { value: 40, message: 'Category is too long' }
                })}
                className={`w-full px-3 py-2 border ${shopErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {shopErrors.category && <p className='text-red-500 text-sm mt-1'>{shopErrors.category.message}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor="openingHours" className='block text-gray-700 font-bold mb-2'>Opening Hours</label>
              <input
                type="text"
                id="openingHours"
                maxLength={80}
                {...registerShop('openingHours', {
                  required: 'Opening hours are required',
                  minLength: { value: 2, message: 'Opening hours are too short' },
                  maxLength: { value: 80, message: 'Opening hours are too long' }
                })}
                className={`w-full px-3 py-2 border ${shopErrors.openingHours ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {shopErrors.openingHours && <p className='text-red-500 text-sm mt-1'>{shopErrors.openingHours.message}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor="website" className='block text-gray-700 font-bold mb-2'>Website</label>
              <input
                type="text"
                id="website"
                maxLength={120}
                {...registerShop('website', {
                  pattern: { value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/, message: 'Enter a valid URL' }
                })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="socialMediaLinks" className='block text-gray-700 font-bold mb-2'>Social Media Links (comma separated)</label>
              <input
                type="text"
                id="socialMediaLinks"
                maxLength={200}
                {...registerShop('socialMediaLinks', {
                  maxLength: { value: 200, message: 'Too many links' }
                })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='mb-4'>
              <label htmlFor="coverImage" className='block text-gray-700 font-bold mb-2'>Cover Image URL</label>
              <input
                type="text"
                id="coverImage"
                maxLength={200}
                {...registerShop('coverImage', {
                  pattern: { value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/, message: 'Enter a valid URL' }
                })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            {serverError && <p className='text-red-500 text-sm mb-4'>{serverError}</p>}
            <button
              type="submit"
              disabled={createShopMutation.isPending}
              className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {createShopMutation.isPending ? 'Creating Shop...' : 'Create Shop'}
            </button>
          </form>
        )}

        {activeStep === 3 && (
          <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
            {!bankCompleted ? (
              <form onSubmit={handleBankSubmit(onBankSubmit)}>
                <div className='mb-4'>
                  <label htmlFor="accountName" className='block text-gray-700 font-bold mb-2'>Account Name</label>
                  <input
                    type="text"
                    id="accountName"
                    maxLength={80}
                    {...registerBank('accountName', {
                      required: 'Account name is required',
                      minLength: { value: 2, message: 'Account name is too short' },
                      maxLength: { value: 80, message: 'Account name is too long' }
                    })}
                    className={`w-full px-3 py-2 border ${bankErrors.accountName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {bankErrors.accountName && <p className='text-red-500 text-sm mt-1'>{bankErrors.accountName.message}</p>}
                </div>
                <div className='mb-4'>
                  <label htmlFor="accountNumber" className='block text-gray-700 font-bold mb-2'>Account Number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    inputMode="numeric"
                    maxLength={20}
                    {...registerBank('accountNumber', {
                      required: 'Account number is required',
                      pattern: { value: /^\d{8,20}$/, message: 'Enter a valid account number' }
                    })}
                    className={`w-full px-3 py-2 border ${bankErrors.accountNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {bankErrors.accountNumber && <p className='text-red-500 text-sm mt-1'>{bankErrors.accountNumber.message}</p>}
                </div>
                <div className='mb-4'>
                  <label htmlFor="bankName" className='block text-gray-700 font-bold mb-2'>Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    maxLength={80}
                    {...registerBank('bankName', {
                      required: 'Bank name is required',
                      minLength: { value: 2, message: 'Bank name is too short' },
                      maxLength: { value: 80, message: 'Bank name is too long' }
                    })}
                    className={`w-full px-3 py-2 border ${bankErrors.bankName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {bankErrors.bankName && <p className='text-red-500 text-sm mt-1'>{bankErrors.bankName.message}</p>}
                </div>
                <div className='mb-4'>
                  <label htmlFor="ifsc" className='block text-gray-700 font-bold mb-2'>IFSC</label>
                  <input
                    type="text"
                    id="ifsc"
                    maxLength={20}
                    {...registerBank('ifsc', {
                      required: 'IFSC is required',
                      pattern: { value: /^[A-Za-z0-9]{4,20}$/, message: 'Enter a valid IFSC' }
                    })}
                    className={`w-full px-3 py-2 border ${bankErrors.ifsc ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {bankErrors.ifsc && <p className='text-red-500 text-sm mt-1'>{bankErrors.ifsc.message}</p>}
                </div>
                {serverError && <p className='text-red-500 text-sm mb-4'>{serverError}</p>}
                <button
                  type="submit"
                  className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'
                >
                  Finish Setup
                </button>
              </form>
            ) : (
              <div className='text-center'>
                <h2 className='text-2xl font-bold mb-2'>Setup Complete</h2>
                <p className='text-gray-600 mb-4'>Your seller profile is ready. You can now log in.</p>
                <div className='text-left text-sm text-gray-600 mb-6'>
                  <p><span className='font-semibold'>Shop:</span> {shopDetails.name || 'N/A'}</p>
                  <p><span className='font-semibold'>Bank:</span> {bankDetails.bankName || 'N/A'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        )}

    </div>
  )
}
export default Signup
