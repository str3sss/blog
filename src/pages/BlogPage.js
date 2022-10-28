import { Pagination, Tag } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import moment from 'moment'
import classNames from 'classnames'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useGetArticlesQuery, useLikeArticleMutation, useUnlikeArticleMutation } from '../redux/BlogAPI'
import { cutText } from '../utils/CutText'
import { getToken } from '../utils/StorageHandler'

export function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [likeArticle] = useLikeArticleMutation()
  const [unlikeArticle] = useUnlikeArticleMutation()
  const { data = [], isLoading } = useGetArticlesQuery(5 * (currentPage - 1))
  const navigate = useNavigate()
  const token = getToken()

  if (isLoading) {
    console.log('загрузка')
    return (
      <ul>
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </ul>
    )
  }
  const articles = data.articles
  const articlesCount = data.articlesCount

  const likeHandler = (slug, favorited) => {
    if (!token) {
      navigate('/sign-in')
    }
    favorited ? unlikeArticle(slug, token) : likeArticle(slug, token)
  }

  return (
    <>
      <ul>
        {articles.map((item) => (
          <div className="article" key={item.slug}>
            <div className="h5 article__header">
              <Link to={`/articles/${item.slug}`}>{item.title}</Link>
            </div>
            <div className="article__likes">
              <HeartOutlined
                className={classNames({ liked: item.favorited })}
                onClick={() => likeHandler(item.slug, item.favorited)}
              />
              {item.favoritesCount}
            </div>
            <div className="article__author">
              <h6 className="h6 article__username">{cutText(item.author.username)}</h6>
              <h6 className="article__date">{moment(item.updatedAt).format('LL')}</h6>
              <img src={item.author.image} className="article__avatar" />
            </div>
            <div className="article__tags">
              {item.tagList.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </div>
            <div className="article__description">{cutText(item.description, 100)}</div>
          </div>
        ))}
      </ul>
      <Pagination
        size="small"
        style={{ textAlign: 'center' }}
        showSizeChanger={false}
        total={articlesCount * 2}
        onChange={(e) => setCurrentPage(e)}
      />
    </>
  )
}
