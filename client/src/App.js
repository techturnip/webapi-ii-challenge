import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.scss'

function App() {
  const [data, setData] = useState({ posts: [] })

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('http://localhost:5000/api/posts')

      setData({ posts: result.data })
    }

    fetchData()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>WEB API II Challenge - Client</h1>

        <div className="posts">
          {data.posts.map(post => (
            <div key={post.id}>
              {post.title} <br />
              <br /> {post.contents}
            </div>
          ))}
        </div>
      </header>
    </div>
  )
}

export default App
