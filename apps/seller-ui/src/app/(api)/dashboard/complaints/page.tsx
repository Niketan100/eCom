'use client'

import { useQueries } from '@tanstack/react-query'
import React from 'react'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  MessageSquare,
  User,
  Calendar,
  Settings,
  Loader2,
  XCircle,
  Eye,
  Check,
  MoreVertical
} from 'lucide-react'

const ComplaintsPage = () => {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'resolved'>('all')
  const [selectedComplaint, setSelectedComplaint] = React.useState<string | null>(null)

  const complaintsQuery = useQueries({
    queries: [
      {
        queryKey: ['complaints'],
        queryFn: async () => {
          const response = await axiosInstance.get('auth/complaints/get-complaints')
          return response.data
        },
      }
    ]
  })
  const complaints = complaintsQuery[0].data?.complaints || [];

  const filteredComplaints = React.useMemo(() => {
    const q = search.trim().toLowerCase()

    return complaints.filter((c: any) => {
      const status = String(c?.status ?? '').toLowerCase()
      const matchesStatus = statusFilter === 'all' ? true : status === statusFilter

      if (!q) return matchesStatus

      const haystack = [
        c?.subject,
        c?.message,
        c?.customer,
        c?.id,
        c?.user?.name,
        c?.user?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesStatus && haystack.includes(q)
    })
  }, [complaints, search, statusFilter])

  if (complaintsQuery[0].isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-gray-400 text-lg">Loading complaints...</p>
        </div>
      </div>
    )
  }

  if (complaintsQuery[0].error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Complaints</h2>
          <p className="text-gray-400 text-sm">There was an error loading your complaints. Please try again.</p>
          <button 
            onClick={() => complaintsQuery[0].refetch()}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const normalizeStatus = (value: any) => String(value ?? '').trim().toLowerCase();

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'resolved': 'bg-green-500/20 text-green-400 border-green-500/20',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      'rejected': 'bg-red-500/20 text-red-400 border-red-500/20'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'pending': <Clock className="w-3 h-3" />,
      'resolved': <CheckCircle className="w-3 h-3" />,
      'in-progress': <Loader2 className="w-3 h-3 animate-spin" />,
      'rejected': <XCircle className="w-3 h-3" />
    }
    return icons[status as keyof typeof icons] || <AlertCircle className="w-3 h-3" />
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pending',
      'resolved': 'Resolved',
      'in-progress': 'In Progress',
      'rejected': 'Rejected'
    }
    return labels[status] || status
  }

  const stats = [
    {
      title: 'Total Complaints',
      value: complaints.length,
      icon: MessageSquare,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Pending',
      value: complaints.filter((p: any) => normalizeStatus(p.status) === 'pending').length,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      title: 'In Progress',
      value: complaints.filter((p: any) => normalizeStatus(p.status) === 'in-progress').length,
      icon: Loader2,
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-500/10 to-purple-500/10'
    },
    {
      title: 'Resolved',
      value: complaints.filter((p: any) => normalizeStatus(p.status) === 'resolved').length,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Complaints
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Manage customer complaints and support requests</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 w-fit">
            <Settings className="w-4 h-4" />
            Support Settings
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Complaints List */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Complaints</h2>
              <p className="text-gray-400 text-sm mt-1">Customer support tickets and complaints</p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search complaints..."
                  className="pl-10 pr-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 w-full sm:w-48 md:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Complaints List */}
          <div className="flex flex-col gap-4">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <MessageSquare className="w-16 h-16 text-gray-600 opacity-30" />
                  <p className="text-gray-400 text-lg">No complaints found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filter</p>
                </div>
              </div>
            ) : (
              filteredComplaints.map((complaint: any, index: number) => {
                const status = normalizeStatus(complaint.status)
                const isSelected = selectedComplaint === complaint.id

                return (
                  <div
                    key={index}
                    className={`
                      group bg-gray-700/20 border rounded-2xl p-5 
                      transition-all duration-300 hover:border-gray-600
                      ${isSelected ? 'border-blue-500/50 bg-blue-500/5' : 'border-gray-700'}
                      hover:bg-gray-700/30 hover:shadow-2xl hover:shadow-black/20
                    `}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left - Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {complaint.subject || 'No Subject'}
                              </h3>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                                {getStatusIcon(status)}
                                {getStatusLabel(status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                ID: {complaint.id?.slice(0, 8) || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {complaint?.user?.name || complaint?.user?.email || 'Unknown'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {complaint?.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 mt-3 leading-relaxed text-sm line-clamp-2">
                          {complaint.message || 'No message provided'}
                        </p>
                      </div>

                      {/* Right - Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[160px]">
                        <button 
                          onClick={() => setSelectedComplaint(isSelected ? null : complaint.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all duration-200 border border-blue-500/20 text-sm font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>

                        {status !== 'resolved' && (
                          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-all duration-200 border border-green-500/20 text-sm font-medium">
                            <Check className="w-3.5 h-3.5" />
                            Mark Resolved
                          </button>
                        )}

                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700/30 text-gray-400 rounded-xl hover:bg-gray-700/50 hover:text-white transition-all duration-200 text-sm font-medium">
                          <MoreVertical className="w-3.5 h-3.5" />
                          More
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-gray-700/50 animate-slideDown">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Message</p>
                            <p className="text-gray-300 mt-1 text-sm">{complaint.message || 'No message'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Response</p>
                            <p className="text-gray-300 mt-1 text-sm">
                              {complaint.response || 'No response yet'}
                            </p>
                            {!complaint.response && status !== 'resolved' && (
                              <button className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                Add Response
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <span className="text-xs text-gray-500">
                            Created: {complaint?.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A'}
                          </span>
                          {complaint?.updatedAt && (
                            <span className="text-xs text-gray-500">
                              Updated: {new Date(complaint.updatedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default ComplaintsPage