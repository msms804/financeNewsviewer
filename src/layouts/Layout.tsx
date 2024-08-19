import React from 'react'
import { Navbar } from './Navbar'
import { Outlet } from 'react-router-dom'
import { BottomNavbar } from './BottomNavbar'

export const Layout = () => {
    return (
        <div className='container mx-auto px-4'>
            <Navbar />
            <Outlet />
            {/* <BottomNavbar /> */}
        </div>
    )
}
