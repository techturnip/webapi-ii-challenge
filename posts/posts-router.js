const express = require('express')

// Data base operations
const Posts = require('../data/db.js')

// Router
const router = express.Router()

// ================================================|
// REQUEST HANDLERS ===============================|
// ================================================|

// POSTS ENDPOINTS --------------------------------|
// ------------------------------------------------|

// GET - '/api/posts' - Returns an array of all the
// post objects contained in the database.
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find()
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'The posts information could not be retrieved.'
    })
  }
})

// GET - '/api/posts/:id' - Returns the post object
// with the specified id.
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    // .findById() will return an array with the requested
    // post obj
    const post = await Posts.findById(id)

    // if array is not empty send status 200, else send 404
    post.length
      ? res.status(200).json(post)
      : res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'The post information could not be retrieved.'
    })
  }
})

module.exports = router
