import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchLoginUser } from '../../store/UserSlice/UserSlice'
import * as patterns from '../../utils/patterns'

import classes from './SignIn.module.scss'

const SignIn = () => {
  const dispatch = useDispatch()
  const { status, error: storeErorr } = useSelector((store) => store.User)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  })
  const onSubmit = (data) => {
    dispatch(fetchLoginUser(data))
  }

  if (status === 'fulfilled') {
    return <Navigate to={'/articles'} />
  }

  return (
    <section className={classes.signIn__wrapper}>
      <h2 className={classes.signIn__title}>Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.signIn__form}>
        <label className={classes.signIn__label}>
          <span className={classes.signIn__text}>Email address</span>
          <input
            {...register('email', {
              required: 'this field should not be empty',
              pattern: {
                value: patterns.userEmailPattern,
                message: 'the field must contain a valid email address',
              },
            })}
            className={classes.signIn__input}
            type="email"
            placeholder="Email address"
          />
          {errors?.email && <span className={classes.signIn__error}>{errors.email.message}</span>}
        </label>
        <label className={classes.signIn__label}>
          <span className={classes.signIn__text}>Password</span>
          <input
            {...register('password', {
              required: 'this field should not be empty',
            })}
            className={classes.signIn__input}
            type="password"
            placeholder="Password"
          />
          {errors?.password && <span className={classes.signIn__error}>{errors.password.message}</span>}
          {storeErorr && (
            <span className={classes.signIn__error}>{`email or password: ${storeErorr['email or password']}`}</span>
          )}
        </label>
        <div className={classes.signIn__box}>
          <input className={classes.signIn__button} type="submit" value={'Login'} />
        </div>
      </form>
      <span className={classes.signIn__info}>
        Don&rsquo;t have an&nbsp;account?
        <Link className={classes.signIn__link} to={'/sign-up'}>
          Sign&nbsp;Up
        </Link>
        .
      </span>
    </section>
  )
}

export default SignIn
