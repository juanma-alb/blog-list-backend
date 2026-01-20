const _ = require('lodash')
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

const maxLikes = (blogs) => {
  let acc = 0
  let obj = {}
  blogs.forEach( blog =>
  {

    if (acc < blog.likes)
    {acc = blog.likes
      obj = blog}

  }
  )
  return obj
}

const mostFavoritesBlog = (blogs) => {
  let acc = 0
  let obj = {}

  blogs.forEach(blog => {

    if (acc<blog.likes)
    {
      acc = blog.likes
      obj= blog
    }
  })

  return obj
}

const mostBlogs = (blogs) => {

  const authorCounts = _.countBy(blogs, 'author')

  const formattedList = _.map(authorCounts, (count, author) => {
    return {
      author: author,
      blogs: count
    }
  })
  return _.maxBy(formattedList, 'blogs')
}

const mostLikes = (blogs) => {
  let obj = {}
  blogs.forEach(blog => {

    if (!obj[blog.author]){
      obj[blog.author] = blog.likes
    }
    else {
      obj[blog.author] += blog.likes
    }
  })

  const authors = Object.entries(obj).map(([author, likes]) => {
    return ({
      author:author,
      likes:likes
    })
  })
  let mostLikes = 0
  let mostLikesAuthor= {}

  authors.forEach(author =>
  {if (author.likes>mostLikes)
  {mostLikesAuthor= author
    mostLikes= author.likes
  }}
  )

  return mostLikesAuthor
}

module.exports = {
  dummy, totalLikes, maxLikes, mostFavoritesBlog, mostBlogs, mostLikes
}