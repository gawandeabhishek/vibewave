import Link from 'next/link'
import React from 'react'


const Footer = () => {
  return <span className="flex items-center">build using&nbsp;<Link href={`${process.env.API_URL}`} target="_blank" className="text-blue-500"> saavn.dev</Link></span>
}

export default Footer