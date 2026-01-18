const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  let total = 0

  blogs.forEach(blog => {
    const { likes } = blog
    total = total +likes
  })

  return total
}


module.exports = {
  dummy, totalLikes
}