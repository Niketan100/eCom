'use client'

import React from 'react'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Plus,
  Trash2,
  Save,
  Package,
  Tag,
  DollarSign,
  Box,
  Truck,
  Shield,
  Layers,
  List,
  X,
  ChevronDown,
  AlertCircle
} from 'lucide-react'

type ProductFormData = {
  name: string
  shortDescription: string
  description: string
  category: string
  subcategory: string
  brand: string
  price: number
  discountedPrice: number
  stock: number
  sku: string
  tags: string
  shippingWeight: string
  warranty: string
}

const CreateProductPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>()

  const [features, setFeatures] = React.useState([{ key: '', value: '' }])
  const [highlights, setHighlights] = React.useState([''])
  const [variants, setVariants] = React.useState([
    { type: '', value: '', stock: '', additionalPrice: '' }
  ])

  const submitMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const payload = {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory || null,
        brand: data.brand,
        price: Number(data.price),
        discountedPrice: Number(data.discountedPrice) || null,
        stock: Number(data.stock),
        sku: data.sku,
        tags: data.tags?.split(',').map((tag) => tag.trim()) || [],
        shippingWeight: data.shippingWeight,
        warranty: data.warranty,
        highlights: highlights.filter(h => h.trim()),
        features: features.filter(f => f.key.trim() && f.value.trim()),
        variants: variants.filter(v => v.type.trim() && v.value.trim())
      }
      const res = await axiosInstance.post('/products/create-product', payload)
      return res.data
    },
    onSuccess: () => {
      alert('Product created successfully')
      reset()
      setFeatures([{ key: '', value: '' }])
      setHighlights([''])
      setVariants([{ type: '', value: '', stock: '', additionalPrice: '' }])
    }
  })

  const onSubmit = async (data: ProductFormData) => {
    await submitMutation.mutateAsync(data)
  }

  const selectedCategory = watch('category') || ''
  const selectedSubcategory = watch('subcategory') || ''

  const getCategory = useQuery({
    queryKey: ['getCategories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/categories')
      return res.data
    }
  })

  const cate: string[] = getCategory.data?.categories || []
  const subcate: Record<string, string[]> = getCategory.data?.subcategories || {}
  const availableSubcategories = selectedCategory ? (subcate[selectedCategory] || []) : []

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCategory = e.target.value
    setValue('category', nextCategory)
    setValue('subcategory', '')
  }

  const handleSubcategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('subcategory', e.target.value)
  }

  React.useEffect(() => {
    register('category')
    register('subcategory')
  }, [register])

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index))
    }
  }

  const removeHighlight = (index: number) => {
    if (highlights.length > 1) {
      setHighlights(highlights.filter((_, i) => i !== index))
    }
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const FormSection = ({ title, icon: Icon, children, className = '' }: any) => (
    <div className={`bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )

  const InputField = ({ label, register: reg, errors: err, icon: Icon, type = 'text', placeholder, ...props }: any) => (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 bg-gray-700/30 border rounded-xl
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
            transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${err ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-gray-600'}
          `}
          {...reg}
          {...props}
        />
      </div>
      {err && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {err.message}
        </p>
      )}
    </div>
  )

  const TextAreaField = ({ label, register: reg, rows = 5, placeholder }: any) => (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
        {...reg}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Create Product
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Create professional ecommerce listings</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <button
            form="create-product"
            type="submit"
            disabled={submitMutation.isPending}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publish Product
              </>
            )}
          </button>
        </div>

        <form id="create-product" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Info */}
            <FormSection title="Product Information" icon={Package}>
              <div className="space-y-4">
                <InputField
                  placeholder="Product Name"
                  register={register('name', { required: 'Product name is required' })}
                  errors={errors.name}
                  icon={Tag}
                />
                <InputField
                  placeholder="Short Description"
                  register={register('shortDescription', { required: 'Short description is required' })}
                  errors={errors.shortDescription}
                />
                <TextAreaField
                  rows={5}
                  placeholder="Description"
                  register={register('description', { required: 'Description is required' })}
                />
              </div>
            </FormSection>

            {/* Features */}
            <FormSection title="Features" icon={Layers}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Structured product specifications</p>
                <button
                  type="button"
                  onClick={() => setFeatures([...features, { key: '', value: '' }])}
                  className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Feature name (e.g., Battery)"
                        value={feature.key}
                        onChange={(e) => {
                          const updated = [...features]
                          updated[index].key = e.target.value
                          setFeatures(updated)
                        }}
                        className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Feature value (e.g., 5000mAh)"
                        value={feature.value}
                        onChange={(e) => {
                          const updated = [...features]
                          updated[index].value = e.target.value
                          setFeatures(updated)
                        }}
                        className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </FormSection>

            {/* Highlights */}
            <FormSection title="Highlights" icon={List}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Marketing bullet points</p>
                <button
                  type="button"
                  onClick={() => setHighlights([...highlights, ''])}
                  className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Highlight
                </button>
              </div>
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g., Fast Charging"
                      value={highlight}
                      onChange={(e) => {
                        const updated = [...highlights]
                        updated[index] = e.target.value
                        setHighlights(updated)
                      }}
                      className="flex-1 px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                    />
                    {highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </FormSection>

            {/* Variants */}
            <FormSection title="Variants" icon={Box}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">Product options and variations</p>
                <button
                  type="button"
                  onClick={() => setVariants([...variants, { type: '', value: '', stock: '', additionalPrice: '' }])}
                  className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Type (e.g., Color)"
                        value={variant.type}
                        onChange={(e) => {
                          const updated = [...variants]
                          updated[index].type = e.target.value
                          setVariants(updated)
                        }}
                        className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., Black)"
                        value={variant.value}
                        onChange={(e) => {
                          const updated = [...variants]
                          updated[index].value = e.target.value
                          setVariants(updated)
                        }}
                        className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => {
                          const updated = [...variants]
                          updated[index].stock = e.target.value
                          setVariants(updated)
                        }}
                        className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                      <input
                        type="number"
                        placeholder="Extra Price"
                        value={variant.additionalPrice}
                        onChange={(e) => {
                          const updated = [...variants]
                          updated[index].additionalPrice = e.target.value
                          setVariants(updated)
                        }}
                        className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </FormSection>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Pricing */}
            <FormSection title="Pricing" icon={DollarSign}>
              <div className="space-y-4">
                <InputField
                  type="number"
                  placeholder="Price"
                  register={register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be greater than 0' }
                  })}
                  errors={errors.price}
                  icon={DollarSign}
                />
                <InputField
                  type="number"
                  placeholder="Discounted Price"
                  register={register('discountedPrice')}
                  icon={Tag}
                />
              </div>
            </FormSection>

            {/* Inventory */}
            <FormSection title="Inventory" icon={Box}>
              <div className="space-y-4">
                <InputField
                  type="number"
                  placeholder="Stock Quantity"
                  register={register('stock', { 
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock must be 0 or more' }
                  })}
                  errors={errors.stock}
                />
                <InputField
                  placeholder="SKU"
                  register={register('sku', { required: 'SKU is required' })}
                  errors={errors.sku}
                />
              </div>
            </FormSection>

            {/* Organization */}
            <FormSection title="Organization" icon={Layers}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-700/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                    value={selectedCategory}
                    onChange={handleCategorySelect}
                  >
                    <option value="">Select Category</option>
                    {cate.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Subcategory</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-700/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={selectedSubcategory}
                    onChange={handleSubcategorySelect}
                    disabled={!selectedCategory}
                  >
                    <option value="">
                      {selectedCategory ? 'Select Subcategory' : 'Select category first'}
                    </option>
                    {availableSubcategories.map((sc) => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                <InputField
                  placeholder="Brand"
                  register={register('brand', { required: 'Brand is required' })}
                  errors={errors.brand}
                />
                <InputField
                  placeholder="Tags (comma separated)"
                  register={register('tags')}
                />
              </div>
            </FormSection>

            {/* Shipping */}
            <FormSection title="Shipping & Warranty" icon={Truck}>
              <div className="space-y-4">
                <InputField
                  placeholder="Shipping Weight"
                  register={register('shippingWeight')}
                />
                <InputField
                  placeholder="Warranty"
                  register={register('warranty')}
                  icon={Shield}
                />
              </div>
            </FormSection>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductPage