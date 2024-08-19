import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react'

export const useNasdaq = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<Error | null>(null);
    const queryClient = useQueryClient();   //access the client\

    const fetchStocks = async () => {
        setLoading(true);
        try {
            //리액트 쿼리로 가져오기
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${import.meta.env.VITE_ALPHAVANTAGE_API_KEY}`,
                { responseType: 'text' },
            )
            const textData = response.data;
            console.log(">> 가공전 데이터", textData);

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

            console.log(">> parsedData:", parsedData);
            const nasdaqStocks = parsedData.filter(
                (stock: any) => stock.exchange.trim() === "NASDAQ"
            );

            console.log(">> 나스닥 필터링 데이터:", nasdaqStocks);

            setData(nasdaqStocks);

        } catch (error) {
            setError(error as Error);
        }
        setLoading(false);
    }

    const query = useQuery({ queryKey: ['nasdaq'], queryFn: fetchStocks })

    useEffect(() => {
        fetchStocks();
    }, [])

    return { loading, data, error, query };
}

