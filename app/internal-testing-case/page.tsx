"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { StatusBadge } from "@/components/ui/status-badge"
import { submitInternalTestingCase, type InternalTestingCase } from "@/lib/supabase"
import Link from "next/link"
import { Database } from "lucide-react"

interface SectionData {
  textFeedback: string
  imageFile: File | null
  feedback: string
  status: string
}

interface TestingCaseForm {
  testName: string
  sections: Record<string, SectionData>
}

export default function InternalTestingCasePage() {
  const sections = [
    "Homepage",
    "Riwayat Catatan",
    "Tambah Catatan (flow)",
    "Tambah Catatan (Streak)",
    "Streak page",
    "Footprint INFO popup",
    "Cache emptying scenario",
    "Logout/Login scenario",
    "Uninstall scenario"
  ]

  const [form, setForm] = useState<TestingCaseForm>({
    testName: "",
    sections: sections.reduce((acc, section) => {
      acc[section] = {
        textFeedback: "",
        imageFile: null,
        feedback: "",
        status: "not-tested"
      }
      return acc
    }, {} as Record<string, SectionData>)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof TestingCaseForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSectionChange = (section: string, field: keyof SectionData, value: string | File | null) => {
    setForm(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section],
          [field]: value
        }
      }
    }))
  }

  const handleFileChange = (section: string, file: File | null) => {
    handleSectionChange(section, "imageFile", file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!form.testName.trim()) {
        toast.error("Please enter a test name")
        return
      }

      // Convert form data to the expected format
      const testCase: InternalTestingCase = {
        test_name: form.testName,
        sections: Object.fromEntries(
          Object.entries(form.sections).map(([sectionName, sectionData]) => [
            sectionName,
            {
              textFeedback: sectionData.textFeedback,
              imageFile: sectionData.imageFile,
              feedback: sectionData.feedback,
              status: sectionData.status
            }
          ])
        )
      }

      // Submit using the helper function
      const result = await submitInternalTestingCase(testCase)
      
      if (result.success) {
        toast.success("All testing cases submitted successfully!")
        
        // Reset form
        setForm({
          testName: "",
          sections: sections.reduce((acc, section) => {
            acc[section] = {
              textFeedback: "",
              imageFile: null,
              feedback: "",
              status: "not-tested"
            }
            return acc
          }, {} as Record<string, SectionData>)
        })
      } else {
        toast.error(`Failed to submit testing cases: ${result.error}`)
      }
    } catch (error) {
      toast.error("Failed to submit testing cases")
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Internal Testing Case - All Sections</CardTitle>
                <p className="text-muted-foreground">Fill out testing information for all sections in one submission</p>
              </div>
              <Link href="/internal-testing-case/data">
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Test Name */}
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  value={form.testName}
                  onChange={(e) => handleInputChange("testName", e.target.value)}
                  placeholder="Enter specific test description (e.g., 'Homepage Responsiveness Test')"
                  required
                />
              </div>

              {/* All Sections */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Test Each Section</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sections.map((section) => (
                    <Card key={section} className="border-l-4 border-l-black">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{section}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Status for this section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Status</Label>
                          <StatusBadge status={form.sections[section].status} />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleSectionChange(section, "status", "not-tested")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              form.sections[section].status === 'not-tested'
                                ? 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                            }`}
                          >
                            ○ Not Tested
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSectionChange(section, "status", "pass")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              form.sections[section].status === 'pass'
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-green-50 hover:text-green-700'
                            }`}
                          >
                            ✓ Pass
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSectionChange(section, "status", "fail")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              form.sections[section].status === 'fail'
                                ? 'bg-red-100 text-red-800 border-2 border-red-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            ✗ Fail
                          </button>
                        </div>
                      </div>

                      {/* Text Feedback for this section */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Text Feedback</Label>
                        <Textarea
                          value={form.sections[section].textFeedback}
                          onChange={(e) => handleSectionChange(section, "textFeedback", e.target.value)}
                          placeholder={`Enter text feedback for ${section}...`}
                          rows={3}
                          className="text-sm"
                        />
                      </div>

                      {/* Image File for this section */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Screenshot/Image Upload</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            handleFileChange(section, file)
                          }}
                          className="text-sm file:mr-3 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {form.sections[section].imageFile && (
                          <p className="text-xs text-muted-foreground">
                            Selected: {form.sections[section].imageFile?.name}
                          </p>
                        )}
                      </div>

                      {/* Additional Feedback for this section */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Additional Notes</Label>
                        <Textarea
                          value={form.sections[section].feedback}
                          onChange={(e) => handleSectionChange(section, "feedback", e.target.value)}
                          placeholder={`Enter additional notes for ${section}...`}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit All Testing Cases"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}