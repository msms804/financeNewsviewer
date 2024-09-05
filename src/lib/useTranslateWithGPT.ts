import { useDispatch, useSelector } from "react-redux";
import { cacheTranslation } from "../features/translationSlice";

export const useTranslateWithGPT = (englishText: string) => {
    const dispatch = useDispatch();
    const cachedTranslation = useSelector((state: any) => state.translation[englishText]);

    const translateWithGPT = async (englishText: string) => {
        // 캐시된 번역이 있는지 확인
        if (cachedTranslation) {
            return cachedTranslation;
        }

        // GPT 호출
        console.log(">>Call GPT");
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
                    "content": `Translate the following text to Korean: ${englishText}`
                }],
                temperature: 0.7,
                max_tokens: 1000,
            })
        });

        const responseData = await response.json();
        const message = responseData.choices[0].message.content;

        // 번역 결과 캐싱
        dispatch(cacheTranslation({ englishText, koreanText: message }));
        return message;
    };

    return translateWithGPT;
};