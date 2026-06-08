'use client'

import React from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'

import ProductGallery from './ProductGallery'

import ProductHighlights from './ProductHighlights'

import ProductSpecs from './ProductSpecs'

import ProductVariants from './ProductVariants'

import ProductShipping from './ProductShipping'

import ProductSeller from './ProductSeller'

import ProductReviews from './ProductReviews'
import { useEffect} from 'react'
import { useStore } from 'apps/user-ui/src/store'
import useUser from 'apps/user-ui/src/hooks/useUSer'
import { useLocation } from 'apps/user-ui/src/hooks/useLocation'

const DetailedProductLayout = ({
   product
}: any) => {


      const Cart = useStore((state) => state.cart);
      const user = useUser();
    
       const { latitude, longitude } = useLocation();
       const deviceInfo = navigator.userAgent;
   
      const wishList = useStore((state) => state.wishList);
      console.log(wishList);
   
      const addToCart = useStore((state) => state.addToCart)
      const addToWishList = useStore((state) => state.addToWishList)
      const removeFromCart = useStore((state) => state.removeFromCart)
      const removeFromWishList = useStore((state) => state.removeFromWishList)
   
      const isInCart = useStore((state) =>
         state.cart.some(
            (item) => item.id === product.id
         )
      )
      const isInWishlist = useStore((state) =>
         state.wishList.some(
            (item) => item.id === product.id
         )
      )
      useEffect(() => {
         console.log('Wishlist updated:', wishList);
         console.log('CArt' , Cart);
      }, [addToWishList, removeFromWishList, wishList]);
   

   const queryClient = useQueryClient()
   const router = useRouter()

   const [quantity, setQuantity] =
      React.useState(1)

   const [selectedVariant, setSelectedVariant] =
      React.useState<any>(null)

   const addToCartMutation = useMutation({
      mutationFn: async () => {
         await axiosInstance.post('/products/cart/add', {
            productId: product.id,
            quantity,
            variantId: selectedVariant?.id ?? undefined,
         })
      },
      onSuccess: async () => {
         await queryClient.invalidateQueries({ queryKey: ['cart'] })
         await queryClient.invalidateQueries({ queryKey: ['cart-count'] })
         router.push('/cart')
      },
   })

   const addToWishlistMutation = useMutation({
      mutationFn: async () => {
         await axiosInstance.post('/products/wishlist/add', {
            productId: product.id,
         })
      },
      onSuccess: async () => {
         await queryClient.invalidateQueries({ queryKey: ['wishlist'] })
         await queryClient.invalidateQueries({ queryKey: ['wishlist-count'] })
      },
   })

   const finalPrice =
      product.discountedPrice ||
      product.price

   const discountPercentage =
      product.discountedPrice
         ? Math.round(
              ((product.price -
                 product.discountedPrice) /
                 product.price) *
                 100
           )
         : 0

   return (

      <div>

            {/* BREADCRUMB */}

            <div className='flex items-center gap-2 text-sm text-gray-500 mb-8'>

               <Link href='/products'>
                  Products
               </Link>

               <span>/</span>

               <span className='text-black font-medium'>
                  {product.name}
               </span>

            </div>

            {/* HERO SECTION */}

            <div className='grid grid-cols-1 2xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start'>

               {/* LEFT SIDE */}

               <div className='space-y-8'>

                  {/* GALLERY */}

                  <ProductGallery
                     product={product}
                  />

                  {/* SPECS */}

                  {product.features
                     ?.length > 0 && (

                     <ProductSpecs
                        product={product}
                     />

                  )}

                  {/* HIGHLIGHTS */}

                  {product.highlights
                     ?.length > 0 && (

                     <ProductHighlights
                        product={product}
                     />

                  )}

               </div>

               {/* RIGHT SIDE */}

               <div className='sticky top-6'>

                  <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                     {/* BADGES */}

                     <div className='flex flex-wrap items-center gap-3 mb-6'>

                        <span className='bg-black text-white px-4 py-2 rounded-full text-sm font-medium'>
                           {product.category}
                        </span>

                        {product.brand && (

                           <span className='bg-[#f3f4f6] text-black px-4 py-2 rounded-full text-sm font-medium'>
                              {product.brand}
                           </span>

                        )}

                        {product.isFeatured && (

                           <span className='bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold'>
                              Featured
                           </span>

                        )}

                     </div>

                     {/* TITLE */}

                     <h1 className='text-5xl font-bold text-black leading-tight'>

                        {product.name}

                     </h1>

                     {/* SHORT DESCRIPTION */}

                     {product.shortDescription && (

                        <p className='text-xl text-gray-500 mt-5 leading-relaxed'>

                           {product.shortDescription}

                        </p>

                     )}

                     {/* TAGS */}

                     {product.tags?.length > 0 && (

                        <div className='flex flex-wrap gap-3 mt-6'>

                           {product.tags.map(
                              (
                                 tag: string,
                                 index: number
                              ) => (

                                 <span
                                    key={index}
                                    className='bg-[#f3f4f6] text-gray-600 px-4 py-2 rounded-full text-sm'
                                 >

                                    #{tag}

                                 </span>

                              )
                           )}

                        </div>

                     )}

                     {/* RATING */}

                     <div className='flex items-center gap-4 mt-8'>

                        <div className='flex text-yellow-500 text-2xl'>
                           ★★★★★
                        </div>

                        <span className='text-gray-500 text-lg'>

                           {product.averageRating ||
                              4.8}
                           /5 Rating

                        </span>

                        <span className='text-gray-400'>

                           (
                           {product.reviewCount ||
                              0}
                           {' '}
                           reviews)

                        </span>

                     </div>

                     {/* PRICE */}

                     <div className='mt-10'>

                        <div className='flex items-center gap-5 flex-wrap'>

                           <h2 className='text-6xl font-bold text-black'>

                              ₹
                              {
                                 finalPrice
                              }

                           </h2>

                           {product.discountedPrice && (

                              <>
                                 <span className='text-3xl text-gray-400 line-through'>

                                    ₹
                                    {
                                       product.price
                                    }

                                 </span>

                                 <span className='bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold'>

                                    {
                                       discountPercentage
                                    }
                                    % OFF

                                 </span>
                              </>

                           )}

                        </div>

                        {product.discountedPrice && (

                           <p className='text-green-600 mt-4 font-medium text-lg'>

                              You save ₹
                              {
                                 product.price -
                                 product.discountedPrice
                              }

                           </p>

                        )}

                     </div>

                     {/* STOCK */}

                     <div className='mt-8 flex items-center gap-4 flex-wrap'>

                        <span
                           className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              product.stock > 10
                                 ? 'bg-green-100 text-green-700'
                                 : product.stock > 0
                                 ? 'bg-yellow-100 text-yellow-700'
                                 : 'bg-red-100 text-red-700'
                           }`}
                        >

                           {product.stock > 10
                              ? 'In Stock'
                              : product.stock > 0
                              ? 'Low Stock'
                              : 'Out Of Stock'}

                        </span>

                        <span className='text-gray-500'>

                           {
                              product.stock
                           }
                           {' '}
                           items available

                        </span>

                     </div>

                     {/* VARIANTS */}

                     {product.variants
                        ?.length > 0 && (

                        <div className='mt-10'>

                           <ProductVariants
                              product={product}
                              selectedVariant={
                                 selectedVariant
                              }
                              setSelectedVariant={
                                 setSelectedVariant
                              }
                           />

                        </div>

                     )}

                     {/* QUANTITY */}

                     <div className='mt-10'>

                        <div className='flex items-center justify-between mb-4'>

                           <h3 className='text-2xl font-bold text-black'>
                              Quantity
                           </h3>

                           <span className='text-gray-500'>
                              Max:
                              {' '}
                              {product.stock}
                           </span>

                        </div>

                        <div className='flex items-center gap-4'>

                           <button
                              onClick={() =>
                                 setQuantity(
                                    (
                                       prev
                                    ) =>
                                       prev >
                                       1
                                          ? prev -
                                            1
                                          : 1
                                 )
                              }
                              className='w-14 h-14 rounded-2xl bg-[#f3f4f6] text-2xl font-bold hover:bg-black hover:text-white transition-all'
                           >

                              -

                           </button>

                           <div className='w-20 h-14 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-xl font-semibold'>

                              {
                                 quantity
                              }

                           </div>

                           <button
                              onClick={() =>
                                 setQuantity(
                                    (
                                       prev
                                    ) =>
                                       prev <
                                       product.stock
                                          ? prev +
                                            1
                                          : prev
                                 )
                              }
                              className='w-14 h-14 rounded-2xl bg-[#f3f4f6] text-2xl font-bold hover:bg-black hover:text-white transition-all'
                           >

                              +

                           </button>

                        </div>

                     </div>

                     {/* TOTAL */}

                     <div className='mt-10 bg-[#f7f7f7] rounded-[30px] p-6 border border-gray-200'>

                        <div className='flex items-center justify-between'>

                           <h3 className='text-xl font-semibold text-black'>
                              Total Price
                           </h3>

                           <h2 className='text-4xl font-bold text-black'>

                              ₹
                              {finalPrice *
                                 quantity}

                           </h2>

                        </div>

                     </div>

                     {/* ACTIONS */}

                     <div className='mt-10 flex flex-col xl:flex-row gap-4'>

                        <Link
                           href={`/checkout/${encodeURIComponent(product.slug)}?qty=${encodeURIComponent(
                              String(quantity)
                           )}&variant=${encodeURIComponent(selectedVariant?.id || '')}`}
                           className='flex-1'
                        >

                           <button className='w-full bg-black text-white py-5 rounded-2xl font-semibold hover:bg-[#111] transition-all duration-200 text-lg'>

                              Buy Now

                           </button>

                        </Link>
                        <button
                         onClick={() =>
    isInCart
      ? removeFromCart(
          product.id,
          user,
          `${latitude},${longitude}`,
          JSON.stringify(deviceInfo)
        )
      : addToCart(
          product,
          user,
          `${latitude},${longitude}`,
          JSON.stringify(deviceInfo)
        )
  }
  disabled={product.stock <= 0}
  className='flex-1 bg-[#111] text-white py-5 rounded-2xl font-semibold hover:bg-black transition-all text-lg disabled:opacity-60'
>
  {product.stock <= 0
    ? 'Out of Stock'
    : isInCart
      ? 'In Cart'
      : 'Add To Cart'}
</button>

                      <button
  onClick={() =>
    isInWishlist
      ? removeFromWishList(
          product.id,
          user,
          `${latitude},${longitude}`,
          JSON.stringify(deviceInfo)
        )
      : addToWishList(
          product,
          user,
          `${latitude},${longitude}`,
          JSON.stringify(deviceInfo)
        )
  }
  className='flex-1 border border-black text-black py-5 rounded-2xl font-semibold hover:bg-black hover:text-white transition-all text-lg disabled:opacity-60'
>
  {isInWishlist ? 'Saved' : 'Add To Wishlist'}
</button>

                     </div>

                  </div>

               </div>

            </div>

            {/* DESCRIPTION */}

            <div className='mt-8'>

               <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                  <div className='mb-8'>

                     <h2 className='text-3xl font-bold text-black'>
                        Product Description
                     </h2>

                     <p className='text-gray-500 mt-2 text-lg'>
                        Detailed information about this product
                     </p>

                  </div>

                  <div className='prose prose-lg max-w-none text-gray-600 leading-relaxed'>

                     <p className='whitespace-pre-line leading-loose text-lg'>

                        {product.description}

                     </p>

                  </div>

               </div>

            </div>

            {/* SHIPPING + SELLER */}

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8'>

               <ProductShipping
                  product={product}
               />

               <ProductSeller
                  product={product}
               />

            </div>

            {/* REVIEWS */}

            <div className='mt-8'>

               <ProductReviews
                  product={product}
               />

            </div>

      </div>

   )

}

export default DetailedProductLayout