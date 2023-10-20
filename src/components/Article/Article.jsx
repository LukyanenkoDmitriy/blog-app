import { useSelector, useDispatch } from 'react-redux'
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { deleteLikeFetch, addLikeFetch } from '../../store/UserArticleSlice/UserArticleSlice'
import icon from '../../assets/image/user_icon.png'
import formatDate from '../../utils/formatDate'
import formatText from '../../utils/formatText'
import addLike from '../../assets/image/heart.svg'
import activeLike from '../../assets/image/activeLike.svg'

import classes from './Article.module.scss'

const Article = (props) => {
  const { title, description, createdAt, tagList, favorited, favoritesCount, author, slug } = props
  const { username, image } = author
  const formatStatus = useSelector((status) => status.Article.options.formats)
  const { likeError } = useSelector((store) => store.ArticleUser)
  const { isLogged } = useSelector((store) => store.User)
  const dispatch = useDispatch()
  const [toggleLike, setToggleLike] = useState(favorited)
  const [likeCounter, setLikeCounter] = useState(favoritesCount)
  let titleText
  let descriptionText
  let likeIcon

  useEffect(() => {
    setLikeCounter(favoritesCount)
    setToggleLike(favorited)
  }, [favorited, favoritesCount])

  const onLiked = () => {
    if (toggleLike) {
      dispatch(deleteLikeFetch(slug))
      if (!likeError) setToggleLike(false)
      setLikeCounter((count) => count - 1)
    } else {
      dispatch(addLikeFetch(slug))
      if (!likeError) setToggleLike(true)
      setLikeCounter((count) => count + 1)
    }
  }

  formatStatus ? (titleText = formatText(title, 100)) : (titleText = title)
  formatStatus ? (descriptionText = formatText(description, 322)) : (descriptionText = description)
  toggleLike && isLogged ? (likeIcon = activeLike) : (likeIcon = addLike)

  let picture
  let tags
  image ? (picture = image) : (picture = icon)
  tagList.length ? (tags = tagList) : (tags = ['Теги отсутствуют'])
  const elementsTag = tags.map((item) => {
    const id = nanoid(10)
    if (!item.trim()) {
      return (
        <span key={id} className={classes.main__tag}>
          пустой тег
        </span>
      )
    }
    return (
      <span key={id} className={classes.main__tag}>
        {item}
      </span>
    )
  })

  return (
    <div className={classes.main__item}>
      <div className={classes.main__info}>
        <div className={classes.main__titleBox}>
          <Link to={`/articles/${slug}`}>
            <h2 className={classes.main__title}>{titleText}</h2>
          </Link>
          <button disabled={isLogged ? false : true} onClick={onLiked} type="button" className={classes.main__addLike}>
            <img alt="button like" src={likeIcon} />
          </button>
          <span className={classes.main__likes}>{likeCounter}</span>
        </div>
        <div className={classes.main__user}>
          <div className={classes.main__userInfo}>
            <span className={classes.main__userName}>{username}</span>
            <span className={classes.main__date}>{formatDate(createdAt)}</span>
          </div>
          <div className={classes.main__iconBox}>
            <img alt="user image" src={picture} className="main__icon" />
          </div>
        </div>
      </div>
      <div className={classes.main__tags}>{elementsTag}</div>
      <div className={classes.main__content}>
        <textarea defaultValue={descriptionText} className={classes.main__description} readOnly></textarea>
      </div>
    </div>
  )
}

export default Article
