"use client"

import React from 'react'
import useSeller from '../../../../../../hooks/useSeller';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../../../utils/axiosInstance';
import { useParams } from 'next/navigation';
import {
  Save,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Box,
  Layers,
  AlertCircle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Info,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link';

const EditProductPage = ({
  params,
}: {
  params: { id: string }
}) => {
  const routeParams = useParams();
  const id = Array.isArray(routeParams?.id) ? routeParams.id[0] : (routeParams?.id as string | undefined);

  const { seller, isLoading: isSellerLoading } = useSeller();

  const {
    data,
    isLoading: isProductLoading,
    error: productError,
    refetch
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${id}`)
      return response.data
    },
    enabled: !!id,
  })

  const product = data?.product ?? data ?? null;

  const [updated, setUpdated] = React.useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    quantity: 0,
    category: '',
    brand: '',
    sku: '',
  });

  React.useEffect(() => {
    if (!product) return;
    setUpdated({
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: Number(product?.price ?? 0),
      stock: Number(product?.stock ?? 0),
      quantity: Number(product?.quantity ?? product?.stock ?? 0),
      category: product?.category ?? '',
      brand: product?.brand ?? '',
      sku: product?.sku ?? '',
    });
  }, [product]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Product ID Missing</h2>
          <p className="text-gray-400 text-sm">The product ID is required to edit this product.</p>
          <Link href="/dashboard/products" className="inline-flex items-center gap-2 mt-6 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const {
    mutate: updateProduct,
    isPending: isUpdating,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
    reset: resetUpdate
  } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(`/products/update/${id}`, payload)
      return response.data
    },
    onSuccess: () => {
      refetch();
    }
  })

  const handleUpdate = async () => {
    resetUpdate();
    updateProduct(updated);
  }

  if (isSellerLoading || isProductLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-gray-400 text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (productError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Product</h2>
          <p className="text-gray-400 text-sm">There was an error loading the product details. Please try again.</p>
          <button 
            onClick={() => refetch()}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
          <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 text-sm">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/dashboard/products" className="inline-flex items-center gap-2 mt-6 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const InputField = ({ label, value, onChange, type = 'text', placeholder, icon: Icon, error, ...props }: any) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 bg-gray-700/30 border rounded-xl
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
            transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 hover:border-gray-600'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )

  const TextAreaField = ({ label, value, onChange, rows = 5, placeholder }: any) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 resize-none"
      />
    </div>
  )

  const SelectField = ({ label, value, onChange, options, ...props }: any) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-700/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
        {...props}
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/dashboard/products" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Edit Product
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Update and manage product details for</span>
              <span className="text-blue-400 font-medium">{seller?.shop?.name || 'Your Store'}</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {(isUpdateSuccess || isUpdateError) && (
          <div className="mb-6 animate-slideDown">
            {isUpdateSuccess && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Product updated successfully!</span>
              </div>
            )}
            {isUpdateError && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400">
                <XCircle className="w-5 h-5" />
                <span>Failed to update product: {(updateError as any)?.message ?? 'Unknown error'}</span>
              </div>
            )}
          </div>
        )}

        {/* Main Form */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 md:p-8 hover:border-gray-600 transition-all duration-300">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Main Fields */}
            <div className="xl:col-span-2 space-y-6">
              {/* Product Name */}
              <InputField
                label="Product Name"
                value={updated.name}
                onChange={(val: string) => setUpdated(prev => ({ ...prev, name: val }))}
                placeholder="Enter product name"
                icon={Tag}
              />

              {/* Description */}
              <TextAreaField
                label="Product Description"
                value={updated.description}
                onChange={(val: string) => setUpdated(prev => ({ ...prev, description: val }))}
                rows={5}
                placeholder="Describe your product in detail"
              />

              {/* Price & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Price"
                  type="number"
                  value={updated.price}
                  onChange={(val: string) => setUpdated(prev => ({ ...prev, price: Number(val) }))}
                  placeholder="0.00"
                  icon={DollarSign}
                />
                <InputField
                  label="Stock Quantity"
                  type="number"
                  value={updated.stock}
                  onChange={(val: string) => setUpdated(prev => ({ ...prev, stock: Number(val) }))}
                  placeholder="0"
                  icon={Box}
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Category"
                  value={updated.category}
                  onChange={(val: string) => setUpdated(prev => ({ ...prev, category: val }))}
                  options={['Electronics', 'Accessories', 'Audio', 'Fashion', 'Home & Garden', 'Sports']}
                />
                <InputField
                  label="Brand"
                  value={updated.brand}
                  onChange={(val: string) => setUpdated(prev => ({ ...prev, brand: val }))}
                  placeholder="Enter brand name"
                  icon={Layers}
                />
              </div>

              {/* SKU */}
              <InputField
                label="SKU"
                value={updated.sku}
                onChange={(val: string) => setUpdated(prev => ({ ...prev, sku: val }))}
                placeholder="Enter SKU"
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-gray-700/20 border border-gray-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                  Product Image
                </h2>
                <label className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all duration-300 bg-gray-700/10 hover:bg-gray-700/20 group">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    📦
                  </div>
                  <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    Change Product Image
                  </p>
                  <span className="text-sm text-gray-500 mt-1">
                    PNG, JPG, WEBP (Max 5MB)
                  </span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              {/* Product Info */}
              <div className="bg-gray-700/20 border border-gray-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Product Info
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</p>
                    <p className="font-mono text-sm text-gray-300 mt-1 bg-gray-700/30 px-3 py-1.5 rounded-lg">
                      {product.id?.slice(0, 12) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</p>
                    <p className="font-mono text-sm text-gray-300 mt-1 bg-gray-700/30 px-3 py-1.5 rounded-lg">
                      {product.sku || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                    <span className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/20">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="bg-gray-700/20 border border-gray-700 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default EditProductPage