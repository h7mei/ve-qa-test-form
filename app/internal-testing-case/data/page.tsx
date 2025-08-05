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
import { supabase, type InternalTestingCase } from "../../../lib/supabase"
import Link from "next/link"
import { StatusBadge } from "@/components/ui/status-badge"

export default function InternalTestingDataPage() {
  const [reports, setReports] = useState<InternalTestingCase[]>([])
  const [filteredReports, setFilteredReports] = useState<InternalTestingCase[]>([])
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
        .from('internal_testing_cases')
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
        report.test_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReports(filtered)
  }

  const getTestSummary = (report: InternalTestingCase) => {
    const sections = Object.values(report.sections)
    const passed = sections.filter(section => section.status === 'pass').length
    const failed = sections.filter(section => section.status === 'fail').length
    const notTested = sections.filter(section => section.status === 'not-tested').length
    
    return { passed, failed, notTested, total: sections.length }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    const headers = [
      'ID', 'Test Name', 'Total Sections', 'Passed', 'Failed', 'Not Tested', 'Created At'
    ]
    
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(report => {
        const summary = getTestSummary(report)
        return [
          report.id,
          `"${report.test_name}"`,
          summary.total,
          summary.passed,
          summary.failed,
          summary.notTested,
          report.created_at
        ].join(',')
      })
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `internal-testing-reports-${new Date().toISOString().split('T')[0]}.csv`
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
          <Link href="/internal-testing-case" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Internal Testing Form
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Internal Testing Reports</h1>
            <p className="text-muted-foreground">View and manage all submitted internal testing case reports</p>
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
                  if (!report.created_at) return false
                  const reportDate = new Date(report.created_at)
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
                  if (!report.created_at) return false
                  const reportDate = new Date(report.created_at)
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                    <th className="text-left p-4 font-medium">Test Name</th>
                    <th className="text-left p-4 font-medium">Test Summary</th>
                    <th className="text-left p-4 font-medium">Created At</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const summary = getTestSummary(report)
                    return (
                      <tr key={report.id} className="border-t hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-medium">{report.test_name}</div>
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
                        <td className="p-4 text-sm text-muted-foreground">
                          {report.created_at ? formatDate(report.created_at) : 'N/A'}
                        </td>
                        <td className="p-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Internal Testing Report Details</DialogTitle>
                                <DialogDescription>
                                  Detailed view of {report.test_name}
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
function ReportDetails({ report }: { report: InternalTestingCase }) {
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
              <div className="text-sm font-medium text-muted-foreground">Test Name</div>
              <p className="text-sm">{report.test_name}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created At</div>
              <p className="text-sm">{report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Sections</div>
              <p className="text-sm">{Object.keys(report.sections).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(report.sections).map(([sectionName, sectionData]) => (
          <Card key={sectionName}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {sectionName}
                <StatusBadge status={sectionData.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sectionData.textFeedback && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Text Feedback</div>
                  <p className="text-sm bg-muted/50 p-2 rounded">{sectionData.textFeedback}</p>
                </div>
              )}
              
              {sectionData.imageUrl && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Screenshot</div>
                  <img 
                    src={sectionData.imageUrl} 
                    alt={`Screenshot for ${sectionName}`}
                    className="max-w-full h-auto rounded border"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
              
              {sectionData.feedback && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</div>
                  <p className="text-sm bg-muted/50 p-2 rounded">{sectionData.feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}