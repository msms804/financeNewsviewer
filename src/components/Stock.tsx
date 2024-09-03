import React, { useEffect, useState } from 'react'

import { IStock } from '../routes/Edit'
import { auth, db } from '../firebase'
import { deleteDoc, doc } from 'firebase/firestore';
import { Favicon } from './Favicon';

export const Stock = ({ name, userId, id, englishName, symbol }: IStock) => {
    const user = auth.currentUser;
    const [domain, setDomain] = useState('');

    const onDelete = async () => {//로딩중 같은거 넣어보기
        const ok = confirm("삭제하시겠습니까?");
        if (!ok || user?.uid !== userId) return null;
        try {
            await deleteDoc(doc(db, "myStocks", id));
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    //englishName을 도메인으로 가공하기
    useEffect(() => {
        const newName = englishName.split(' ')[0].replace(",", "");
        setDomain(newName + ".com");
    }, [englishName]);

    return (
        <div className='flex flex-row justify-between mb-2'>
            <div className='flex flex-row items-center justify-center gap-2'>
                <Favicon domain={domain} />
                <div className='flex flex-col'>

                    <div className='text-sm text-gray-800 font-semibold'>{symbol}</div>
                    <div className='text-xs text-gray-700'>{englishName}</div>
                </div>
            </div>

            <button
                className='bg-red-100 text-red-500 px-2 py-1 rounded-lg text-xs cursor-pointer'
                onClick={onDelete}
            >삭제</button>
        </div>
    )
}
