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

module.exports = router
