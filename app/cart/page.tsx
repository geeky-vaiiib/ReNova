"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Leaf } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: number
  title: string
  description: string
  price: number
  category: string
  imageUrl: string
  sellerId: number
  sellerName: string
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }, [])

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeItem = (itemId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    try {
      // Create order object
      const order = {
        id: Date.now(),
        items: cartItems,
        total: getTotalPrice(),
        date: new Date().toISOString(),
        status: "completed",
      }

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      existingOrders.push(order)
      localStorage.setItem("orders", JSON.stringify(existingOrders))

      // Clear cart
      localStorage.removeItem("cart")
      setCartItems([])

      // Simulate checkout delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setShowCheckoutDialog(false)
      router.push("/orders")
    } catch (error) {
      console.error("Checkout failed:", error)
    }

    setIsCheckingOut(false)
  }

  const totalCO2Savings = cartItems.length * 15 // Mock calculation

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {cartItems.length === 0
                    ? "Your cart is empty"
                    : `${getTotalItems()} item${getTotalItems() !== 1 ? "s" : ""} in your cart`}
                </p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-6">Discover sustainable products and add them to your cart</p>
                </div>
                <Link href="/home">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">by {item.sellerName}</p>
                                <Badge variant="secondary" className="mt-1">
                                  {item.category}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                          <span className="text-foreground">${getTotalPrice().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="text-foreground">Free</span>
                        </div>
                        <div className="border-t border-border pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="font-bold text-xl text-foreground">${getTotalPrice().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Button onClick={() => setShowCheckoutDialog(true)} className="w-full" size="lg">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Environmental Impact */}
                  <Card className="bg-accent/5 border-accent/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Leaf className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Environmental Impact</h4>
                          <p className="text-sm text-muted-foreground">
                            By choosing second-hand items, you're saving approximately{" "}
                            <span className="font-semibold text-accent">{totalCO2Savings}kg CO₂</span> from being
                            released into the atmosphere.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Checkout Confirmation Dialog */}
        <AlertDialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
              <AlertDialogDescription>
                You're about to purchase {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} for $
                {getTotalPrice().toFixed(2)}. This action will complete your order and clear your cart.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCheckingOut}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isCheckingOut ? "Processing..." : "Complete Order"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGuard>
  )
}
