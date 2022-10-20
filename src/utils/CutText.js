export function cutText(text, max_length = 10) {
  if (!text) {
    return ''
  }

  if (text.length > max_length) {
    return text.slice(0, max_length) + '...'
  } else {
    return text
  }
}
