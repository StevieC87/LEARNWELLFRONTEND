// hooks/useNonce.js
'use client'
import { useEffect, useState } from 'react'

export function useNonce() {
  const [nonce, setNonce] = useState('')

  useEffect(() => {
    const metaNonce = document.querySelector('meta[name="nonce"]')
    console.log(metaNonce, 'noncefrommeta in useNonce hook')
    if (metaNonce) {
      const content = metaNonce.getAttribute('content')
      console.log(content, 'contentfrommetanonce')
      setNonce(content) // This should set the nonce immediately
    }
  }, [])

  console.log(nonce, 'noncefromuseNoncehook') // This should show the nonce, not empty string

  return nonce
}