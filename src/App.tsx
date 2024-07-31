import { useCallback, useState } from 'react'
import './App.css'
import axios from 'axios';
import { NewsList } from './components/NewsList';
import { Navbar } from './layouts/Navbar';
import { Categories } from './components/Categories';
import { BottomNavbar } from './layouts/BottomNavbar';

function App() {
  const [category, setCategory] = useState<string>('all');
  const onSelect = useCallback((category: string) => {
    setCategory(category)
    console.log('카테고리', category);
  }, [])
  return (
    <>
      <div className='container mx-auto lg:px-16'>
        <Navbar />
        <Categories onSelect={onSelect} category={category} />
        <NewsList category={category} />
        <BottomNavbar />
      </div>
    </>
  )
}

export default App
