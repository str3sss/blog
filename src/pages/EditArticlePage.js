import { Button } from 'antd'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useEditArticleMutation, useGetArticleQuery } from '../redux/BlogAPI'
import { getToken } from '../utils/StorageHandler'

export function EditArticlePage({ userData }) {
  const slug = useParams().slug
  const token = getToken()
  const navigate = useNavigate()
  const [editArticle, { isError }] = useEditArticleMutation()
  const { data = [] } = useGetArticleQuery(slug)
  const article = data.article
  const [tagList, setTagList] = useState([])

  useEffect(() => {
    if (article) {
      setTagList(article.tagList)
    }
  }, [article])

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

  const onSubmit = async (data) => {
    const validatedData = { ...data, tagList }
    try {
      await editArticle({ body: validatedData, slug, token })
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  if (!(userData && article)) {
    return null
  } else {
    if (userData?.username !== article?.author?.username) {
      navigate('/articles', { replace: true })
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <span className="form__header">Edit article</span>
      <label className="form__label">
        Title
        <input className="form__input" {...register('title')} defaultValue={article?.title} />
      </label>
      <span className="warning">{errors?.title && <p>{errors?.title?.message || 'Error!'}</p>}</span>
      <label className="form__label">
        Short description
        <input className="form__input" {...register('description')} defaultValue={article?.description} />
      </label>
      <span className="warning">{errors?.description && <p>{errors?.description?.message || 'Error!'}</p>}</span>
      <label className="form__label">
        Text
        <textarea className="form__textarea" {...register('body')} defaultValue={article?.body}></textarea>
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
