import React from 'react'

function Spinner ()  {
  return (
    <div className='flex justify-center items-center min-h-[200px]'>
       < div className='h-7 w-7 border-4 border-blue-700 animate-spin rounded-full border-t-transparent'/>
    </div>
  )
}

export default Spinner