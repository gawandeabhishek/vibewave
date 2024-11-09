import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className='flex items-center justify-center min-h-[85vh]'>{ children }</div>
  )
}

export default Layout