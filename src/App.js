import { Navigate, Route, Routes } from 'react-router-dom'

import { BlogPage } from './pages/BlogPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { ArticlePage } from './pages/ArticlePage'
import { Layout } from './components/Layout'
import { ProfilePage } from './pages/ProfilePage'
import { CreateArticlePage } from './pages/CreateArticlePage'
import { EditArticlePage } from './pages/EditArticlePage'
import RequireAuth from './hoc/RequireAuth'
import { useGetUserQuery } from './redux/BlogAPI'

function App() {
  const token = localStorage.getItem('token')
  const { data = [] } = useGetUserQuery(token)

  return (
    <Routes>
      <Route path="/" element={<Layout userData={data.user} />}>
        <Route index element={<Navigate to="articles" />} />
        <Route path="articles" element={<BlogPage />} />
        <Route path="articles/:slug" element={<ArticlePage userData={data.user} />} />
        <Route
          path="new-article"
          element={
            <RequireAuth>
              <CreateArticlePage />
            </RequireAuth>
          }
        />
        <Route
          path="/articles/:slug/edit"
          element={
            <RequireAuth>
              <EditArticlePage userData={data?.user} />
            </RequireAuth>
          }
        />
        <Route path="sign-up" element={<SignUpPage />}></Route>
        <Route path="sign-in" element={<SignInPage />}></Route>
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />}></Route>
      </Route>
    </Routes>
  )
}

export default App
