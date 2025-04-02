import React from 'react'

const Movie = ({params}) => {
  return (
    <div>
      {params.type}
      {params.id}
    </div>
  )
}

export default Movie
