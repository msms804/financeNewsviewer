import axios from 'axios';
import React, { useEffect, useState } from 'react'

//https://blog.naver.com/silvury/221742806582
interface IStock {
    stockName: string;
    symbolCode: string;
}
export const Search = () => {
    const [stock, setStock] = useState<IStock>();
    useEffect(() => {//아.. 생각해보니까 이거 Edit에서 써야함..
        const fetchStock = async () => {
            //.. 이거 막혀잇네
            const response = await axios.get('https://api.stock.naver.com/stock/exchange/NASDAQ/marketValue');
            console.log(">>주식", response.data);
        }
        //fetchStock();
    }, [])

    return (
        <div>
            <input className='border border-gray-400 rounded-full text-xs px-2 py-1' placeholder='검색' />

        </div>
    )
}
