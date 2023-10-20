import { format } from 'date-fns'

const formatDate = (date) => {
  const converctDate = Date.parse(date)
  return format(converctDate, 'MMMM d, yyyy')
}

export default formatDate
