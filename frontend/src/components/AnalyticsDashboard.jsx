
import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts'

import {
  getAnalyticsOverview,
  getAnalyticsCategories,
  getAnalyticsPriorities,
  getAnalyticsTrends,
  getAnalyticsResolutionTime,
} from '../services/analyticsService'

const PRIORITY_COLORS = ['#ef4444', '#f59e0b', '#34d399', '#64748b']

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    overview: null,
    categories: [],
    priorities: [],
    trends: [],
    resolution: null,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadAnalytics() {
      setLoading(true)
      setError('')

      try {
        const [
          overview,
          categories,
          priorities,
          trends,
          resolution,
        ] = await Promise.all([
          getAnalyticsOverview(),
          getAnalyticsCategories(),
          getAnalyticsPriorities(),
          getAnalyticsTrends(),
          getAnalyticsResolutionTime(),
        ])

        if (active) {
          setAnalytics({
            overview,
            categories,
            priorities,
            trends,
            resolution,
          })
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || 'Unable to load analytics data'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      active = false
    }
  }, [refreshKey])

  const trendData = analytics.trends.map((item) => ({
    ...item,
    displayMonth: new Date(
      `${item.month}-01T00:00:00`
    ).toLocaleDateString('en', {
      month: 'short',
      year: '2-digit',
    }),
  }))

  const summaryCards = [
    {
      title: 'Resolution Rate',
      value: analytics.overview
        ? `${analytics.overview.resolution_rate}%`
        : '—',
      description: 'Percentage of resolved complaints',
    },
    {
      title: 'Average Resolution Time',
      value: analytics.resolution
        ? `${Number(
            analytics.resolution.average_resolution_hours
          ).toFixed(2)} hrs`
        : '—',
      description: 'Average time to resolve complaints',
    },
  ]

  if (loading) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        Loading analytics data...
      </section>
    )
  }

  return (
    <section className="mt-10 space-y-6">

      {/* Analytics heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            Complaint Analytics
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Insights generated from CivicSense complaint records.
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((value) => value + 1)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-400"
        >
          Refresh Analytics
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <p className="text-sm text-slate-400">
              {card.title}
            </p>

            <h3 className="mt-3 text-3xl font-bold text-emerald-400">
              {card.value}
            </h3>

            <p className="mt-2 text-xs text-slate-500">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Category and Priority charts */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Category chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-5 text-lg font-semibold">
            Complaints by Category
          </h3>

          {analytics.categories.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              No category data available.
            </p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.categories}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    stroke="#94a3b8"
                  />

                  <YAxis
                    type="category"
                    dataKey="category"
                    width={110}
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />

                  <Bar
                    dataKey="total_complaints"
                    name="Complaints"
                    fill="#34d399"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Priority chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-5 text-lg font-semibold">
            Complaints by Priority
          </h3>

          {analytics.priorities.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              No priority data available.
            </p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.priorities}
                    dataKey="total_complaints"
                    nameKey="priority_level"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {analytics.priorities.map((item, index) => (
                      <Cell
                        key={item.priority_level}
                        fill={
                          PRIORITY_COLORS[
                            index % PRIORITY_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Monthly trend chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-5 text-lg font-semibold">
          Monthly Complaint Trends
        </h3>

        {trendData.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            No monthly trend data available.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  dataKey="displayMonth"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#94a3b8"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total_complaints"
                  name="Complaints"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </section>
  )
}

export default AnalyticsDashboard
