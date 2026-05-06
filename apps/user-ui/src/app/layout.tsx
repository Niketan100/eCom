import { Header } from '../shared/widget';
import './global.css'
import {Roboto, Poppins} from 'next/font/google'

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
    <html lang="en">
      <Header />
      <body 
        className={`${roboto.variable} ${poppins.variable}`} 
      >{children}</body>
    </html>
  )
}
