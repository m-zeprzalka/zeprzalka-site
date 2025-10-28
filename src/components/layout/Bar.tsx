"use client"

import React, { useEffect, useState } from "react"

export function Bar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const totalHeight = document.body.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = (scrollY / totalHeight) * 100
        setScrollProgress(progress)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="sticky top-0 z-60 h-1 bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className="h-full bg-gradient-to-r from-black to-white"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
