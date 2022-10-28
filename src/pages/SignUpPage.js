import { Divider, Button, Checkbox } from 'antd'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import { useRegisterUserMutation } from '../redux/BlogAPI'
import { setToken } from '../utils/StorageHandler'
import { signUpSchema } from '../forms'

export function SignUpPage() {
  const [checked, setChecked] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(signUpSchema),
  })

  const [registerUser, { isError }] = useRegisterUserMutation()

  const onSubmit = async ({ username, email, password }) => {
    const data = { username, email, password }
    try {
      await registerUser(data)
        .unwrap()
        .then((Userdata) => {
          setToken(Userdata.user.token)
          navigate('/', { replace: true })
        })
        .catch((error) => console.log(error))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <span className="form__header">Create new account</span>
      <label className="form__label">
        Username
        <input className="form__input" placeholder="Username" {...register('username')} />
      </label>
      <span className="warning">{errors?.username && <p>{errors?.username?.message || 'Error!'}</p>}</span>
      <label className="form__label">
        Email address
        <input className="form__input" placeholder="Email address" {...register('email')} />
      </label>
      <div>{errors?.email && <p>{errors?.email?.message || 'Error!'}</p>}</div>
      <label className="form__label">
        Password
        <input
          className="form__input"
          type={'password'}
          autoComplete={'password'}
          placeholder="Password"
          {...register('password')}
        />
      </label>
      <div>{errors?.password && <p>{errors?.password?.message || 'Error!'}</p>}</div>
      <label className="form__label">
        Repeat Password
        <input
          className="form__input"
          type={'password'}
          autoComplete={'repeat-password'}
          placeholder="Password"
          {...register('cpassword')}
        />
      </label>
      <div>{errors?.cpassword && <p>{errors?.cpassword?.message}</p>}</div>
      {isError && (
        <div>
          <p>Is already taken.</p>
        </div>
      )}
      <Divider />
      <div>
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} /> I agree to the processing of my personal
        information
      </div>
      <Button block htmlType="submit" type="primary" disabled={!isValid || !checked}>
        Create
      </Button>
      <p className="form__link">
        Already have an account? <Link to={'/sign-in'}>Sign In.</Link>
      </p>
    </form>
  )
}
