import { Button } from 'antd'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import { useLoginUserMutation } from '../redux/BlogAPI'
import { getToken, setToken } from '../utils/StorageHandler'
import { signInSchema } from '../forms'

export function SignInPage() {
  const [loginUser, { isError }] = useLoginUserMutation()
  const navigate = useNavigate()
  const token = getToken()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(signInSchema),
  })

  if (token) {
    return <Navigate to={'/'} replace />
  }

  const onSubmit = async (data) => {
    try {
      await loginUser(data)
        .unwrap()
        .then((userData) => {
          setToken(userData.user.token)
          navigate('/', { replace: true })
        })
        .catch((e) => {
          console.error(e.data.errors, data)
        })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <span className="form__header">Sign In</span>
      <label className="form__label">
        Email address
        <input className="form__input" placeholder="Email address" {...register('email')} />
      </label>
      <div>{errors?.email && <p>{errors?.email?.message || 'Error!'}</p>}</div>
      <label className="form__label">
        Password
        <input
          type={'password'}
          autoComplete={'password'}
          className="form__input"
          {...register('password')}
          placeholder="Password"
        />
      </label>
      <div>{errors?.password && <p>{errors?.password?.message || 'Error!'}</p>}</div>
      {isError && (
        <div>
          <p>Incorrect login or password</p>
        </div>
      )}
      <Button block htmlType="submit" type="primary" disabled={!isValid}>
        Login
      </Button>
      <p className="form__link">
        Don’t have an account? <Link to={'/sign-up'}>Sign Up.</Link>
      </p>
    </form>
  )
}
