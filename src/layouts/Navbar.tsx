import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const navigate = useNavigate();
    const [darkmode, setDarkMode] = useState(false);

    const logOut = async () => {
        const ok = confirm('로그아웃 하시겠습니까?')
        if (ok) {
            await auth.signOut();
            navigate('/');
        }
    }

    const toggleDarkMode = () => {//다크모드 활성화 or 비활성화
        setDarkMode(prev => !prev);
    }
    useEffect(() => {//초기설정
        if (darkmode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
        console.log(">> 다크모드", darkmode);
    }, [darkmode])
    return (
        <div className=' bg-white dark:bg-gray-800 dark:text-white flex flex-row mt-3 mb-3 items-center justify-between'>
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

                <div onClick={toggleDarkMode} className='cursor-pointer'>
                    {darkmode
                        ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <desc>light mode</desc>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12.6666 4.66663C12.6666 4.29846 12.3682 4 12 4C11.6318 4 11.3334 4.29846 11.3334 4.66663V5.48145C11.3334 5.84961 11.6318 6.14807 12 6.14807C12.3682 6.14807 12.6666 5.84961 12.6666 5.48145V4.66663ZM7.25653 6.31378C6.9962 6.05345 6.57411 6.05345 6.31378 6.31378C6.05345 6.57411 6.05345 6.9962 6.31378 7.25653L6.88415 7.82691C7.14449 8.08724 7.56657 8.08724 7.82691 7.82691C8.08724 7.56657 8.08724 7.14449 7.82691 6.88415L7.25653 6.31378ZM17.6862 7.25653C17.9466 6.9962 17.9466 6.57411 17.6862 6.31378C17.4259 6.05345 17.0038 6.05345 16.7435 6.31378L16.1731 6.88416C15.9128 7.14449 15.9128 7.56657 16.1731 7.82691C16.4334 8.08724 16.8555 8.08724 17.1158 7.82691L17.6862 7.25653ZM4.66663 11.3334C4.29846 11.3334 4 11.6318 4 12C4 12.3682 4.29846 12.6666 4.66663 12.6666H5.48145C5.84961 12.6666 6.14807 12.3682 6.14807 12C6.14807 11.6318 5.84961 11.3334 5.48145 11.3334H4.66663ZM18.5186 11.3334C18.1504 11.3334 17.8519 11.6318 17.8519 12C17.8519 12.3682 18.1504 12.6666 18.5186 12.6666H19.3334C19.7015 12.6666 20 12.3682 20 12C20 11.6318 19.7015 11.3334 19.3334 11.3334H18.5186ZM7.82691 17.1158C8.08724 16.8555 8.08724 16.4334 7.82691 16.1731C7.56657 15.9128 7.14449 15.9128 6.88416 16.1731L6.31378 16.7435C6.05345 17.0038 6.05345 17.4259 6.31378 17.6862C6.57411 17.9466 6.9962 17.9466 7.25653 17.6862L7.82691 17.1158ZM17.1158 16.1731C16.8555 15.9128 16.4334 15.9128 16.1731 16.1731C15.9128 16.4334 15.9128 16.8555 16.1731 17.1158L16.7435 17.6862C17.0038 17.9466 17.4259 17.9466 17.6862 17.6862C17.9466 17.4259 17.9466 17.0038 17.6862 16.7435L17.1158 16.1731ZM12.6666 18.5186C12.6666 18.1504 12.3682 17.8519 12 17.8519C11.6318 17.8519 11.3334 18.1504 11.3334 18.5186V19.3334C11.3334 19.7015 11.6318 20 12 20C12.3682 20 12.6666 19.7015 12.6666 19.3334V18.5186ZM9.14596 12.0006C9.14596 10.424 10.424 9.14596 12.0006 9.14596C13.5772 9.14596 14.8553 10.424 14.8553 12.0006C14.8553 13.5772 13.5772 14.8553 12.0006 14.8553C10.424 14.8553 9.14596 13.5772 9.14596 12.0006ZM12.0006 7.81271C9.6877 7.81271 7.81271 9.6877 7.81271 12.0006C7.81271 14.3135 9.6877 16.1885 12.0006 16.1885C14.3135 16.1885 16.1885 14.3135 16.1885 12.0006C16.1885 9.6877 14.3135 7.81271 12.0006 7.81271Z" fill="#FFFFFF">
                            </path>
                        </svg>

                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>

                    }

                </div>
                <button onClick={logOut} className='bg-indigo-600 text-white text-xs p-2 rounded-md'>
                    로그아웃
                </button>
            </div>
        </div>
    )
}
