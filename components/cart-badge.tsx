"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export function CartBadge() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0)
      setItemCount(totalItems)
    }

    // Initial load
    updateCartCount()

    // Listen for storage changes (when cart is updated in other components)
    window.addEventListener("storage", updateCartCount)

    // Custom event for same-page cart updates
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  if (itemCount === 0) return null

  return (
    <Badge
      variant="destructive"
      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
    >
      {itemCount > 99 ? "99+" : itemCount}
    </Badge>
  )
}
