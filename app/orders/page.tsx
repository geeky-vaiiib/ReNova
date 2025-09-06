"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Calendar, DollarSign, Leaf } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: number
  title: string
  price: number
  quantity: number
  category: string
  imageUrl: string
  sellerName: string
}

interface Order {
  id: number
  items: OrderItem[]
  total: number
  date: string
  status: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")

    // Add some mock orders for demo purposes
    const mockOrders: Order[] = [
      {
        id: 1001,
        items: [
          {
            id: 1,
            title: "Vintage Leather Jacket",
            price: 89.99,
            quantity: 1,
            category: "Clothing",
            imageUrl: "/vintage-leather-jacket.png",
            sellerName: "sarah_vintage",
          },
          {
            id: 3,
            title: "Wooden Coffee Table",
            price: 150.0,
            quantity: 1,
            category: "Furniture",
            imageUrl: "/wooden-coffee-table.png",
            sellerName: "furniture_lover",
          },
        ],
        total: 239.99,
        date: "2024-01-20T14:30:00Z",
        status: "completed",
      },
      {
        id: 1002,
        items: [
          {
            id: 5,
            title: "Organic Chemistry Textbook",
            price: 45.0,
            quantity: 2,
            category: "Books",
            imageUrl: "/chemistry-textbook.png",
            sellerName: "student_seller",
          },
        ],
        total: 90.0,
        date: "2024-01-15T10:15:00Z",
        status: "completed",
      },
    ]

    // Combine mock orders with real orders, sort by date (newest first)
    const allOrders = [...mockOrders, ...savedOrders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    setOrders(allOrders)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalItemsInOrder = (order: Order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalCO2Savings = () => {
    const totalItems = orders.reduce((total, order) => total + getTotalItemsInOrder(order), 0)
    return totalItems * 15 // Mock calculation: 15kg CO2 per item
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Order History</h1>
                <p className="text-muted-foreground">
                  {orders.length === 0 ? "No orders yet" : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start shopping for sustainable products to see your order history here
                  </p>
                </div>
                <Link href="/home">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Environmental Impact Summary */}
                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Your Environmental Impact</h3>
                        <p className="text-sm text-muted-foreground">
                          By choosing second-hand items, you've saved approximately{" "}
                          <span className="font-semibold text-accent">{getTotalCO2Savings()}kg CO₂</span> from being
                          released into the atmosphere. Keep up the great work!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Orders List */}
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(order.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {getTotalItemsInOrder(order)} item{getTotalItemsInOrder(order) !== 1 ? "s" : ""}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />₹{order.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={`${order.id}-${item.id}`}
                            className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                          >
                            <img
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">by {item.sellerName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
