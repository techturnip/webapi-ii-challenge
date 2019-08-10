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
      errMessage: 'The posts information could not be retrieved'
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
          message: 'The post with the specified ID does not exist'
        })
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'The post information could not be retrieved'
    })
  }
})

// POST - '/api/posts' - Creates a post using the
// information sent inside the request body.
router.post('/', async (req, res) => {
  // Pull title and contents out of req.body
  const { title, contents } = req.body

  try {
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
        errMessage: 'Please provide title and contents for the post'
      })
    }
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'There was an error while saving the post to the database'
    })
  }
})

// PUT - '/api/posts/:id' - Updates the post with the
// specified id using data from the request body.
// Returns the modified document, NOT the original.
router.put('/:id', async (req, res) => {
  // Pull id from params and pull title and contents
  // from req.body
  const { id } = req.params
  const { title, contents } = req.body

  try {
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
      // if post obj & id is valid, update the post with the
      // specified update to reflect the changes in the db
      const updatedPost = await Posts.update(id, req.body)

      updatedPost
        ? res.status(200).json(updatedPost)
        : res.status(404).json({
            message: 'The post with the specified ID does not exist'
          })
    } else {
      // if the post obj is invalid, send back
      // a status of 400
      res.status(400).json({
        errMessage: 'Please provide title and contents for the post'
      })
    }
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'The post information could not be modified'
    })
  }
})

// DELETE - '/api/posts/:id' - Removes the post with the
// specified id and returns the deleted post object. You
// may need to make additional calls to the database in
// order to satisfy this requirement.
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Posts.remove(req.params.id)

    deletedPost
      ? res.status(200).json(deletedPost)
      : res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'The post could not be removed'
    })
  }
})

module.exports = router
