import { Alert, Pagination, Space } from 'antd'
import { nanoid } from 'nanoid'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { changePages, fetchArticleList, fetchLoginArticleList } from '../../store/ArticleListSlice/ArticleListSlice'
import Article from '../Article'
import { toggleFormats } from '../../store/ArticleSlice/ArticleSlice'
import Load from '../Load/Load'

import classes from './ArticleList.module.scss'

const ArticleList = () => {
  const articleData = useSelector((state) => state.ArticleList)
  const { isLogged } = useSelector((store) => store.User)
  const { status, articles, error, articlesCount, articlesPage } = articleData

  const dispatch = useDispatch()

  const article = articles.map((item) => {
    const id = nanoid(10)
    const { ...other } = item
    return (
      <li className={classes.main__itemBox} key={id}>
        <Article {...other} />
      </li>
    )
  })

  useEffect(() => {
    if (!isLogged) {
      dispatch(fetchArticleList())
    } else {
      dispatch(fetchLoginArticleList())
    }
    dispatch(toggleFormats(true))
  }, [dispatch])

  useEffect(() => {
    let offset = (articlesPage - 1) * 20
    if (!isLogged) {
      dispatch(fetchArticleList(offset))
    } else {
      dispatch(fetchLoginArticleList(offset))
    }
    window.scrollTo(0, 0)
  }, [dispatch, articlesPage])

  console.log(articleData)
  console.log(article)
  if (status === 'loading') {
    return (
      <div className={classes.conteiner}>
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
  } else {
    return (
      <section className={classes.conteiner}>
        <ul className={classes.main__list}>{article}</ul>
        <Pagination
          defaultPageSize={20}
          current={articlesPage}
          total={articlesCount}
          showSizeChanger={false}
          onChange={(page) => {
            dispatch(changePages(page))
          }}
        />
      </section>
    )
  }
}

export default ArticleList
