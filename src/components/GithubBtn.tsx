import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export const GithubBtn = () => {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <span onClick={onClick}
            className='flex items-center justify-center cursor-pointer bg-white font-medium py-1 px-2 mt-4 gap-2 border  border-gray-400 text-xs rounded-md'>
            <img src='/github-logo.svg' className='w-6 h-6' />
            Github으로 계속하기
        </span>
    )
}
