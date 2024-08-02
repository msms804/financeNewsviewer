import React from 'react'
import { useState } from 'react';

export const Login = () => {
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value }, } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = () => {

    }
    return (
        <div>
            <div className='container mx-auto lg:px-16 flex flex-col items-center justify-center min-h-screen'>
                <form className="flex flex-col items-center justify-center space-y-4 w-full max-w-xs text-left" onSubmit={onSubmit}>
                    <h1 className='text-xl font-semibold w-full text-left mb-4'>로그인</h1>

                    <input
                        name='email'
                        onChange={onChange}
                        value={email}
                        placeholder='이메일'
                        type='email'
                        className='border border-gray-300 py-2 px-3 rounded-md text-sm w-full'
                        required
                    />
                    <input
                        name='password'
                        onChange={onChange}
                        value={password}
                        placeholder='비밀번호'
                        type='password'
                        className='border border-gray-300 py-2 px-3 rounded-md text-sm w-full'
                        required
                    />
                    <button
                        name='submit'
                        value={isLoading ? "Loading..." : "Create Account"}
                        className='bg-indigo-600 rounded-md p-2 text-sm text-white cursor-pointer hover:opacity-70 w-full'
                    >로그인
                    </button>

                </form>
                <div className='text-red-500 mt-4 text-xs'>
                    {error !== "" ? error : "에러없음"}
                </div>
            </div>
        </div>
    )
}
