const formatText = (text, length) => {
  if (typeof text === 'string') {
    if (text.length <= length) {
      return text
    }
    let oldText = text
    const cropText = oldText.slice(0, length)
    const getIndexSpaceCropText = cropText.lastIndexOf(' ')
    const updateText = oldText.slice(0, getIndexSpaceCropText)
    return `${updateText}...`
  } else {
    return 'неверный тип данных'
  }
}

export default formatText
