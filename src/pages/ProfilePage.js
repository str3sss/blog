import { Button } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'

import { useUpdateUserMutation } from '../redux/BlogAPI'
import { getToken } from '../utils/StorageHandler'
import { profileSchema } from '../forms'

export function ProfilePage() {
  const navigate = useNavigate()
  const [updateUser, { isError }] = useUpdateUserMutation()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: 'all',
  })

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unused-vars
    const validatedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null))
    if (Object.keys(validatedData).length === 0) {
      console.log('А так не надо')
    } else {
      try {
        const token = getToken()
        const result = await updateUser({ body: validatedData, token: token })
        if (!result.error) {
          navigate('/')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <span className="form__header">Edit Profile</span>
      <label className="form__label">
        Username
        <input
          className={`form__input ${errors?.username && 'form__error'}`}
          placeholder="Username"
          {...register('username')}
        />
      </label>
      <div>{errors?.username && <p>{errors?.username?.message || 'Error!'}</p>}</div>
      <label className="form__label">
        Email address
        <input
          className={`form__input ${errors?.email && 'form__error'}`}
          placeholder="Email address"
          {...register('email')}
        />
      </label>
      <div>{errors?.email && <p>{errors?.email?.message || 'Error!'}</p>}</div>
      <label className="form__label">
        New password
        <input
          className={`form__input ${errors?.password && 'form__error'}`}
          placeholder="Password"
          {...register('password')}
        />
      </label>
      <div>{errors?.password && <p>{errors?.password?.message || 'Error!'}</p>}</div>
      <label className="form__label">
        Avatar image (url)
        <input
          className={`form__input ${errors?.image && 'form__error'}`}
          placeholder="Avatar image"
          {...register('image')}
        />
      </label>
      <div>{errors?.image && <p>{errors?.image?.message || 'Error!'}</p>}</div>
      {isError && (
        <div>
          <p>Sorry, it already taken</p>
        </div>
      )}
      <Button block htmlType="submit" type="primary" disabled={!isValid}>
        Save
      </Button>
    </form>
  )
}
