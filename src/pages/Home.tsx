import React from 'react'
import { useState, useCallback } from 'react'
import { Categories } from '../components/Categories'
import { NewsList } from '../components/NewsList'
export const Home = () => {
    const [category, setCategory] = useState<string>('all');
    const onSelect = useCallback((category: string) => {
        setCategory(category)
        console.log('카테고리', category);
    }, [])
    return (
        <div>
            <Categories onSelect={onSelect} category={category} />
            <NewsList category={category} />

        </div>
    )
}
