'use client'

import { useState } from 'react'

interface ChatInputProps {
  onQuery: (query: string) => void
  isLoading: boolean
}

export function ChatInput({ onQuery, isLoading }: ChatInputProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      onQuery(query.trim())
      setQuery('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card animate-fade-in">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about airdrops (e.g., 'Show me recent airdrops on Ethereum')"
            className="input pr-12"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>
    </form>
  )
} 