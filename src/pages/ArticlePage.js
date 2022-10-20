import { useNavigate, useParams } from 'react-router-dom'
import { HeartOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import moment from 'moment'
import { Button, Tag, Modal } from 'antd'

import {
  useDeleteArticleMutation,
  useGetArticleQuery,
  useLikeArticleMutation,
  useUnlikeArticleMutation,
} from '../redux/BlogAPI'
import { cutText } from '../utils/CutText'

import { NotFoundPage } from './NotFoundPage'

export function ArticlePage({ userData }) {
  const slug = useParams().slug
  const { confirm } = Modal
  const [likeArticle] = useLikeArticleMutation()
  const [unlikeArticle] = useUnlikeArticleMutation()
  const [deleteArticle] = useDeleteArticleMutation()
  const navigate = useNavigate()
  const { data = [], isLoading, isError } = useGetArticleQuery(slug)
  const token = localStorage.getItem('token')
  const article = data.article

  const showModal = () => {
    confirm({
      title: 'Are you sure delete this article?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteArticleHandler()
      },
    })
  }

  const deleteArticleHandler = async () => {
    try {
      await deleteArticle(slug, token)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const editArticleHandler = () => {
    try {
      navigate('edit')
    } catch (error) {
      console.log(error)
    }
  }

  const likeHandler = (slug, favorited) => {
    if (!token) {
      return null
    }
    if (favorited) {
      unlikeArticle(slug, token)
    } else {
      likeArticle(slug, token)
    }
  }

  if (isError) {
    return <NotFoundPage />
  }

  if (isLoading) return null
  console.log(userData)
  return (
    <div className="article article_detail">
      <div className="h6 article_detail__header">{article.title}</div>
      <div className="article_detail__likes">
        {article.favoritesCount}
        <HeartOutlined
          className={classNames({ liked: article.favorited })}
          onClick={() => likeHandler(article.slug, article.favorited)}
        />
      </div>
      <div className="article__author">
        <h6 className="h6 article__username">{cutText(article.author.username)}</h6>
        <h6 className="article__date">{moment(article.updatedAt).format('LL')}</h6>
        <img src={article.author.image} className="article__avatar" />
        {userData?.username === article.author.username && token && (
          <div className="article__options">
            <Button className="edit_article" onClick={() => editArticleHandler()}>
              Edit
            </Button>
            <Button className="delete_article" onClick={() => showModal()}>
              Delete
            </Button>
          </div>
        )}
      </div>
      <div className="article_detail__tags">
        {article.tagList.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <div className="article_detail__description">{cutText(article.description, 280)}</div>
      <div className="article_detail__body">{article.body}</div>
    </div>
  )
}
