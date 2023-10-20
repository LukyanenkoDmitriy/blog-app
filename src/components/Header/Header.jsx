import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { logOutReducer } from '../../store/UserSlice/UserSlice'
import icon from '../../assets/image/user_icon.png'

import classes from './Header.module.scss'

const UnauthorizedUser = () => {
  return (
    <div className={classes.header__content}>
      <Link to={'/sign-in'}>
        <button className={classes.header__button} type="button">
          Sign In
        </button>
      </Link>
      <Link to={'/sign-up'}>
        <button className={`${classes.header__button} ${classes.sign_up}`} type="button">
          Sign Up
        </button>
      </Link>
    </div>
  )
}

const AuthorizedUser = () => {
  const { user } = useSelector((state) => state.User)
  let picture
  user.image ? (picture = user.image) : (picture = icon)
  const dispatch = useDispatch()
  return (
    <div className={classes.header__userContent}>
      <Link to={'/new-article'}>
        <button type="button" className={classes.header__btnCreate}>
          Create article
        </button>
      </Link>
      <div className={classes.header__userInfo}>
        <span className={classes.header__userName}>{user.username}</span>
        <Link to={'/profile'}>
          <div className={classes.header__userImageContent}>
            <img src={picture} alt="user image" className={classes.header__userIcon} />
          </div>
        </Link>
      </div>
      <button
        onClick={() => {
          dispatch(logOutReducer())
        }}
        className={classes.header__btnLogOut}
        type="button"
      >
        Log Out
      </button>
    </div>
  )
}

const Header = () => {
  const { isLogged } = useSelector((state) => state.User)

  return (
    <header className={classes.header}>
      <div className={classes.header__wrapper}>
        <div className={`${classes['header__box-one']}`}>
          <Link to={'/'}>
            <h1 className={classes.header__title}>Realworld Blog</h1>
          </Link>
        </div>
        <div className={`${classes['header__box-two']}`}>{isLogged ? <AuthorizedUser /> : <UnauthorizedUser />}</div>
      </div>
    </header>
  )
}

export default Header
