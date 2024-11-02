import { useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom';
import Home from './routes/Home';
import { LoadingScreen } from './components/LoadingScreen';
import Layout from './layouts/Layout';
import { auth } from './firebase';
import ProtectedRoute from './components/ProtectedRoute';

//lazy로 필요한 컴포넌트들을 비동기로 로드
const My = lazy(() => import('./routes/My'));
const Edit = lazy(() => import('./routes/Edit'));
const NewsDetail = lazy(() => import('./routes/NewsDetail'));
const Login = lazy(() => import('./routes/Login'));
const CreateAccount = lazy(() => import('./routes/CreateAccount'));
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
        // {
        //   path: "news",
        //   element: <News />,
        // },
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
  ];
  const routing = useRoutes(routes)
  return (

    <>
      <div className='container mx-auto lg:px-16'>

        {isLoading ? <LoadingScreen /> : <Suspense fallback={<LoadingScreen />}>{routing}</Suspense>}

      </div>
    </>
  )
}

export default App
