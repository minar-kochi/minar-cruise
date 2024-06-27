import { db } from '@/db'
import { getPackageNavigation } from '@/db/data/dto/package'
import Link from 'next/link'
import React from 'react'

const PackagesNavList = async () => {
  const data = await getPackageNavigation();

  return (
    <div className='relative'>
        <h1>hello</h1>
        <div className='absolute flex flex-col  border-2 w-[300px]'>
        {data.map(item => {
            return <Link href={item.slug} className='w-full border-2' key={item.id}>{item.title}</Link>
        })}
        </div>
    </div>
  )
}

export default PackagesNavList