import Link from 'next/link'
import React from 'react'

const categories = [
  {
    title: 'Electronics',
    subtitle: 'Phones, laptops & more',
    href: '/products',
    accent: 'from-blue-600/20 via-sky-500/10 to-transparent',
  },
  {
    title: 'Fashion',
    subtitle: 'Daily wear to premium',
    href: '/products',
    accent: 'from-pink-600/15 via-rose-500/10 to-transparent',
  },
  {
    title: 'Home & Living',
    subtitle: 'Make your space feel new',
    href: '/products',
    accent: 'from-emerald-600/15 via-teal-500/10 to-transparent',
  },
  {
    title: 'Beauty',
    subtitle: 'Self‑care essentials',
    href: '/products',
    accent: 'from-violet-600/15 via-fuchsia-500/10 to-transparent',
  },
]

const perks = [
  {
    title: 'Fast delivery',
    desc: 'Reliable shipping with tracking.',
  },
  {
    title: 'Secure payments',
    desc: 'Multiple options with safe checkout.',
  },
  {
    title: 'Premium support',
    desc: 'Quick help when you need it.',
  },
]

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      {/* HERO */}
      <section className='relative overflow-hidden'>
        <div className='relative'>
          <div className='w-[90%] md:w-[80%] mx-auto pt-12 md:pt-16 pb-12'>
            <div className='grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center'>
              {/* Copy */}
              <div className='motion-safe:animate-[fadeInUp_0.8s_ease-out]'>
                <div className='inline-flex items-center gap-2 rounded-full bg-white/70 border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-sm'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500' />
                  Premium shopping experience
                </div>

                <h1 className='mt-6 text-[42px] md:text-[56px] leading-[1.05] font-extrabold text-gray-900'>
                  Discover products that feel
                  <span className='block bg-gradient-to-r from-[black] via-[#F97316] to-emerald-500 bg-clip-text text-transparent'>
                    truly premium.
                  </span>
                </h1>

                <p className='mt-5 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl'>
                  Curated picks, smooth checkout, and a clean interface that makes buying feel effortless.
                </p>

                <div className='mt-8 flex flex-col sm:flex-row gap-4'>
                  <Link
                    href='/products'
                    className='inline-flex items-center justify-center rounded-2xl bg-black text-white px-6 py-4 font-semibold shadow-sm hover:bg-[#111] transition-all duration-200'
                  >
                    Explore Products
                  </Link>

                  <Link
                    href='/become-seller'
                    className='inline-flex items-center justify-center rounded-2xl bg-white/70 border border-gray-200 text-gray-900 px-6 py-4 font-semibold shadow-sm hover:bg-white transition-all duration-200'
                  >
                    Become a Seller
                  </Link>
                </div>

                {/* Perks */}
                <div className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  {perks.map((p) => (
                    <div
                      key={p.title}
                      className='rounded-3xl bg-white/70 border border-gray-200 p-5 shadow-sm'
                    >
                      <p className='font-semibold text-gray-900'>
                        {p.title}
                      </p>
                      <p className='text-sm text-gray-600 mt-2'>
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Showcase */}
              <div className='relative motion-safe:animate-[fadeIn_0.9s_ease-out] lg:justify-self-end'>
                <div className='rounded-[42px] border border-gray-200 bg-white/70 shadow-sm p-6'>
                  <div className='rounded-[32px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 relative'>
                    <div className='absolute inset-0 opacity-25 bg-[radial-gradient(900px_circle_at_0%_0%,rgba(59,130,246,0.9),transparent_50%),radial-gradient(900px_circle_at_100%_0%,rgba(236,72,153,0.75),transparent_50%)]' />
                    <div className='relative'>
                      <p className='text-sm text-white/70'>Today’s highlight</p>
                      <h2 className='mt-2 text-3xl font-bold'>Smart picks for smart buyers</h2>
                      <p className='mt-3 text-white/75 leading-relaxed'>
                        Browse trending items, best deals, and new launches—all in one place.
                      </p>

                      <div className='mt-7 grid grid-cols-3 gap-3'>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className='aspect-square rounded-2xl bg-white/10 border border-white/10'
                          />
                        ))}
                      </div>

                      <div className='mt-8 flex items-center justify-between'>
                        <div>
                          <p className='text-sm text-white/70'>Starting from</p>
                          <p className='text-2xl font-semibold'>₹999</p>
                        </div>
                        <Link
                          href='/products'
                          className='inline-flex items-center justify-center rounded-2xl bg-white text-black px-5 py-3 font-semibold hover:bg-white/90 transition-all duration-200'
                        >
                          Shop now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='hidden lg:block absolute -bottom-6 -left-6 w-40 h-40 rounded-[36px] bg-white/70 border border-gray-200 shadow-sm' />
                <div className='hidden lg:block absolute -top-8 -right-8 w-28 h-28 rounded-[30px] bg-white/70 border border-gray-200 shadow-sm' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className='w-[90%] md:w-[80%] mx-auto pb-14'>
        <div className='flex items-end justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>
              Shop by category
            </h2>
            <p className='text-gray-600 mt-2'>
              Start fast with curated departments.
            </p>
          </div>
          <Link
            href='/products'
            className='hidden sm:inline-flex text-sm font-semibold text-gray-900 hover:underline'
          >
            View all →
          </Link>
        </div>

        <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {categories.map((c) => (
            <Link
              href={`${c.href}?category=${encodeURIComponent(c.title)}`}
              key={c.title}
              className='group relative overflow-hidden rounded-[32px] bg-white border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200'
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.accent}`} />
              <div className='relative'>
                <p className='text-sm text-gray-600'>{c.subtitle}</p>
                <h3 className='mt-2 text-2xl font-bold text-gray-900'>
                  {c.title}
                </h3>
                <div className='mt-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                  Browse
                  <span className='transition-transform duration-200 group-hover:translate-x-1'>
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}