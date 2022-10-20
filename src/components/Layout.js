import { Outlet } from 'react-router-dom'

import { Header } from './Header'

export function Layout({ userData }) {
  return (
    <>
      <Header userData={userData} />
      <main className="main">
        <div className="content">
          <Outlet />
        </div>
      </main>
    </>
  )
}
