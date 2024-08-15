import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCallGPT } from '../lib/useCallGPT';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useStockInfoFetcher } from '../lib/useStockInfoFetcher';

interface IStock {
    symbol: string;
    name: string;
    exchange: string;
}


//gpt 테스트
const englishText = "Three Days That Rocked Japan's Markets The fragility of a more-than-yearlong stock rally in Japan, fueled in part by a weak yen, has been exposed by the sudden strengthening of the currency."

export const ForTest = () => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [stocks, setStocks] = useState<IStock[] | null>(null);
    //const [error, setError] = useState();
    const [stocksText, setStocksText] = useState();
    const [englishName, setEnglishName] = useState<string | "">("");
    const [symbol, setSymbol] = useState<string | "">("");

    useEffect(() => { //여기도 에러처리 해야하나?
        const fetchInfo = async () => {
            const stockInfo = await useStockInfoFetcher("일라이릴리");
            setEnglishName(stockInfo.englishName);
            setSymbol(stockInfo.stockSymbol);
        }
        fetchInfo();
    }, [])

    const handleClickGPTCall = async () => {
        try {
            setIsLoading(true);
            const msg = await useCallGPT(englishText);
            setMessage(msg)
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }
    // const fetchNasdaqStocks = async () => {
    //     try {
    //         const response = await axios.get(`https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${import.meta.env.VITE_ALPHAVANTAGE_API_KEY}`)
    //         console.log(response.data);






    //     } catch (error) {

    //     }
    // }
    const fetchNasdaqStocks = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${import.meta.env.VITE_ALPHAVANTAGE_API_KEY}`,
                { responseType: 'text' } // CSV 데이터를 텍스트로 받아오기 위해 설정
            );

            const textData = response.data;
            console.log(">>textData: ", textData)
            setStocksText(textData);
            const parsedData = textData
                .split("\n")
                .slice(1)
                .filter((line: any) => line.trim() !== "")  // 빈 줄 필터링
                .map((line: any) => {
                    const columns = line.split(",");
                    const symbol = columns[0];
                    const name = columns[1];
                    const exchange = columns[2];  // 수정된 열 참조
                    return { symbol, name, exchange };
                });

            console.log(">>parsedData:", parsedData);
            const nasdaqStocks = parsedData.filter(
                (stock: any) => stock.exchange.trim() === "NASDAQ"
            );

            console.log(">>nasdaqStocks:", nasdaqStocks);


            setStocks(nasdaqStocks);
        } catch (err: any) {
            //setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    const saveInDB2 = async () => {
        try {
            if (stocksText) {
                await addDoc(collection(db, 'stocksText'), {
                    stocks: stocksText,
                })
            }
            console.log(">> 두번째 저장성공!")
        } catch (error) {
            console.log(">> 두번째 저장 실패ㅠㅠ", error)
        }
    }

    useEffect(() => {
        console.log(">>stocks:", stocks)
    }, [stocks])
    return (
        <>
            {/* <button onClick={handleClickGPTCall}>GPT API call</button> */}

            <button onClick={fetchNasdaqStocks}>fetch nasdaqStocks</button>
            {/* <div>{isLoading ? "로딩중..." : message}</div> */}
            {/* {stocks && stocks.length > 0 && <button onClick={saveInDB}
                className='bg-blue-300 rounded-lg p-2'
            >firebase에 저장</button>} */}
            {/* <button onClick={() => { useStockInfoFetcher("테슬라") }}>새로운 테스트</button> */}
            {stocksText && <button onClick={saveInDB2}>text로 저장</button>}
            {/* {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <ul>
                            {stocks?.map((stock, index) => (
                                <li key={index}>
                                    {stock.symbol}: {stock.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}         */}
            {/* <div>isLoading : {isLoading ? "loading..." : "fin"}</div> */}
            <div>
                티커 : {symbol}
            </div>
            <div>
                영어이름 : {englishName}
            </div>
        </>
    );
}
