"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchAndFilterProps) {
  const clearFilters = () => {
    onSearchChange("")
    onCategoryChange("All")
  }

  return (
    <div className="mb-6 md:mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 md:h-12"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 sm:w-48 md:w-52">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-11 md:h-12">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(searchQuery || selectedCategory !== "All") && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground font-medium">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-7 px-3 text-xs font-medium"
              >
                Search: "{searchQuery}" <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {selectedCategory !== "All" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCategoryChange("All")}
                className="h-7 px-3 text-xs font-medium"
              >
                Category: {selectedCategory} <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearFilters} className="h-7 px-3 text-xs bg-transparent">
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
