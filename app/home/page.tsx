"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { SearchAndFilter } from "@/components/search-and-filter"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, TrendingUp, Users, Leaf } from "lucide-react"
import Link from "next/link"

// Mock product data
const mockProducts = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    description: "Classic brown leather jacket in excellent condition",
    price: 89.99,
    category: "Clothing",
    imageUrl: "/vintage-leather-jacket.png",
    sellerId: 2,
    sellerName: "sarah_vintage",
  },
  {
    id: 2,
    title: "iPhone 12 Pro",
    description: "Unlocked iPhone 12 Pro, 128GB, minor scratches",
    price: 599.99,
    category: "Electronics",
    imageUrl: "/iphone-12-pro.jpg",
    sellerId: 3,
    sellerName: "tech_reseller",
  },
  {
    id: 3,
    title: "Wooden Coffee Table",
    description: "Handcrafted oak coffee table, perfect for living room",
    price: 150.0,
    category: "Furniture",
    imageUrl: "/wooden-coffee-table.png",
    sellerId: 4,
    sellerName: "furniture_lover",
  },
  {
    id: 4,
    title: "Road Bike - Trek",
    description: "Trek road bike, 21 speed, great for commuting",
    price: 320.0,
    category: "Sports",
    imageUrl: "/trek-road-bike.png",
    sellerId: 5,
    sellerName: "bike_enthusiast",
  },
  {
    id: 5,
    title: "Organic Chemistry Textbook",
    description: "University level organic chemistry textbook, like new",
    price: 45.0,
    category: "Books",
    imageUrl: "/chemistry-textbook.png",
    sellerId: 6,
    sellerName: "student_seller",
  },
  {
    id: 6,
    title: "Vintage Vinyl Records",
    description: "Collection of 70s rock vinyl records",
    price: 75.0,
    category: "Music",
    imageUrl: "/vintage-vinyl-records.jpg",
    sellerId: 7,
    sellerName: "music_collector",
  },
]

export default function HomePage() {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  const categories = ["All", "Clothing", "Electronics", "Furniture", "Sports", "Books", "Music"]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/20">
          <Navbar />
          <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
            <div className="mb-8">
              <div className="h-10 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-xl mb-3 w-80"></div>
              <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-lg w-96"></div>
            </div>

            <div className="mb-8">
              <div className="h-14 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-xl"></div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50">
                  <div className="h-48 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded w-full"></div>
                    <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded w-2/3"></div>
                    <div className="h-9 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/20">
        <Navbar />

        <main className="container mx-auto px-4 py-4 md:py-6 pb-20 md:pb-6">
          <div className="mb-8 md:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-emerald-600 to-teal-600 dark:from-foreground dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent text-balance leading-tight">
                Discover Sustainable Finds
              </h1>
              <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-emerald-500 animate-pulse" />
            </div>
            <p className="text-base md:text-lg text-muted-foreground text-pretty mb-6 max-w-2xl">
              Browse quality second-hand items and reduce your environmental impact with our curated marketplace
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8 max-w-md">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl mb-2 mx-auto">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg md:text-xl font-bold text-foreground">2.5k+</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-teal-100 dark:bg-teal-900/50 rounded-xl mb-2 mx-auto">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="text-lg md:text-xl font-bold text-foreground">850+</div>
                <div className="text-xs text-muted-foreground">Sellers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/50 rounded-xl mb-2 mx-auto">
                  <Leaf className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-lg md:text-xl font-bold text-foreground">12t</div>
                <div className="text-xs text-muted-foreground">CO₂ Saved</div>
              </div>
            </div>
          </div>

          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">No products found</h3>
                <p className="text-muted-foreground mb-6 text-pretty">
                  We couldn't find any products matching your criteria. Try adjusting your search or filter settings.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                  }}
                  variant="outline"
                  className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 dark:hover:border-emerald-800 transition-all duration-200"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-medium text-foreground">
                    Showing{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {filteredProducts.length}
                    </span>{" "}
                    of {products.length} products
                    {searchQuery && (
                      <span className="text-muted-foreground">
                        {" "}
                        for "<span className="font-medium text-foreground">{searchQuery}</span>"
                      </span>
                    )}
                    {selectedCategory !== "All" && (
                      <span className="text-muted-foreground">
                        {" "}
                        in <span className="font-medium text-foreground">{selectedCategory}</span>
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Leaf className="h-3 w-3" />
                    <span>Sustainable marketplace</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        <Link href="/add-product">
          <Button
            size="lg"
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 rounded-full h-14 w-14 md:h-16 md:w-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 active:scale-95 z-40 border-0"
          >
            <Plus className="h-6 w-6 md:h-7 md:w-7 text-white" />
            <span className="sr-only">Add new product</span>
          </Button>
        </Link>
      </div>
    </AuthGuard>
  )
}
