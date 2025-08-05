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
import Swal from 'sweetalert2'

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

interface SectionConfig {
  id: string
  title: string
  instructions: string[]
}

const SECTIONS_CONFIG: SectionConfig[] = [
  {
    id: "homepage",
    title: "Beranda / Homepage",
    instructions: [
      "Periksa tampilan bagian WFC (waste footprint calculator) terlihat normal"
    ]
  },
  {
    id: "riwayat-catatan",
    title: "Riwayat Catatan / Record History",
    instructions: [
      "Periksa jika kosong (jika belum ada input), terisi dengan benar (jika sudah ada input)",
      "Periksa filter berfungsi dengan baik untuk input yang dibuat pada tanggal berbeda"
    ]
  },
  {
    id: "tambah-catatan-flow",
    title: "Tambah Catatan (alur) / Add Record (flow)",
    instructions: [
      "Klik pada Tambah Catatan memicu popup panduan",
      "Cari \"UHT\" dan \"123\" di bilah pencarian dan uji apakah hasil muncul dengan benar",
      "Tambahkan item dan periksa apakah berat bertambah dengan benar",
      "Kembali sebelum mengirimkan data, periksa perilaku",
      "Kembali setelah mengirimkan data, periksa perilaku, maju ke depan, lihat apakah submit hanya sekali atau setiap kali"
    ]
  },
  {
    id: "tambah-catatan-streak",
    title: "Tambah Catatan (Streak) / Add Record (Streak)",
    instructions: [
      "Dapatkan Streak 1, periksa apakah hadiah diterapkan",
      "Dapatkan Streak 2, periksa apakah hadiah diterapkan",
      "Dapatkan Streak 3, periksa apakah hadiah diterapkan",
      "Dapatkan Streak 4, periksa apakah hadiah diterapkan"
    ]
  },
  {
    id: "streak-page",
    title: "Halaman Streak / Streak Page",
    instructions: [
      "Tekan gambar Streak, periksa apakah halaman sesuai dengan streak saat ini"
    ]
  },
  {
    id: "footprint-info-popup",
    title: "Popup Info Jejak Karbon / Footprint Info Popup",
    instructions: [
      "Pelajari lebih lanjut tentang WFC dan streak di popup Info"
    ]
  },
  {
    id: "cache-emptying-scenario",
    title: "Skenario Pengosongan Cache / Cache Emptying Scenario",
    instructions: [
      "Kosongkan cache dan periksa Riwayat catatan"
    ]
  },
  {
    id: "logout-login-scenario",
    title: "Skenario Logout/Login / Logout/Login Scenario",
    instructions: [
      "Logout dan login lagi, periksa Riwayat catatan"
    ]
  },
  {
    id: "uninstall-scenario",
    title: "Skenario Uninstall / Uninstall Scenario",
    instructions: [
      "Uninstall dan install ulang SampApp, periksa Riwayat Catatan"
    ]
  }
]

export default function InternalTestingCasePage() {
  const [form, setForm] = useState<TestingCaseForm>({
    testName: "",
    sections: SECTIONS_CONFIG.reduce((acc, section) => {
      acc[section.title] = {
        textFeedback: "",
        imageFile: null,
        feedback: "",
        status: "not-tested"
      }
      return acc
    }, {} as Record<string, SectionData>)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setForm({
      testName: "",
      sections: SECTIONS_CONFIG.reduce((acc, section) => {
        acc[section.title] = {
          textFeedback: "",
          imageFile: null,
          feedback: "",
          status: "not-tested"
        }
        return acc
      }, {} as Record<string, SectionData>)
    })
  }



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
        // Show success alert with SweetAlert2
        await Swal.fire({
          title: 'Success!',
          text: 'All testing cases submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          background: '#ffffff',
          color: '#000000',
          confirmButtonColor: '#000000',
          customClass: {
            popup: 'swal2-custom-popup',
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-content',
            confirmButton: 'swal2-custom-confirm'
          }
        })
        
        // Reset form
        resetForm()
      } else {
        // Show error alert with SweetAlert2
        await Swal.fire({
          title: 'Error!',
          text: `Failed to submit testing cases: ${result.error}`,
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#ffffff',
          color: '#000000',
          confirmButtonColor: '#000000',
          customClass: {
            popup: 'swal2-custom-popup',
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-content',
            confirmButton: 'swal2-custom-confirm'
          }
        })
      }
    } catch (error) {
      // Show error alert with SweetAlert2
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to submit testing cases',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        color: '#000000',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'swal2-custom-popup',
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-content',
          confirmButton: 'swal2-custom-confirm'
        }
      })
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
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Test Name */}
              <div className="space-y-2">
                <Label htmlFor="testName">Tester Name</Label>
                <Input
                  id="testName"
                  value={form.testName}
                  onChange={(e) => handleInputChange("testName", e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* All Sections */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Test Each Section</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {SECTIONS_CONFIG.map((sectionConfig) => (
                    <Card key={sectionConfig.id} className="border-l-4 border-l-black">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {sectionConfig.title.includes(' / ') ? (
                          <>
                            {sectionConfig.title.split(' / ')[0]} / <span className="italic">{sectionConfig.title.split(' / ')[1]}</span>
                          </>
                        ) : (
                          sectionConfig.title
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Tutor/Guide text for each section */}
                      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-md">
                        <h4 className="font-medium text-gray-900 mb-2">Testing Instructions:</h4>
                        <div className="text-sm text-gray-800 space-y-1">
                          {sectionConfig.instructions.map((instruction, index) => (
                            <p key={index}>• {instruction}</p>
                          ))}
                        </div>
                      </div>

                      {/* Status for this section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Status</Label>
                          <StatusBadge status={form.sections[sectionConfig.title].status} />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleSectionChange(sectionConfig.title, "status", "not-tested")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              form.sections[sectionConfig.title].status === 'not-tested'
                                ? 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                            }`}
                          >
                            ○ Not Tested
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSectionChange(sectionConfig.title, "status", "pass")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              form.sections[sectionConfig.title].status === 'pass'
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-green-50 hover:text-green-700'
                            }`}
                          >
                            ✓ Pass
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSectionChange(sectionConfig.title, "status", "fail")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              form.sections[sectionConfig.title].status === 'fail'
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
                          value={form.sections[sectionConfig.title].textFeedback}
                          onChange={(e) => handleSectionChange(sectionConfig.title, "textFeedback", e.target.value)}
                          placeholder={`Enter text feedback for ${sectionConfig.title}...`}
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
                            handleFileChange(sectionConfig.title, file)
                          }}
                          className="text-sm file:mr-3 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {form.sections[sectionConfig.title].imageFile && (
                          <p className="text-xs text-muted-foreground">
                            Selected: {form.sections[sectionConfig.title].imageFile?.name}
                          </p>
                        )}
                      </div>

                      {/* Additional Feedback for this section */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Additional Notes</Label>
                        <Textarea
                          value={form.sections[sectionConfig.title].feedback}
                          onChange={(e) => handleSectionChange(sectionConfig.title, "feedback", e.target.value)}
                          placeholder={`Enter additional notes for ${sectionConfig.title}...`}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit All Testing Cases"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}