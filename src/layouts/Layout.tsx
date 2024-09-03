import React from 'react'
import { Navbar } from './Navbar'
import { Outlet } from 'react-router-dom'
import { BottomNavbar } from './BottomNavbar'

export const Layout = () => {
    return (
        <div className='h-screen dark:bg-gray-800 dark:text-gray-300 container mx-auto px-4'>
            <Navbar />
            <Outlet />
            {/* <BottomNavbar /> */}
        </div>
    )
}
