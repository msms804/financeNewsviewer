import React from 'react'

export const useCallGPT = async (englishText: string) => {
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

    })

    const responseData = await response.json();
    const message = responseData.choices[0].message.content;

    return message;
}
