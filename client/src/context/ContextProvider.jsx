import React, { createContext, useState } from 'react'

export const context=createContext()

function ContextProvider({children}) {
const [loadData,setLoadData]=useState(false)
  return (
    <context.Provider value={{loadData,setLoadData}}>
      {children}
      </context.Provider>
  )
}

export default ContextProvider