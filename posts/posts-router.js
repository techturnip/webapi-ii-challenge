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
  // get id from the url params
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

// POST - '/api/posts' - Creates a post using the
// information sent inside the request body.
router.post('/', async (req, res) => {
  try {
    // Pull title and contents out of req.body
    const { title, contents } = req.body

    console.log('req.body', req.body)

    // Check if the post title and contents
    // exist, are strings and have a length > 0
    if (
      title &&
      title.length > 0 &&
      typeof title === 'string' &&
      contents &&
      contents.length > 0 &&
      typeof contents === 'string'
    ) {
      // if new post obj is valid, insert into
      // the database...
      const newPostId = await Posts.insert(req.body)

      // ...and send back status 201
      res.status(201).json(newPostId)
    } else {
      // if the post obj is invalid, send back
      // a status of 400
      res.status(400).json({
        errMessage: 'Please provide title and contents for the post.'
      })
    }
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'There was an error while saving the post to the database'
    })
  }
})

module.exports = router
