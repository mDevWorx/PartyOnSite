import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Bridesmaid from './routes/Bridesmaid'
import Home from './routes/Home'
import Toast from './routes/Toast'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/toast',
    element: <Toast />,
  },
  {
    path: '/bridesmaid/:id',
    element: <Bridesmaid />,
  },
  {
    path: '*',
    element: <Home />,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
