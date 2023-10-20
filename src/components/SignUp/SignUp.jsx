import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchCreateUser, clearError } from '../../store/CreateUserSlice/CreateUserSlice'
import * as patterns from '../../utils/patterns'

import classes from './SignUp.module.scss'

const SignUp = () => {
  const [logged, setLogged] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: 'onBlur',
  })

  const dispatch = useDispatch()
  const { status, errors: storeErrors } = useSelector((state) => state.UserCreate)

  const onSubmit = (data) => {
    dispatch(fetchCreateUser(data))
    if (status === 'fulfilled') {
      setLogged(true)
      if (logged) {
        reset()
      }
    }
  }

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  if (logged) {
    return (
      <div className={classes.SignUp_loggedWrapper}>
        <div className={classes.signUp__loggedBoxOne}></div>
        <div className={classes.signUp__loggedBoxTwo}>
          <h2 className={classes.signUp__loggedTitle}>Success</h2>
          <p className={classes.signUp__loggedDescr}>You have created a new account.</p>
          <p className={classes.signUp__loggedDescr}>
            Do you want to{' '}
            <Link className={classes.signUp__loggedLink} to={'/sign-in'}>
              log in
            </Link>
            ?
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className={classes.signUp__wrapper}>
      <h2 className={classes.signUp__title}>Create new account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.signUp__form}>
        <label className={classes.signUp__label}>
          <span className={classes.signUp__text}>Username</span>
          <input
            {...register('username', {
              required: 'this field should not be empty',
              pattern: {
                value: patterns.usernamePattern,
                message: 'the field must contain from 3 to 20 characters inclusive',
              },
            })}
            className={classes.signUp__input}
            type="text"
            placeholder="Username"
          />
          {errors?.username && <span className={classes.signUp__error}>{errors.username.message}</span>}
          {storeErrors?.username && (
            <span className={classes.signUp__error}>{`This username ${storeErrors.username}`}</span>
          )}
        </label>
        <label className={classes.signUp__label}>
          <span className={classes.signUp__text}>Email address</span>
          <input
            {...register('email', {
              required: 'this field should not be empty',
              pattern: {
                value: patterns.userEmailPattern,
                message: 'the field must contain a valid email address',
              },
            })}
            className={classes.signUp__input}
            type="email"
            placeholder="Email address"
          />
          {errors?.email && <span className={classes.signUp__error}>{errors.email.message}</span>}
          {storeErrors?.email && <span className={classes.signUp__error}>{`This email ${storeErrors.email}`}</span>}
        </label>
        <label className={classes.signUp__label}>
          <span className={classes.signUp__text}>Password</span>
          <input
            {...register('password', {
              required: 'this field should not be empty',
              pattern: {
                value: patterns.passwordPattern,
                message: 'the field must contain from 6 to 40 characters inclusive',
              },
            })}
            className={classes.signUp__input}
            type="password"
            placeholder="Password"
          />
          {errors?.password && <span className={classes.signUp__error}>{errors.password.message}</span>}
        </label>
        <label className={classes.signUp__label}>
          <span className={classes.signUp__text}>Repeat Password</span>
          <input
            {...register('repeatPassword', {
              required: 'this field should not be empty',
              validate: (val) => {
                if (val !== watch('password')) return 'Passwords must match'
              },
            })}
            className={classes.signUp__input}
            type="password"
            placeholder="Password"
          />
          {errors?.repeatPassword && <span className={classes.signUp__error}>{errors.repeatPassword.message}</span>}
        </label>
        <label className={classes.signUp__labelCheck}>
          <input
            className={classes.signUp__checkbox}
            {...register('checkbox', {
              required: 'you must agree to the processing of your personal information',
            })}
            type="checkbox"
          />
          <span className={classes.signUp__checkText}>I agree to the processing of my personal information</span>
          {errors?.checkbox && <span className={classes.signUp__errorCheckbox}>{errors.checkbox.message}</span>}
        </label>
        <div className={classes.signUp__box}>
          <input className={classes.signUp__button} type="submit" value={'Create'} />
        </div>
      </form>
      <span className={classes.signUp__info}>
        Already have an account?{' '}
        <Link className={classes.signUp__link} to={'/sign-in'}>
          Sign In
        </Link>
        .
      </span>
    </section>
  )
}

export default SignUp
