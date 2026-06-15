'use client';

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { useStore } from 'apps/user-ui/src/store';

type Product = {
id: string;
name: string;
price: number;
discountedPrice?: number;
quantity: number;
};

type Props = {
  items: Product[];
};

export default function CheckoutPage() {
const items = useStore((state) => state.selectedItems);

const [address, setAddress] =
React.useState('');

const total = items.reduce(
(sum, item) =>
sum +
(
item.discountedPrice ??
item.price
) * item.quantity,
0
);

const {
mutate: placeOrder,
isPending,
} = useMutation({
mutationFn: async () => {


  return axiosInstance.post(
    '/products/cart/placeOrder',
    {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),

      address,
    }
  );
},

onSuccess: () => {
  alert(
    'Order placed successfully'
  );
},
});

return ( <div className='max-w-6xl mx-auto py-10'>


  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

    <div className='bg-white p-6 rounded-3xl border'>

      <h2 className='text-2xl font-bold mb-6'>
        Delivery Address
      </h2>

      <textarea
        value={address}
        onChange={(e) =>
          setAddress(e.target.value)
        }
        placeholder='Enter full address'
        className='w-full h-40 border rounded-2xl p-4'
      />

      <div className='mt-6'>

        <h3 className='font-semibold mb-3'>
          Payment Method
        </h3>

        <div className='border rounded-2xl p-4'>
          Cash On Delivery (COD)
        </div>

      </div>

    </div>

    <div className='bg-white p-6 rounded-3xl border'>

      <h2 className='text-2xl font-bold mb-6'>
        Order Summary
      </h2>

      <div className='space-y-4'>

        {items.map(item => {

          const price =
            item.discountedPrice ??
            item.price;

          return (
            <div
              key={item.id}
              className='flex justify-between'
            >
              <div>
                <div>
                  {item.name}
                </div>

                <div className='text-sm text-gray-500'>
                  Qty:
                  {' '}
                  {item.quantity}
                </div>
              </div>

              <div>
                ₹
                {price *
                  item.quantity}
              </div>
            </div>
          );
        })}

      </div>

      <div className='border-t mt-6 pt-6'>

        <div className='flex justify-between font-bold text-2xl'>
          <span>Total</span>
          <span>₹{total}</span>
        </div>

      </div>

      <button
        onClick={() =>
          placeOrder()
        }
        disabled={
          !address ||
          isPending
        }
        className='w-full mt-6 bg-black text-white py-4 rounded-2xl'
      >
        {isPending
          ? 'Placing Order...'
          : 'Place Order'}
      </button>

    </div>

  </div>

</div>


);
}


