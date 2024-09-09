import { useDispatch, useSelector } from "react-redux";


export const useAnalyzeWithGPT = () => {

    const analyzeWithGPT = async (article: string) => {
        console.log("gpt가 분석중 ...")
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    "role": "user",
                    "content": `다음 뉴스 기사를 분석하고, 이 기사가 주식 시장에 미치는 영향을 고려하여 전반적으로 호재인지 악재인지 판단해 주세요. 
                    호재로 판단되면 '호재', 악재로 판단되면 '악재'라고 간단히 답변해 주세요. 
                    뉴스 기사: ${article}`
                }],
                temperature: 0.7,
                max_tokens: 1000,
            })

        })

        const responseData = await response.json();
        const message = responseData.choices[0].message.content;

        return message;
    }
    return analyzeWithGPT;
}
