import ReactMarkdown from 'react-markdown'
import { Navigate, Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Alert, Space, Popconfirm } from 'antd'

import { fetchArticle, toggleFormats } from '../../store/ArticleSlice/ArticleSlice'
import { deleteArticleFetch, clearStatus } from '../../store/UserArticleSlice/UserArticleSlice'
import Load from '../Load/Load'
import Article from '../Article'

import classes from './ArticleSlug.module.scss'

const ArticleSlug = () => {
  const store = useSelector((store) => store.Article)
  const { user } = useSelector((state) => state.User)
  const { deleteArticle } = useSelector((store) => store.ArticleUser)
  const { options, article } = store
  const { body, ...other } = article
  const { status, error } = options
  const dispatch = useDispatch()
  const params = useParams()
  const slug = params.slug

  useEffect(() => {
    dispatch(fetchArticle(slug))
    dispatch(toggleFormats(false))
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearStatus())
    }
  }, [])

  const onDelete = (slug) => {
    dispatch(deleteArticleFetch(slug))
  }

  if (deleteArticle === 'fulfilled') {
    return <Navigate to={'/'} />
  }

  if (status === 'loading') {
    return (
      <div className={classes.articleConteiner}>
        <Load />
      </div>
    )
  } else if (status === 'rejected') {
    return (
      <div style={{ margin: '0 auto', width: '650px' }}>
        <Space direction="vertical" style={{ width: '650px' }}>
          <Alert type="warning" message={error} />
        </Space>
      </div>
    )
  } else if (status === 'fulfilled') {
    return (
      <section className={classes.articleConteiner}>
        {user.username === article.author.username ? (
          <div className={classes.articleBtnBox}>
            <Popconfirm
              className={classes.articleMessage}
              description="Are you sure to delete this article?"
              okText={'Yes'}
              cancelText={'No'}
              placement="right"
              onConfirm={() => {
                onDelete(slug)
              }}
            >
              <button type="button" className={classes.articleDelete}>
                Delete
              </button>
            </Popconfirm>
            <Link to={`/articles/${slug}/edit`}>
              <button type="button" className={classes.articleEdit}>
                Edit
              </button>
            </Link>
          </div>
        ) : null}
        <Article {...other} />
        <ReactMarkdown className={classes.bodyDescr}>{body}</ReactMarkdown>
      </section>
    )
  }
}

export default ArticleSlug
