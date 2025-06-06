
"use client"

import { useEffect, useState } from "react"
import ClientAppWrapper from "./ClientAppWrapper"

export default function HydrationHandler({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    )
  }

  return <ClientAppWrapper>{children}</ClientAppWrapper>
}