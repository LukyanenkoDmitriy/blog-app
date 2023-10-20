import { useForm, useFieldArray } from 'react-hook-form'
import { useParams, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

import { createArticleFetch, clearStatus, updateArticleFetch } from '../../store/UserArticleSlice/UserArticleSlice'
import { fetchArticle } from '../../store/ArticleSlice/ArticleSlice'

import classes from './ArticleCreate.module.scss'

const ArticleCreate = (props) => {
  const { slug } = useParams()
  const { getMessage } = props
  const dispatch = useDispatch()
  const { status } = useSelector((store) => store.ArticleUser)

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticle(slug))
    }
  }, [dispatch, slug])

  const { article } = useSelector((store) => store.Article)

  const defaultTags = () => {
    if (slug) {
      const tags = article.tagList.map((item) => {
        return { tag: item }
      })
      return tags
    } else {
      return [{ tag: '' }]
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      tags: defaultTags(),
    },
  })
  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  })

  const submit = (data) => {
    const validData = {
      title: data.title.trim(),
      description: data.description.trim(),
      body: data.body.trim(),
    }
    const updateTags = data.tags.map((item) => item.tag)
    validData.tagList = updateTags

    if (!slug) {
      dispatch(createArticleFetch(validData))
    } else {
      dispatch(updateArticleFetch({ data: validData, slug }))
    }
    getMessage()
  }

  const onDelete = (index) => {
    if (index === 0) {
      return
    } else {
      remove(index)
    }
  }

  useEffect(() => {
    return () => {
      dispatch(clearStatus())
    }
  }, [])

  if (status === 'fulfilled') {
    return <Navigate to={'/'} />
  } else {
    return (
      <section className={classes.article__wrapper}>
        <h2 className={classes.article__title}>{slug ? 'Edit article' : 'Create new article'}</h2>
        <form onSubmit={handleSubmit(submit)} className={classes.article__form}>
          <label className={classes.article__label}>
            <span className={classes.article__subtitle}>Title</span>
            <textarea
              className={classes.article__textarea}
              placeholder="Title"
              defaultValue={slug ? article.title : ''}
              {...register('title', {
                required: 'this field should not be empty',
                maxLength: {
                  value: 150,
                  message: 'this field must contain no more than 140 characters',
                },
                validate: (value) => (value.trim().length === 0 ? 'the text should not be empty' : true),
              })}
            />
            {errors?.title && <span className={classes.article__error}>{errors.title.message}</span>}
          </label>
          <label className={classes.article__label}>
            <span className={classes.article__subtitle}>Short description</span>
            <textarea
              className={classes.article__textarea}
              placeholder="Title"
              defaultValue={slug ? article.description : ''}
              {...register('description', {
                required: 'this field should not be empty',
                maxLength: {
                  value: 1000,
                  message: 'this field must contain no more than 1000 characters',
                },
                validate: (value) => (value.trim().length === 0 ? 'the text should not be empty' : true),
              })}
            />
            {errors?.description && <span className={classes.article__error}>{errors.description.message}</span>}
          </label>
          <label className={classes.article__label}>
            <span className={classes.article__subtitle}>Text</span>
            <textarea
              className={classes.article__textareaBody}
              placeholder="Text"
              defaultValue={slug ? article.body : ''}
              {...register('body', {
                required: 'this field should not be empty',
                maxLength: {
                  value: 7000,
                  message: 'this field must contain no more than 7000 characters',
                },
                validate: (value) => (value.trim().length === 0 ? 'the text should not be empty' : true),
              })}
            />
            {errors?.body && <span className={classes.article__error}>{errors.body.message}</span>}
          </label>
          <div className={classes.article__tagsWrapper}>
            <div className={classes.article__tagsContent}>
              <span className={classes.article__subtitle}>Tags</span>
              <ul className={classes.article__tagList}>
                {fields.map((field, index) => {
                  return (
                    <li key={field.id} className={classes.article__tagItem}>
                      <div className={classes.article__tagWrapper}>
                        <input
                          className={classes.article__input}
                          type="text"
                          placeholder="Tag"
                          {...register(`tags.${index}.tag`, {
                            required: 'this field should not be empty',
                            maxLength: {
                              value: 20,
                              message: 'this field must contain no more than 20 characters',
                            },
                            validate: (value) => (value.trim().length === 0 ? 'the text should not be empty' : true),
                          })}
                        />
                        <button
                          onClick={() => {
                            onDelete(index)
                          }}
                          className={classes.article__btnDelete}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                      {errors.tags?.[index]?.tag?.message && (
                        <span className={classes.article__errorTag}>{errors.tags?.[index]?.tag?.message}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div
              style={errors.tags?.[errors.tags.length - 1]?.tag?.message && { paddingBottom: '25px' }}
              className={classes.article__btnAddBox}
            >
              <button
                onClick={() => {
                  append({ tag: '' })
                }}
                className={classes.article__btnAdd}
                type="button"
              >
                Add tag
              </button>
            </div>
          </div>
          <input className={classes.article__btnSend} type="submit" value={'Send'} />
        </form>
      </section>
    )
  }
}

export default ArticleCreate
