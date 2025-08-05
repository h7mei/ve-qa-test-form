"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Eye,
  Download,
  RefreshCw,
  ArrowLeft,
  Database,
  BarChart3
} from "lucide-react"
import { supabase, type QATestReport } from "../../../lib/supabase"
import Link from "next/link"
import { StatusBadge } from "@/components/ui/status-badge"

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
        report.application_version.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReports(filtered)
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
      'ID', 'Tester Name', 'Test Date', 'App Version',
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <Alert className="mb-4">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
            <Button onClick={fetchReports}>Retry</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/full-app" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to QA Form
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">QA Test Reports</h1>
            <p className="text-muted-foreground">View and manage all submitted quality assurance test reports</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Filtered Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredReports.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-4 font-medium">Tester</th>
                    <th className="text-left p-4 font-medium">Test Date</th>
                    <th className="text-left p-4 font-medium">App Version</th>
                    <th className="text-left p-4 font-medium">Test Summary</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const summary = getTestSummary(report)
                    return (
                      <tr key={report.id} className="border-t hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-medium">{report.tester_name}</div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(report.test_date)}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {report.application_version}
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
              <p className="text-muted-foreground">No reports found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Component for displaying detailed report information
function ReportDetails({ report }: { report: QATestReport }) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Tester Name</div>
              <p className="text-sm">{report.tester_name}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Test Date</div>
              <p className="text-sm">{new Date(report.test_date).toLocaleDateString()}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">App Version</div>
              <p className="text-sm">{report.application_version}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(report.auth_tests).map(([key, test]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={test.status} />
                  {test.notes && (
                    <span className="text-xs text-muted-foreground max-w-xs truncate" title={test.notes}>
                      {test.notes}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Section Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Main Section Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(report.main_section_tests).map(([key, test]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium capitalize">{key}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={test.status} />
                  {test.notes && (
                    <span className="text-xs text-muted-foreground max-w-xs truncate" title={test.notes}>
                      {test.notes}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Side Mission Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Side Mission Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(report.side_mission_tests).map(([key, test]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={test.status} />
                  {test.notes && (
                    <span className="text-xs text-muted-foreground max-w-xs truncate" title={test.notes}>
                      {test.notes}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Other Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Display</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={report.leaderboard.status} />
                  {report.leaderboard.type && (
                    <Badge variant="outline">{report.leaderboard.type}</Badge>
                  )}
                </div>
              </div>
              {report.leaderboard.notes && (
                <p className="text-xs text-muted-foreground">{report.leaderboard.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Toko */}
        <Card>
          <CardHeader>
            <CardTitle>Toko (Store)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Listing & Purchase</span>
                <StatusBadge status={report.toko.status} />
              </div>
              {report.toko.notes && (
                <p className="text-xs text-muted-foreground">{report.toko.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Komunitas */}
        <Card>
          <CardHeader>
            <CardTitle>Komunitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Render</span>
                <StatusBadge status={report.komunitas.status} />
              </div>
              {report.komunitas.notes && (
                <p className="text-xs text-muted-foreground">{report.komunitas.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hasil User */}
        <Card>
          <CardHeader>
            <CardTitle>Hasil User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Edit Avatar</span>
                <StatusBadge status={report.hasil_user.status} />
              </div>
              {report.hasil_user.notes && (
                <p className="text-xs text-muted-foreground">{report.hasil_user.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sertifikat */}
        <Card>
          <CardHeader>
            <CardTitle>Sertifikat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Unlock Missions</span>
                <StatusBadge status={report.sertifikat.status} />
              </div>
              {report.sertifikat.notes && (
                <p className="text-xs text-muted-foreground">{report.sertifikat.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Edit Profile</span>
                <StatusBadge status={report.user_profile.status} />
              </div>
              {report.user_profile.notes && (
                <p className="text-xs text-muted-foreground">{report.user_profile.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Report ID: {report.id}</p>
            <p>Created: {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</p>
            {report.updated_at && (
              <p>Updated: {new Date(report.updated_at).toLocaleString()}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 