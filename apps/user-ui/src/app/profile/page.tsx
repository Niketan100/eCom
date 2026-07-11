'use client';

import React from 'react';
import PageShell from 'apps/user-ui/src/shared/components/PageShell';
import useUser from '../../hooks/useUSer';

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className='bg-white rounded-3xl border p-6'>
    <p className='text-sm text-gray-500'>{title}</p>
    <h3 className='text-3xl font-bold mt-2'>{value}</h3>
  </div>
);

export default function Page() {
  const { loggedInUser, isLoading } = useUser();
  console.log(loggedInUser);


  const [activeTab, setActiveTab] =
    React.useState('overview');

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <PageShell>
      <div className='max-w-7xl mx-auto py-10'>

        {/* PROFILE HEADER */}

        <div className='bg-white border rounded-[32px] p-8 mb-8'>
          <div className='flex flex-col md:flex-row gap-6 items-center'>

         
            <div className='flex-1 text-center md:text-left'>
              <h1 className='text-4xl font-bold'>
                {loggedInUser?.name}
              </h1>

              <p className='text-gray-500 mt-2'>
                {loggedInUser?.email}
              </p>

              <p className='text-gray-500'>
                {loggedInUser?.phone ||
                  'No phone number added'}
              </p>
            </div>

            <button className='bg-black text-white px-6 py-3 rounded-2xl'>
              Edit Profile
            </button>

          </div>
        </div>

        {/* STATS */}

        <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mb-8'>
          <StatCard
            title='Orders'
            value='0'
          />

          <StatCard
            title='Addresses'
            value='0'
          />

          <StatCard
            title='Wallet'
            value='₹0'
          />

          <StatCard
            title='Wishlist'
            value='0'
          />
        </div>

        {/* MAIN CONTENT */}

        <div className='grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8'>

          {/* SIDEBAR */}

          <div className='bg-white border rounded-[32px] p-4 h-fit'>

            {[
              'overview',
              'orders',
              'addresses',
              'wallet',
              'security',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 capitalize transition ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}

          </div>

          {/* CONTENT */}

          <div>

            {activeTab === 'overview' && (
              <div className='space-y-6'>

                <div className='bg-white border rounded-[32px] p-6'>
                  <h2 className='text-2xl font-bold mb-4'>
                    Personal Information
                  </h2>

                  <div className='grid md:grid-cols-2 gap-4'>

                    <div>
                      <p className='text-gray-500'>
                        Full Name
                      </p>

                      <p className='font-medium'>
                        {loggedInUser?.name}
                      </p>
                    </div>

                    <div>
                      <p className='text-gray-500'>
                        Email
                      </p>

                      <p className='font-medium'>
                        {loggedInUser?.email}
                      </p>
                    </div>

                  </div>
                </div>

                <div className='bg-white border rounded-[32px] p-6'>
                  <h2 className='text-2xl font-bold mb-4'>
                    Quick Actions
                  </h2>

                  <div className='flex flex-wrap gap-4'>

                    <button className='border px-5 py-3 rounded-xl'>
                      Add Address
                    </button>

                    <button className='border px-5 py-3 rounded-xl'>
                      View Orders
                    </button>

                    <button className='border px-5 py-3 rounded-xl'>
                      Manage Wallet
                    </button>

                  </div>
                </div>

              </div>
            )}

            {activeTab === 'orders' && (
              <div className='bg-white border rounded-[32px] p-6'>
                <h2 className='text-2xl font-bold mb-4'>
                  Orders
                </h2>

                <div className='text-gray-500'>
                  No orders found.
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className='bg-white border rounded-[32px] p-6'>

                <div className='flex items-center justify-between mb-6'>

                  <h2 className='text-2xl font-bold'>
                    Addresses
                  </h2>

                  <button className='bg-black text-white px-4 py-2 rounded-xl'>
                    Add Address
                  </button>

                </div>

                <div className='border rounded-2xl p-4'>
                  <p className='font-semibold'>
                    No address added
                  </p>
                </div>

              </div>
            )}

            {activeTab === 'wallet' && (
              <div className='bg-white border rounded-[32px] p-6'>

                <h2 className='text-2xl font-bold mb-4'>
                  Wallet
                </h2>

                <h3 className='text-5xl font-bold'>
                  ₹0
                </h3>

                <button className='mt-6 bg-black text-white px-6 py-3 rounded-xl'>
                  Add Money
                </button>

              </div>
            )}

            {activeTab === 'security' && (
              <div className='bg-white border rounded-[32px] p-6'>

                <h2 className='text-2xl font-bold mb-6'>
                  Security
                </h2>

                <div className='flex flex-wrap gap-4'>

                  <button className='border px-5 py-3 rounded-xl'>
                    Change Password
                  </button>

                  <button className='border px-5 py-3 rounded-xl'>
                    Enable 2FA
                  </button>

                  <button className='border px-5 py-3 rounded-xl text-red-500'>
                    Logout
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </PageShell>
  );
}