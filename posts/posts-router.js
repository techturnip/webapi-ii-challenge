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

      if (updatedPost) {
        // grab the updated post
        const returnUpdatedPost = await Posts.findById(id)

        // send updated post with response
        res.status(200).json(returnUpdatedPost)
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist'
        })
      }
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
// specified id and returns the deleted post object.
router.delete('/:id', async (req, res) => {
  try {
    // grab post associated with the id
    const postToBeDeleted = await Posts.findById(req.params.id)

    if (postToBeDeleted.length) {
      const deletedPostId = await Posts.remove(req.params.id)
      res.status(200).json(postToBeDeleted)
    } else {
      // if the post to
      res.status(404).json({
        message: 'The post with the specified ID does not exist'
      })
    }
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'The post could not be removed'
    })
  }
})

// COMMENTS ENDPOINTS -----------------------------|
// ------------------------------------------------|

// POST - '/api/posts/:id/comments' - Creates a
// comment for the post with the specified id using
// information sent inside of the request body.
// Requires 'post_id' in req.body
router.post('/:id/comments', async (req, res) => {
  try {
    // Find the post by id from params
    const post = await Posts.findById(req.params.id)

    // If post doesn't exist, findById() returns an empty
    // array, check for length
    if (post.length) {
      // pull the text property from req.body
      const { text } = req.body

      // Check if the comment text exist, is a
      // string and has a length > 0
      if (text && text.length > 0 && typeof text === 'string') {
        // If post exists, and comment text is valid
        // insert comment into db
        const newComment = await Posts.insertComment(req.body)

        // Return status code of 201
        res.status(201).json(newComment)
      } else {
        res.status(400).json({
          errMessage: 'Please provide text for the comment.'
        })
      }
    } else {
      // Else post does not exist, return 404
      res.status(404).json({
        message: 'The post with the specified ID does not exist'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      err,
      errMessage: 'There was an error while saving the comment to the database'
    })
  }
})

// GET - '/api/posts/:id/comments' - Returns an
// array of all the comment objects associated with
// post of the specified id.
router.get('/:id/comments', async (req, res) => {
  try {
    // Find the post by id from params
    const post = await Posts.findById(req.params.id)

    // If post doesn't exist, findById() returns an empty
    // array, check for length
    if (post.length) {
      // If post exists, find all comments for it
      const postComments = await Posts.findPostComments(req.params.id)

      // if post has no comments findPostComments()
      // returns an empty array, check for length
      // Ternary for brevity
      postComments.length
        ? res.status(200).json(postComments) // found comments
        : res.status(404).json({
            message: 'Comments for the post with the specified ID do not exist'
          }) // empty, 404 no comments found
    } else {
      // Else post does not exist, return 404
      res.status(404).json({
        message: 'The post with the specified ID does not exist'
      })
    }
  } catch (err) {
    res.status(500).json({
      err,
      errMessage: 'The comments information could not be retrieved'
    })
  }
})

// THIS ENDPOINT IS NOT LISTED IN THE README FOR MVP
// BUT HAS A DB METHOD ASSOCIATED WITH IT
// GET - '/api/posts/:id/comments/:id' - Returns an
// array with a single comment object associated with
// the post with the specified id

module.exports = router
