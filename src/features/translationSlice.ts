import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
//이미 번역된 텍스트는 다시 번역하지 않도록 캐싱

interface TranslationState {
    [englishText: string]: string;
}
const initialState: TranslationState = {};
const translationSlice = createSlice({
    name: 'translation',
    initialState,
    reducers: {
        cacheTranslation: (state, action: PayloadAction<any>) => {
            const { englishText, koreanText } = action.payload;
            state[englishText] = koreanText;//이거 인덱스에 뉴스 id로 바꾸고싶은데
        }
    }
})

export const { cacheTranslation } = translationSlice.actions;
export default translationSlice.reducer;
