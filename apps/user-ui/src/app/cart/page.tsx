'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useStore } from '../../store';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

type Product = {
id: string;
name: string;
price: number;
discountedPrice?: number;
quantity: number;
};


export default function CartPage() {
  const router = useRouter();

  const items = useStore((state) => state.cart);

  const removeFromCart = useStore(
    (state) => state.removeFromCart
  );

  const clearCart = useStore(
    (state) => state.clearCart
  );

  const updateCartQuantity = useStore(
    (state) => state.updateCartQuantity
  );

  const [selected, setSelected] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    if (!items.length) {
      setSelected({});
      return;
    }





    setSelected((prev) => {
      const next = { ...prev };

      for (const item of items) {
        if (next[item.id] === undefined) {
          next[item.id] = true;
        }
      }

      for (const id of Object.keys(next)) {
        if (!items.some((item) => item.id === id)) {
          delete next[id];
        }
      }

      return next;
    });
  }, [items]);

  const selectedItems = items.filter(
    (item) => selected[item.id]
  );

  useStore.setState({ selectedItems });

  const selectedTotals = selectedItems.reduce(
    (acc, item) => {
      const unit =
        item.discountedPrice ?? item.price;

      acc.quantity += item.quantity;

      acc.subtotal +=
        unit * item.quantity;

      return acc;
    },
    {
      quantity: 0,
      subtotal: 0,
    }
  );

  const allSelected =
    items.length > 0 &&
    selectedItems.length === items.length;


 


  return (
    <div className='min-h-screen bg-[#f6f7fb] py-10 px-6 text-black'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex items-end justify-between gap-4 mb-8'>
          <div>
            <h1 className='text-4xl font-bold'>
              Cart
            </h1>

            <p className='text-gray-500 mt-2'>
              Review items and update
              quantities.
            </p>
          </div>

          <button
            disabled={items.length === 0}
            onClick={clearCart}
            className='px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50'
          >
            Clear Cart
          </button>
        </div>

        {items.length === 0 ? (
          <div className='bg-white border border-gray-200 rounded-[24px] p-10 text-center'>
            <p className='text-gray-600'>
              Your cart is empty.
            </p>

            <Link
              href='/products'
              className='inline-block mt-4 px-5 py-3 rounded-2xl bg-black text-white'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='bg-white border border-gray-200 rounded-[24px] overflow-hidden'>
              <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
                <label className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    onChange={(e) => {
                      const checked =
                        e.target.checked;

                      const next: Record<
                        string,
                        boolean
                      > = {};

                      items.forEach((item) => {
                        next[item.id] =
                          checked;
                      });

                      setSelected(next);
                    }}
                  />

                  Select All
                </label>

                <div className='text-sm text-gray-500'>
                  Selected:{' '}
                  <span className='font-semibold text-black'>
                    {
                      selectedTotals.quantity
                    }
                  </span>
                </div>
              </div>

              <div className='divide-y divide-gray-200'>
                {items.map((item) => {
                  const unit =
                    item.discountedPrice ??
                    item.price;

                  const lineTotal =
                    unit * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className='p-5 flex flex-col sm:flex-row sm:items-center gap-4'
                    >
                      <input
                        type='checkbox'
                        checked={
                          !!selected[item.id]
                        }
                        onChange={(e) =>
                          setSelected(
                            (prev) => ({
                              ...prev,
                              [item.id]:
                                e.target.checked,
                            })
                          )
                        }
                      />

                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className='w-20 h-20 object-cover rounded-xl border'
                        />
                      )}

                      <div className='flex-1'>
                        <Link
                          href={`/products/${item.slug}`}
                          className='font-semibold hover:underline'
                        >
                          {item.name}
                        </Link>

                        <div className='text-sm text-gray-500 mt-1'>
                          ₹{unit}
                        </div>

                        <div className='text-xs text-gray-400'>
                          Stock:{' '}
                          {item.stock}
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              item.quantity -
                                1
                            )
                          }
                          className='w-10 h-10 rounded-xl border'
                        >
                          −
                        </button>

                        <div className='w-12 text-center font-semibold'>
                          {item.quantity}
                        </div>

                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              item.quantity +
                                1
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                          className='w-10 h-10 rounded-xl border disabled:opacity-50'
                        >
                          +
                        </button>
                      </div>

                      <div className='w-32 text-right font-bold'>
                        ₹{lineTotal}
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        className='px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50'
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='bg-white border border-gray-200 rounded-[24px] p-6 flex flex-col sm:flex-row justify-between gap-4'>
              <div>
                <div className='text-gray-600'>
                  Items:{' '}
                  <span className='font-semibold text-black'>
                    {
                      selectedTotals.quantity
                    }
                  </span>
                </div>

                <div className='text-xl font-bold mt-2'>
                  Subtotal: ₹
                  {
                    selectedTotals.subtotal
                  }
                </div>
              </div>

              <button
                disabled={
                  selectedItems.length === 0
                }
                onClick={() => {

                  router.push(
                    '/checkout/cart'
                  );
                }}
                className='px-5 py-3 rounded-2xl bg-black text-white disabled:opacity-50'
              >
                <Link href='/checkout/cart'>
                Proceed To Checkout
                </Link>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}