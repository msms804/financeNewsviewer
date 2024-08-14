import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

const stockInfoSchema = z.object({
    english_name: z.string(),
    stock_symbol: z.string(),
})
export const useStockInfoFetcher = (companyName: string) => {
    const [stockInfo, setStockInfo] = useState<null | { english_name: string; stock_symbol: string }>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStockInfo = async () => {
            try {
                const response = await axios.post("https://api.openai.com/v1/chat/completions", {
                    model: "gpt-4o-mini",
                    messages: [{
                        "role": "user",
                        "content": `Given the Korean company name "${companyName}", please provide its English name and its stock symbol.`
                    }],
                    temperature: 0.7,
                    max_tokens: 1000,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
                    }
                });
                //응답 데이터에서 content 추출
                const result = response.data.choices[0].message.content;

                //응답을 JSON으로 파싱
                const parsedResult = JSON.parse(result);

                // Zod를 사용하여 응답 검증
                const validatedResult = stockInfoSchema.parse(parsedResult);

                console.log("아 힘드러", validatedResult);
                setStockInfo(validatedResult);
                return result;
            } catch (err) {
                console.log("error fetching data from GPT API", error)
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        if (companyName) fetchStockInfo();

    }, [companyName])

    return { stockInfo, loading, error };

} 