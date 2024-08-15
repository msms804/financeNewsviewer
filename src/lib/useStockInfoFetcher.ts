import axios from "axios";

export const useStockInfoFetcher = async (companyName: string) => {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [{
                "role": "user",
                "content": `The Korean company name "${companyName}" refers to. Please provide the English name and stock symbol in JSON format as follows: {"english_name": "<English Name>", "stock_symbol": "<Stock Symbol>"}.`
            }],

            temperature: 0.3,
            max_tokens: 100,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
            }

        });
        // 응답 데이터에서 content 추출
        const result = response.data.choices[0].message.content;
        console.log("Original result:", result);

        // 불필요한 문자 제거 (예: Markdown 코드 블록)
        // Assuming result starts with '```json' and ends with '```'
        const jsonString = result.replace(/```json|```/g, '').trim();

        // 응답을 JSON으로 파싱
        const parsedResult = JSON.parse(jsonString);
        const englishName = parsedResult.english_name;
        const stockSymbol = parsedResult.stock_symbol;


        console.log(`English Name: ${englishName}`);
        console.log(`Stock Symbol: ${stockSymbol}`);

        return { englishName, stockSymbol };
    } catch (err) {
        console.log("error fetching data from GPT API", err)
        throw err;
    }

}




