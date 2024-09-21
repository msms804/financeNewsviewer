import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { GithubBtn } from '../components/GithubBtn';

const errors = {
    "auth/email-already-in-use": "이미 존재하는 이메일입니다.",
}
const CreateAccount = () => {
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value }, } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || name === "" || email === "" || password === "") return;
        try {
            setLoading(true);
            // 1. 계정생성(계정생성 성공하면 바로 로그인)
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);

            // 2. 유저의 이름 설정
            await updateProfile(credentials.user, {
                displayName: name,
            })
            // 3. 홈페이지로 리다이렉트
            navigate('/');
        } catch (e) {//생성 실패하면 이리로 옴
            //setError
            if (e instanceof FirebaseError) {
                // setError(e.name);
                // console.log(e.code, e.name)
                setError(e.message)
            }
        } finally {//e1bff80fee4b5bdfa5ce51de96c27ef703eacbee
            setLoading(false);
        }
        console.log(name, email, password)
    }
    //firebase는 이름과 작은 아바타 url 가지는 미니프로필 갖게됨
    return (
        <>
            <div className='container mx-auto lg:px-16 flex flex-col items-center justify-center min-h-screen'>
                <form className="flex flex-col items-center justify-center space-y-4 w-full max-w-xs text-left" onSubmit={onSubmit}>
                    <h1 className='text-xl font-semibold w-full text-left mb-4'>회원가입</h1>
                    <input
                        name='name'
                        onChange={onChange}
                        value={name}
                        placeholder='이름'
                        type='text'
                        className='border border-gray-300 py-2 px-3 rounded-md text-sm w-full'
                        required
                    />
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
                        className='border border-gray-300 py-2 px-3 rounded-md mb-4 text-sm w-full'
                        required
                    />
                    <button
                        name='submit'
                        value={isLoading ? "Loading..." : "Create Account"}
                        className='bg-indigo-600 rounded-md p-2 text-sm text-white cursor-pointer hover:opacity-70 w-full'
                    >회원가입</button>

                </form>
                <div className='text-red-500 mt-4 text-xs'>
                    {error !== "" ? error : ""}
                </div>
                <span className='text-xs text-gray-600'>
                    계정이 있으신가요? {" "}
                    <Link to="/login" className='text-blue-500' >로그인페이지로 가기&rarr;</Link>
                </span>
                <GithubBtn />
            </div>
        </>
    )
}
export default CreateAccount;