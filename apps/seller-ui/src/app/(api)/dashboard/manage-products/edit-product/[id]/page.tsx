"use client"

import React from 'react'
import useSeller from '../../../../../../hooks/useSeller';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../../../utils/axiosInstance';
import { useParams } from 'next/navigation';

const EditProductPage = ({
    params,
}: {
    params: { id: string }
}) => {
    const routeParams = useParams();
    const id = Array.isArray(routeParams?.id) ? routeParams.id[0] : (routeParams?.id as string | undefined);

    const { seller, isLoading } = useSeller();

    

        const {
            data,
            isLoading: isProductLoading,
            error: productError,
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
        category: '',
    });

    React.useEffect(() => {
        if (!product) return;
        setUpdated({
            name: product?.name ?? '',
            description: product?.description ?? '',
            price: Number(product?.price ?? 0),
            stock: Number(product?.stock ?? 0),
            category: product?.category ?? '',
        });
    }, [product]);




    if (!id) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-[#f6f7fb]'>
                <p className='text-gray-500 text-lg'>Product Id is missing.</p>
            </div>
        )
    }


    const {
        mutate: updateProduct,
        isPending: isUpdating,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError,
    } = useMutation({
        mutationFn: async (payload: any) => {
            // backend route: POST /products/update/:id
            const response = await axiosInstance.post(`/products/update/${id}`, payload)
            return response.data
        },
    })

    const handleClick = async  () =>{
       updateProduct(updated);
    }

    if(isLoading){
        return (
            <div className='flex justify-center items-center min-h-screen bg-[#f6f7fb]'>
                <div className='flex flex-col items-center gap-4'>

                    <div className='w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>

                    <h1 className='text-gray-500 text-lg'>
                        Loading Seller Info...
                    </h1>

                </div>
            </div>
        )
    }

  
    // API shape has varied in this repo; normalize to a single `product` object

    if (isLoading || isProductLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-[#f6f7fb]'>
                <div className='flex flex-col items-center gap-4'>

                    <div className='w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>

                    <h1 className='text-gray-500 text-lg'>
                        Loading Product...
                    </h1>

                </div>
            </div>
        )
    }

    if (productError) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-[#f6f7fb]'>
                <p className='text-red-500 text-lg'>Failed to load product.</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-[#f6f7fb]'>
                <p className='text-gray-500 text-lg'>Product not found.</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#f6f7fb] p-6'>

            <div className='max-w-5xl mx-auto'>

                {/* Header */}
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8'>

                    <div>

                        <h1 className='text-4xl font-bold tracking-tight text-black'>
                            Edit Product
                        </h1>

                        <p className='text-gray-500 mt-2'>
                            Update and manage product details for{' '}
                            <span className='font-semibold text-black'>
                                {seller?.shop?.name || 'Your Store'}
                            </span>
                        </p>

                    </div>

                    <div className='flex gap-3'>

                        <button className='bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-medium hover:bg-red-100 transition-all duration-200'>
                            Delete Product
                        </button>

                        <button
                            className={`bg-black text-white px-5 py-3 rounded-2xl font-medium transition-all duration-200 ${
                                isUpdating ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#111]'
                            }`}
                            onClick={() => handleClick()}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>

                    </div>

                </div>

                {(isUpdateSuccess || isUpdateError) && (
                    <div className='mb-6'>
                        {isUpdateSuccess && (
                            <div className='bg-green-50 text-green-700 border border-green-200 rounded-2xl px-4 py-3'>
                                Product updated successfully.
                            </div>
                        )}
                        {isUpdateError && (
                            <div className='bg-red-50 text-red-700 border border-red-200 rounded-2xl px-4 py-3'>
                                Failed to update product{updateError ? `: ${(updateError as any)?.message ?? ''}` : ''}.
                            </div>
                        )}
                    </div>
                )}

                {/* Main Card */}
                <div className='bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm'>

                    <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>

                        {/* Left */}
                        <div className='xl:col-span-2 flex flex-col gap-6'>

                            {/* Product Name */}
                            <div className='flex flex-col gap-2'>

                                <label className='text-sm font-semibold text-gray-700'>
                                    Product Name
                                </label>

                                <input
                                    type='text'
                                    defaultValue={product.name}
                                    onChange={(e) => setUpdated((prev) => ({ ...prev, name: e.target.value }))}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
                                />

                            </div>

                            {/* Description */}
                            <div className='flex flex-col gap-2'>

                                <label className='text-sm font-semibold text-gray-700'>
                                    Product Description
                                </label>

                                <textarea
                                    rows={6}
                                    defaultValue={product.description}
                                    onChange={(e) => setUpdated((prev) => ({ ...prev, description: e.target.value }))}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all resize-none'
                                />

                            </div>

                            {/* Price + Quantity */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                                <div className='flex flex-col gap-2'>

                                    <label className='text-sm font-semibold text-gray-700'>
                                        Product Price
                                    </label>

                                    <input
                                        type='number'
                                        defaultValue={product.price}
                                        onChange={(e) => setUpdated((prev) => ({ ...prev, price: Number(e.target.value) }))}
                                        className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
                                    />

                                </div>

                                <div className='flex flex-col gap-2'>

                                    <label className='text-sm font-semibold text-gray-700'>
                                        Product Quantity
                                    </label>

                                    <input
                                    onChange={(e) => setUpdated((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                        type='number'
                                        defaultValue={product.quantity}
                                        className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
                                    />

                                </div>

                            </div>

                            {/* Category + Brand */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                                <div className='flex flex-col gap-2'>

                                    <label className='text-sm font-semibold text-gray-700'>
                                        Category
                                    </label>

                                    <select
                                        defaultValue={product.category}
                                        onChange={(e) => setUpdated((prev) => ({ ...prev, category: e.target.value }))}
                                        className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
                                    >
                                        <option>Electronics</option>
                                        <option>Accessories</option>
                                        <option>Audio</option>
                                        <option>Fashion</option>
                                    </select>

                                </div>

                                <div className='flex flex-col gap-2'>

                                    <label className='text-sm font-semibold text-gray-700'>
                                        Brand
                                    </label>

                                    <input
                                        type='text'
                                        defaultValue={product.brand}
                                        className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
                                    />

                                </div>

                            </div>

                        </div>

                        {/* Right */}
                        <div className='flex flex-col gap-6'>

                            {/* Image Upload */}
                            <div className='bg-[#fafafa] border border-gray-200 rounded-[28px] p-6'>

                                <h2 className='text-lg font-bold text-black mb-5'>
                                    Product Image
                                </h2>

                                <label className='border-2 border-dashed border-gray-300 rounded-[24px] p-10 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all bg-white'>

                                    <div className='text-6xl mb-3'>
                                        📦
                                    </div>

                                    <p className='font-semibold text-black'>
                                        Change Product Image
                                    </p>

                                    <span className='text-sm text-gray-500 mt-1'>
                                        PNG, JPG, WEBP
                                    </span>

                                    <input
                                        type='file'
                                        className='hidden'
                                    />

                                </label>

                            </div>

                            {/* Product Info */}
                            <div className='bg-[#fafafa] border border-gray-200 rounded-[28px] p-6'>

                                <h2 className='text-lg font-bold text-black mb-5'>
                                    Product Info
                                </h2>

                                <div className='flex flex-col gap-4'>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Product ID
                                        </p>

                                        <h3 className='font-semibold text-black mt-1'>
                                            {product.id}
                                        </h3>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            SKU
                                        </p>

                                        <h3 className='font-semibold text-black mt-1'>
                                            {product.sku}
                                        </h3>
                                    </div>

                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            Status
                                        </p>

                                        <span className='inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700'>
                                            Active
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default EditProductPage
