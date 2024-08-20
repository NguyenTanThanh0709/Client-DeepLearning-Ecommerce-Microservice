import React, { Suspense } from 'react'
import Navbar from 'src/pages/SellerPage/Components/Navbar'


interface Props {
  children?: React.ReactNode
}
export default function SellerLayout({ children }: Props) {
  return (
    <Suspense>
        <div className='flex '>
          <div className='w-2/12 '>
            <Navbar />
          </div>
          <div className='w-10/12 '>
            {children}
          </div>
        </div>
    </Suspense>
  )
}
