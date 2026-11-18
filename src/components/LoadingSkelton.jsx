import React from 'react'

const LoadingSkelton = ({length}) => {
  return (
    <>
    {Array.from({ length: length }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-md"
      >
        <div className="h-48 bg-gray-200 w-full" />
        <div className="p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      </div>
    ))}
    </>
  )
}

export default LoadingSkelton