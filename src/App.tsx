import { useCallback, useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { createBrowserRouter, RouterProvider, useRoutes } from 'react-router-dom';
import { NewsList } from './components/NewsList';
import { Navbar } from './layouts/Navbar';
import { Categories } from './components/Categories';
import { BottomNavbar } from './layouts/BottomNavbar';
import { Route, Routes } from 'react-router-dom';
import { Home } from './routes/Home';
import { News } from './routes/News';
import { My } from './routes/My';
import { LoadingScreen } from './components/LoadingScreen';
import { Layout } from './layouts/Layout';
import { Login } from './routes/Login';
import { CreateAccount } from './routes/CreateAccount';
import { auth } from './firebase';
import ProtectedRoute from './components/ProtectedRoute';
import { ForTest } from './components/ForTest';
import { Edit } from './routes/Edit';
import { NewsDetail } from './routes/NewsDetail';

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, [])

  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "news",
          element: <News />,
        },
        {
          path: "mypage",
          element: <ProtectedRoute>
            <My />
          </ProtectedRoute>,

        },
        {
          path: 'edit',
          element: <ProtectedRoute>
            <Edit />
          </ProtectedRoute>
        },
        {
          path: "mypage/news/:newsId",
          element: <ProtectedRoute>
            <NewsDetail />
          </ProtectedRoute>,
        },
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/create-account',
      element: <CreateAccount />
    },
    {
      path: '/nyt-test',
      element: <ForTest />
    }
  ];
  const routing = useRoutes(routes)
  return (

    <>
      <div className='container mx-auto lg:px-16'>

        {isLoading ? <LoadingScreen /> : routing}

      </div>
    </>
  )
}

export default App
