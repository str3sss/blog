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
import Guard from './hoc/Guard'
import { useGetUserQuery } from './redux/BlogAPI'
import { getToken } from './utils/StorageHandler'

function App() {
  const token = getToken()
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
            <Guard>
              <CreateArticlePage />
            </Guard>
          }
        />
        <Route
          path="/articles/:slug/edit"
          element={
            <Guard>
              <EditArticlePage userData={data?.user} />
            </Guard>
          }
        />
        <Route path="sign-up" element={<SignUpPage />}></Route>
        <Route path="sign-in" element={<SignInPage />}></Route>
        <Route
          path="profile"
          element={
            <Guard>
              <ProfilePage />
            </Guard>
          }
        />
        <Route path="*" element={<NotFoundPage />}></Route>
      </Route>
    </Routes>
  )
}

export default App
