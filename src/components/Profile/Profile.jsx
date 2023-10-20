import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import * as patterns from '../../utils/patterns'
import { updateUser, clearErrors, clearStateSuccess } from '../../store/UserSlice/UserSlice'

import classes from './Profile.module.scss'

const Profile = () => {
  const dispatch = useDispatch()
  const { successUpdate, editUserError, user } = useSelector((store) => store.User)
  const { email, username, image } = user

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      username: username,
      email: email,
    },
  })
  const submit = (data) => {
    let userData = {
      username: data.username ? data.username : username,
      email: data.email ? data.email : email,
      image: data.image ? data.image : image,
    }
    if (data.password) {
      userData.password = data.password
    }
    dispatch(updateUser(userData))
  }

  useEffect(() => {
    return () => {
      dispatch(clearErrors())
    }
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearStateSuccess())
    }
  }, [dispatch])

  return (
    <section className={classes.profile__wrapper}>
      <h2 className={classes.profile__title}>Edit Profile</h2>
      <form onSubmit={handleSubmit(submit)} className={classes.profile__form}>
        <label className={classes.profile__label}>
          <span className={classes.profile__text}>Username</span>
          <input
            {...register('username', {
              required: 'this field should not be empty',
              pattern: {
                value: patterns.usernamePattern,
                message: 'the field must contain from 3 to 20 characters inclusive',
              },
            })}
            className={classes.profile__input}
            type="text"
            placeholder="Username"
          />
          {errors?.username && <span className={classes.profile__error}>{errors.username.message}</span>}
          {editUserError?.username && (
            <span className={classes.profile__error}>{`This username ${editUserError.username}`}</span>
          )}
        </label>
        <label className={classes.profile__label}>
          <span className={classes.profile__text}>Email address</span>
          <input
            {...register('email', {
              pattern: {
                value: patterns.userEmailPattern,
                message: 'the field must contain a valid email address',
              },
              required: 'this field should not be empty',
            })}
            className={classes.profile__input}
            type="email"
            placeholder="Email address"
          />
          {errors?.email && <span className={classes.profile__error}>{errors.email.message}</span>}
          {editUserError?.email && (
            <span className={classes.profile__error}>{`This username ${editUserError.email}`}</span>
          )}
        </label>
        <label className={classes.profile__label}>
          <span className={classes.profile__text}>New password</span>
          <input
            {...register('password', {
              pattern: {
                value: patterns.passwordPattern,
                message: 'the field must contain from 6 to 40 characters inclusive',
              },
            })}
            className={classes.profile__input}
            type="password"
            placeholder="New password"
          />
          {errors?.password && <span className={classes.profile__error}>{errors.password.message}</span>}
        </label>
        <label className={classes.profile__label}>
          <span className={classes.profile__text}>{'Avatar image (url)'}</span>
          <input
            {...register('image', {
              pattern: {
                value: patterns.urlPattern,
                message: 'the field must contain a valid URL address',
              },
            })}
            className={classes.profile__input}
            type="text"
            placeholder="Avatar image"
          />
          {errors?.image && <span className={classes.profile__error}>{errors.image.message}</span>}
        </label>
        <div className={classes.profile__box}>
          <input
            className={successUpdate ? classes.profile__successButton : classes.profile__button}
            type="submit"
            value={successUpdate ? 'saved' : 'save'}
          />
        </div>
      </form>
    </section>
  )
}

export default Profile
