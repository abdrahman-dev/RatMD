import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/app/store/auth-store'
import { client } from '@/lib/api/client'
import { CONVERSIONS } from '@/lib/api/endpoints'
import { formatNumber } from '@/lib/utils'
import type { ConversionHistoryItem } from '@/types'

interface HistoryResponse {
  success: boolean
  conversions: ConversionHistoryItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface StatsResponse {
  success: boolean
  stats: {
    totalTokensSaved: number
    totalConversions: number
    avgSavingsPercent: number
    ratRank: string
    avatar: string
  }
}

const AVATAR_INITIALS: Record<string, string> = {
  rat_default: 'R',
  rat_ninja: 'N',
  rat_hacker: 'H',
  rat_king: 'K',
  rat_ghost: 'G',
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<StatsResponse['stats'] | null>(null)
  const [history, setHistory] = useState<ConversionHistoryItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [statsRes, historyRes] = await Promise.all([
          client.get<StatsResponse>(CONVERSIONS.stats),
          client.get<HistoryResponse>(`${CONVERSIONS.history}?page=${page}&limit=10`),
        ])
        setStats(statsRes.stats)
        setHistory(historyRes.conversions)
        setTotalPages(historyRes.pagination.totalPages)
      } catch {
        // Fail silently — user sees empty state
      } finally {
        setLoading(false)
      }
    }
    void loadData()
  }, [page])

  const avatarInitial = AVATAR_INITIALS[user?.avatar ?? 'rat_default'] ?? user?.name?.charAt(0).toUpperCase() ?? 'R'

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 bg-surface border border-border animate-pulse" />
          <div className="space-y-2 min-w-0">
            <div className="w-full max-w-[200px] h-6 bg-surface border border-border animate-pulse" />
            <div className="w-24 h-4 bg-surface border border-border animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border p-6 animate-pulse">
              <div className="w-20 h-4 bg-border mb-3" />
              <div className="w-32 h-8 bg-border" />
            </div>
          ))}
        </div>
        <div className="bg-surface border border-border p-6 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-border mb-2"  />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Greeting */}
        <div className="flex items-center gap-4">
          <span
            className="w-16 h-16 shrink-0 flex items-center justify-center bg-accent/10 text-accent text-2xl font-mono font-bold border border-accent/20"
            
          >
            {avatarInitial}
          </span>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-text font-sans truncate">
              Hey {user?.name}, here's your impact
            </h1>
            <span className="text-sm font-mono text-accent">{stats?.ratRank ?? user?.ratRank}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border p-6" >
            <p className="text-xs font-mono text-text-dim mb-2">Total Tokens Saved</p>
            <p className="text-3xl font-mono font-bold text-accent">
              {formatNumber(stats?.totalTokensSaved ?? 0)}
            </p>
          </div>
          <div className="bg-surface border border-border p-6" >
            <p className="text-xs font-mono text-text-dim mb-2">Total Conversions</p>
            <p className="text-3xl font-mono font-bold text-accent">
              {formatNumber(stats?.totalConversions ?? 0)}
            </p>
          </div>
          <div className="bg-surface border border-border p-6" >
            <p className="text-xs font-mono text-text-dim mb-2">Avg Savings %</p>
            <p className="text-3xl font-mono font-bold text-accent">
              {stats?.avgSavingsPercent ?? 0}%
            </p>
          </div>
        </div>

        {/* Conversion history */}
        <div className="bg-surface border border-border" >
          <div className="px-4 sm:px-6 py-4 border-b border-border">
            <h2 className="text-lg font-mono font-bold text-text">Conversion History</h2>
          </div>

          {history.length === 0 ? (
            <div className="px-4 sm:px-6 py-12 text-center">
              <p className="text-sm font-mono text-text-dim">No conversions yet — drop a PDF in the converter to get started.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-text-dim font-normal">Filename</th>
                      <th className="text-right px-6 py-3 text-text-dim font-normal">Original</th>
                      <th className="text-right px-6 py-3 text-text-dim font-normal">Optimized</th>
                      <th className="text-right px-6 py-3 text-text-dim font-normal">Savings %</th>
                      <th className="text-right px-6 py-3 text-text-dim font-normal">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map((item) => (
                      <tr key={item._id} className="text-text">
                        <td className="px-6 py-3 truncate max-w-[200px]">{item.filename}</td>
                        <td className="px-6 py-3 text-right">{formatNumber(item.originalTokens)}</td>
                        <td className="px-6 py-3 text-right">{formatNumber(item.optimizedTokens)}</td>
                        <td className="px-6 py-3 text-right text-accent">{item.savingsPercent}%</td>
                        <td className="px-6 py-3 text-right text-text-dim">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="sm:hidden divide-y divide-border">
                {history.map((item) => (
                  <div key={item._id} className="px-4 py-3 space-y-1">
                    <p className="text-sm font-mono text-text break-words">{item.filename}</p>
                    <div className="flex justify-between text-xs font-mono text-text-dim">
                      <span>{formatNumber(item.originalTokens)} → {formatNumber(item.optimizedTokens)}</span>
                      <span className="text-accent">{item.savingsPercent}%</span>
                    </div>
                    <p className="text-xs font-mono text-text-dimmer">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="text-sm font-mono text-text-dim hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-h-[44px] flex items-center px-3"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs font-mono text-text-dim">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="text-sm font-mono text-text-dim hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-h-[44px] flex items-center px-3"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
