"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  Download,
  RefreshCw
} from "lucide-react"
import { supabase, type QATestReport } from "../../lib/supabase"

export default function DataPage() {
  const [reports, setReports] = useState<QATestReport[]>([])
  const [filteredReports, setFilteredReports] = useState<QATestReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reports, searchTerm])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('qa_test_reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...reports]

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.tester_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.application_version.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.test_environment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReports(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">✓ PASS</Badge>
      case 'fail':
        return <Badge variant="destructive">✗ FAIL</Badge>
      case 'not-tested':
        return <Badge variant="secondary">○ N/T</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTestSummary = (report: QATestReport) => {
    const allTests = [
      ...Object.values(report.auth_tests),
      ...Object.values(report.main_section_tests),
      ...Object.values(report.side_mission_tests),
      report.leaderboard,
      report.toko,
      report.komunitas,
      report.hasil_user,
      report.sertifikat,
      report.user_profile
    ]
    
    const passed = allTests.filter(test => test.status === 'pass').length
    const failed = allTests.filter(test => test.status === 'fail').length
    const notTested = allTests.filter(test => test.status === 'not-tested').length
    
    return { passed, failed, notTested, total: allTests.length }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const exportToCSV = () => {
    const headers = [
      'ID', 'Tester Name', 'Test Date', 'App Version', 'Environment',
      'Auth Tests', 'Main Section Tests', 'Side Mission Tests',
      'Leaderboard', 'Toko', 'Komunitas', 'Hasil User', 'Sertifikat', 'User Profile',
      'Created At'
    ]
    
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(report => [
        report.id,
        `"${report.tester_name}"`,
        report.test_date,
        `"${report.application_version}"`,
        `"${report.test_environment}"`,
        `"${JSON.stringify(report.auth_tests)}"`,
        `"${JSON.stringify(report.main_section_tests)}"`,
        `"${JSON.stringify(report.side_mission_tests)}"`,
        `"${JSON.stringify(report.leaderboard)}"`,
        `"${JSON.stringify(report.toko)}"`,
        `"${JSON.stringify(report.komunitas)}"`,
        `"${JSON.stringify(report.hasil_user)}"`,
        `"${JSON.stringify(report.sertifikat)}"`,
        `"${JSON.stringify(report.user_profile)}"`,
        report.created_at
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qa-reports-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchReports}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QA Test Reports</h1>
          <p className="text-gray-600">View and manage all submitted quality assurance test reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Filtered Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredReports.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter(report => {
                  const reportDate = new Date(report.test_date)
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  return reportDate >= weekAgo
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter(report => {
                  const reportDate = new Date(report.test_date)
                  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  return reportDate >= monthAgo
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchReports}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Tester</th>
                    <th className="text-left p-4 font-medium text-gray-900">Test Date</th>
                    <th className="text-left p-4 font-medium text-gray-900">App Version</th>
                    <th className="text-left p-4 font-medium text-gray-900">Environment</th>
                    <th className="text-left p-4 font-medium text-gray-900">Test Summary</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const summary = getTestSummary(report)
                    return (
                      <tr key={report.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{report.tester_name}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {formatDate(report.test_date)}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {report.application_version}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {report.test_environment}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                              {summary.passed}
                            </Badge>
                            <Badge variant="destructive">
                              {summary.failed}
                            </Badge>
                            <Badge variant="secondary">
                              {summary.notTested}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>QA Test Report Details</DialogTitle>
                                <DialogDescription>
                                  Detailed view of the test report by {report.tester_name}
                                </DialogDescription>
                              </DialogHeader>
                              <ReportDetails report={report} />
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        {filteredReports.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No reports found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Component for displaying detailed report information
function ReportDetails({ report }: { report: QATestReport }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">✓ PASS</Badge>
      case 'fail':
        return <Badge variant="destructive">✗ FAIL</Badge>
      case 'not-tested':
        return <Badge variant="secondary">○ N/T</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-sm font-medium text-gray-600">Tester Name</div>
          <p className="text-sm">{report.tester_name}</p>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">Test Date</div>
          <p className="text-sm">{new Date(report.test_date).toLocaleDateString()}</p>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">App Version</div>
          <p className="text-sm">{report.application_version}</p>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">Environment</div>
          <p className="text-sm">{report.test_environment}</p>
        </div>
      </div>

      {/* Authentication Tests */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Authentication Tests</h3>
        <div className="space-y-2">
          {Object.entries(report.auth_tests).map(([key, test]) => (
            <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(test.status)}
                {test.notes && (
                  <span className="text-xs text-gray-600 max-w-xs truncate" title={test.notes}>
                    {test.notes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Section Tests */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Main Section Tests</h3>
        <div className="space-y-2">
          {Object.entries(report.main_section_tests).map(([key, test]) => (
            <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium capitalize">{key}</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(test.status)}
                {test.notes && (
                  <span className="text-xs text-gray-600 max-w-xs truncate" title={test.notes}>
                    {test.notes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Mission Tests */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Side Mission Tests</h3>
        <div className="space-y-2">
          {Object.entries(report.side_mission_tests).map(([key, test]) => (
            <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(test.status)}
                {test.notes && (
                  <span className="text-xs text-gray-600 max-w-xs truncate" title={test.notes}>
                    {test.notes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leaderboard */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
          <div className="p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Display</span>
              <div className="flex items-center gap-2">
                {getStatusBadge(report.leaderboard.status)}
                {report.leaderboard.type && (
                  <Badge variant="outline">{report.leaderboard.type}</Badge>
                )}
              </div>
            </div>
            {report.leaderboard.notes && (
              <p className="text-xs text-gray-600">{report.leaderboard.notes}</p>
            )}
          </div>
        </div>

        {/* Toko */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Toko (Store)</h3>
          <div className="p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Listing & Purchase</span>
              {getStatusBadge(report.toko.status)}
            </div>
            {report.toko.notes && (
              <p className="text-xs text-gray-600">{report.toko.notes}</p>
            )}
          </div>
        </div>

        {/* Komunitas */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Komunitas</h3>
          <div className="p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Render</span>
              {getStatusBadge(report.komunitas.status)}
            </div>
            {report.komunitas.notes && (
              <p className="text-xs text-gray-600">{report.komunitas.notes}</p>
            )}
          </div>
        </div>

        {/* Hasil User */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Hasil User</h3>
          <div className="p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Edit Avatar</span>
              {getStatusBadge(report.hasil_user.status)}
            </div>
            {report.hasil_user.notes && (
              <p className="text-xs text-gray-600">{report.hasil_user.notes}</p>
            )}
          </div>
        </div>

        {/* Sertifikat */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sertifikat</h3>
          <div className="p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Unlock Missions</span>
              {getStatusBadge(report.sertifikat.status)}
            </div>
            {report.sertifikat.notes && (
              <p className="text-xs text-gray-600">{report.sertifikat.notes}</p>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div>
          <h3 className="text-lg font-semibold mb-3">User Profile</h3>
          <div className="p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Edit Profile</span>
              {getStatusBadge(report.user_profile.status)}
            </div>
            {report.user_profile.notes && (
              <p className="text-xs text-gray-600">{report.user_profile.notes}</p>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500">
        <p>Report ID: {report.id}</p>
        <p>Created: {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</p>
        {report.updated_at && (
          <p>Updated: {new Date(report.updated_at).toLocaleString()}</p>
        )}
      </div>
    </div>
  )
} 