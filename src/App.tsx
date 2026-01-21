import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Bridesmaid from './routes/Bridesmaid'
import Home from './routes/Home'
import Toast from './routes/Toast'

const baseRoutes = [
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
    path: '/groomsman/:id',
    element: <Bridesmaid />,
  },
]

const slugPrefixes = ['event', 'events']

const slugRoutes = slugPrefixes.flatMap((prefix) => [
  {
    path: `/${prefix}/:slug`,
    element: <Home />,
  },
  {
    path: `/${prefix}/:slug/toast`,
    element: <Toast />,
  },
  {
    path: `/${prefix}/:slug/bridesmaid/:id`,
    element: <Bridesmaid />,
  },
  {
    path: `/${prefix}/:slug/groomsman/:id`,
    element: <Bridesmaid />,
  },
])

const router = createBrowserRouter([
  ...baseRoutes,
  ...slugRoutes,
  {
    path: '*',
    element: <Home />,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
