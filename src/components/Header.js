import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { cutText } from '../utils/CutText'
import { getToken, removeToken } from '../utils/StorageHandler'

export function Header({ userData }) {
  const navigate = useNavigate()
  const token = getToken()
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(userData)
  }, [data, userData])

  const LogOutHandler = () => {
    removeToken()
    navigate('/')
  }
  if (token) {
    return (
      <header className="header">
        <Link to="/">
          <h6 className="h6">Realworld Blog</h6>
        </Link>
        <div className="header__logged_in">
          <Link to="new-article">
            <Button size="large" className="create_article h6">
              Create article
            </Button>
          </Link>
          <Link to="profile">
            <div className="profile">
              {data && (
                <>
                  <div className="profile__username h6">{cutText(data?.username)}</div>
                  <img className="profile__avatar" src={data?.image} />
                </>
              )}
            </div>
          </Link>
          <Button size="large" className="log_out h6" onClick={() => LogOutHandler()}>
            Log Out
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className="header">
      <Link to="/">
        <h6 className="h6">Realworld Blog</h6>
      </Link>
      <div className="header__btns">
        <Link to="sign-in">
          <Button size="large" type="link" className="sign_in h6">
            Sign In
          </Button>
        </Link>
        <Link to="sign-up">
          <Button size="large" className="sign_up h6">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  )
}
