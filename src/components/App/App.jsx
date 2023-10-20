import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { message } from 'antd'

import { savedLoginUser } from '../../store/UserSlice/UserSlice'
import Header from '../Header'
import ArticleList from '../ArticleList'
import ArticleSlug from '../ArticleSlug'
import SignIn from '../SignIn'
import SignUp from '../SignUp'
import Profile from '../Profile'
import ArticleCreate from '../ArticleCreate'
import PrivateRoute from '../../hoc/PrivateRoute'

import classes from './App.module.scss'

const App = () => {
  const { isLogged } = useSelector((store) => store.User)
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  const getMessage = () => {
    messageApi.success('Completed!')
  }

  useEffect(() => {
    if (isLogged) {
      dispatch(savedLoginUser())
    }
  }, [])

  return (
    <>
      {contextHolder}
      <Header />
      <main className="main">
        <div className={classes.wrapper}>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/articles/:slug" element={<ArticleSlug />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/new-article"
              element={
                <PrivateRoute>
                  <ArticleCreate getMessage={getMessage} />
                </PrivateRoute>
              }
            />
            <Route
              path="/articles/:slug/edit"
              element={
                <PrivateRoute>
                  <ArticleCreate getMessage={getMessage} />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App
