import { configureStore } from '@reduxjs/toolkit'

import ArticleListReducer from './ArticleListSlice/ArticleListSlice'
import ArticleReducer from './ArticleSlice/ArticleSlice'
import UserCreateReducer from './CreateUserSlice/CreateUserSlice'
import UserReducer from './UserSlice/UserSlice'
import ArticleUserReducer from './UserArticleSlice/UserArticleSlice'

const store = configureStore({
  reducer: {
    ArticleList: ArticleListReducer,
    Article: ArticleReducer,
    UserCreate: UserCreateReducer,
    User: UserReducer,
    ArticleUser: ArticleUserReducer,
  },
})

export default store
