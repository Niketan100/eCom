import { Header } from '../shared/widget';
import './global.css'
import {Roboto, Poppins} from 'next/font/google'
import Providers from './providers'
import Footer from '../shared/Footer';

export const metadata = {
  title: 'Eshop',
  description: 'Eshop Ecommerce Application',
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100' , '300' ,'400', '500', '700'],
  variable: '--font-roboto',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100' , '200' ,'300' ,'400', '500', '700', '800', '900'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <Providers>
    <html lang="en">
      
      <Header />
     
        <body className={`${roboto.variable} ${poppins.variable} bg-[#f6f7fb]`}>
          {/* Global premium wallpaper */}
          <div className='relative min-h-screen overflow-hidden'>
            <div className='pointer-events-none absolute inset-0'>
              <div className='absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(236,72,153,0.11),transparent_55%),radial-gradient(900px_circle_at_50%_90%,rgba(16,185,129,0.11),transparent_55%)]' />
              <div className='absolute inset-0 bg-gradient-to-b from-white/65 via-white/35 to-[#f6f7fb]' />
              <div className='absolute -top-28 -left-40 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl' />
              <div className='absolute -top-48 -right-40 h-[580px] w-[580px] rounded-full bg-pink-500/10 blur-3xl' />
              <div className='absolute -bottom-52 left-1/2 -translate-x-1/2 h-[720px] w-[720px] rounded-full bg-emerald-500/10 blur-3xl' />
            </div>

            {/* Content */}
            <div className='relative'>
              {children}
            </div>
          </div>
        </body>
        <Footer />
    </html>
      </Providers>
  )
}
