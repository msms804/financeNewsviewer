import React from 'react'
import { useState, useCallback } from 'react'
import { Categories } from '../components/Categories'
import { NewsList } from '../components/NewsList'
import { Notice } from '../components/Notice'
const Home = () => {
    const [category, setCategory] = useState<string>('Business');
    const onSelect = useCallback((category: string) => {
        setCategory(category)
        console.log('카테고리', category);
    }, [])
    return (
        <div>
            <div className='flex flex-row items-center justify-between'>
                <Categories onSelect={onSelect} category={category} />
                <Notice />
            </div>
            <NewsList category={category} />

        </div>
    )
}
export default Home;