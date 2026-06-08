// Custom hook for localStorage persistence
// Allows any state to automatically save and restore from browser storage
// Required by exam brief: "ability for users to return and find their data intact"

import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`useLocalStorage: error setting key "${key}"`, error)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`useLocalStorage: error removing key "${key}"`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage