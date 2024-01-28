

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './component/Layout.jsx'
import Home from './pages/Home.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import PostDetail from './pages/PostDetail.jsx';
import Register from './pages/Register.jsx'
import Login from './pages/LoginPage.jsx'
import UserProfile from './pages/UserProfile.jsx';
import Authors from './pages/Authors.jsx';
import EditPost from './pages/EditPost.jsx';
import AuthorPost from './pages/AuthorPost';
import CategoryPost from './pages/CategoryPost.jsx';
import CreatePost from './pages/CreatePost.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LogoutPage from './pages/LogoutPage';
import './index.css'
import DeletePost from './pages/DeletePost';




const router = createBrowserRouter([
  {
    path: '/',
    element:<Layout />,
    errorElement: <ErrorPage />,
    children: [

      { index: true, element: <Home /> },
      { path: 'posts/:id', element: <PostDetail /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'profile/:id', element: <UserProfile /> },
      { path: 'authors', element: <Authors /> },
      { path: 'create', element: <CreatePost /> },
      { path: 'posts/categories/:category', element: <CategoryPost /> },
      { path: 'posts/users/:id', element: <AuthorPost /> },
      { path: 'myposts/:id', element: <Dashboard /> },
      { path: 'posts/:id/edit', element: <EditPost /> },
      { path: 'posts/:id/delete', element: <DeletePost /> },
      { path: 'logout', element: <LogoutPage /> },

    ]
  }
])



function App() {

  return (
    <>
      
        <RouterProvider router={router}>
          <h1>avinash</h1>
        </RouterProvider>
      
    </>
  )
}

export default App
