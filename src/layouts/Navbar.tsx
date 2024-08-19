import React from 'react'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const navigate = useNavigate();

    const logOut = async () => {
        const ok = confirm('로그아웃 하시겠습니까?')
        if (ok) {
            await auth.signOut();
            navigate('/');
        }
    }

    return (
        <div className='flex flex-row mt-3 mb-3 items-center justify-between'>
            <div className='flex flex-row text-base gap-6'>
                <Link to='/'>
                    <div className='font-semibold'>
                        MINVEST
                    </div>
                </Link>
                <Link to='/mypage'>
                    맞춤
                </Link>
            </div>
            <div className='flex flex-row space-x-3'>

                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>

                </div>
                <button onClick={logOut} className='bg-indigo-600 text-white text-xs p-2 rounded-md'>
                    로그아웃
                </button>
            </div>
        </div>
    )
}
