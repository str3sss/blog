import { Button } from 'antd'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'

import { useCreateArticleMutation } from '../redux/BlogAPI'
import { getToken } from '../utils/StorageHandler'

export function CreateArticlePage() {
  const [tagList, setTagList] = useState([])
  const [createArticle, { isError }] = useCreateArticleMutation()
  const navigate = useNavigate()
  const token = getToken()

  const formSchema = Yup.object({
    title: Yup.string().trim().required('Title is Required'),
    description: Yup.string().trim().required('Description is Required'),
    body: Yup.string().trim().required('Body is Required'),
  })

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: 'all',
  })

  const onSubmit = async (data) => {
    const validatedData = { ...data, tagList }
    try {
      createArticle(validatedData, token)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const addTagHandler = () => {
    setTagList([...tagList, ''])
  }

  const deleteTagHandler = (tagIndex) => {
    const newTagList = tagList.filter((item, index) => index !== tagIndex)
    setTagList(newTagList)
  }

  const tagInputHandler = (tagIndex, tagValue) => {
    const newTagList = tagList.map((item, index) => {
      if (index === tagIndex) {
        return tagValue.target.value
      } else {
        return item
      }
    })
    setTagList(newTagList)
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <span className="form__header">Create new article</span>
      <label className="form__label">
        Title
        <input className="form__input" {...register('title')} placeholder="Title" />
      </label>
      <span className="warning">{errors?.title && <p>{errors?.title?.message || 'Error!'}</p>}</span>
      <label className="form__label">
        Short description
        <input className="form__input" {...register('description')} placeholder="Short description" />
      </label>
      <span className="warning">{errors?.description && <p>{errors?.description?.message || 'Error!'}</p>}</span>
      <label className="form__label">
        Text
        <textarea className="form__textarea" {...register('body')} placeholder="Text"></textarea>
      </label>
      <span className="warning">{errors?.body && <p>{errors?.body?.message || 'Error!'}</p>}</span>
      <label className="form__label">
        Tags
        <div className="tags">
          {tagList.map((item, index) => (
            <div key={index} className="tags__tag">
              <input className="form__input" defaultValue={item} onBlur={(e) => tagInputHandler(index, e)} />
              <Button danger className="tags__delete_tag" onClick={() => deleteTagHandler(index)}>
                Delete
              </Button>
            </div>
          ))}
          <Button className="tags__add_tag" onClick={() => addTagHandler()}>
            Add Tag
          </Button>
        </div>
      </label>
      {isError && (
        <div>
          <p>Something went wrong</p>
        </div>
      )}
      <Button htmlType="submit" type="primary" disabled={!isValid}>
        Send
      </Button>
    </form>
  )
}
