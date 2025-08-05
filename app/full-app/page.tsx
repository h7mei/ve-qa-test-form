"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Shield, Store, Users, Award, Settings, HelpCircle, Save, Loader2, ArrowLeft } from "lucide-react"
import { supabase, type QATestReport } from "../../lib/supabase"
import { StatusBadge } from "@/components/ui/status-badge"
import Swal from 'sweetalert2'

interface TestResult {
  status: "pass" | "fail" | "not-tested"
  notes: string
}

export default function Page() {
  const [testerName, setTesterName] = useState("")
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0])
  const [applicationVersion, setApplicationVersion] = useState("v2.7.9")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const [showTutorial, setShowTutorial] = useState(true)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)

  const tutorialSteps = [
    {
      title: "Welcome to QA Testing Form",
      content:
        "This form helps you systematically test and document application features. Fill out each section as you test the corresponding features in the application.",
      highlight: "header",
    },
    {
      title: "Basic Information",
      content:
        "Start by filling in your name, test date, app version, and environment. This information will be included in your final report.",
      highlight: "basic-info",
    },
    {
      title: "Test Each Feature",
      content:
        "For each feature section, actually try the feature in the application first, then come back here to record your results.",
      highlight: "test-sections",
    },
    {
      title: "Recording Results",
      content:
        "Select 'Pass' if the feature works correctly, 'Fail' if there are issues, or 'N/T' if you haven't tested it yet. Always add notes explaining what you observed.",
      highlight: "test-item",
    },
    {
      title: "Submit Your Report",
      content:
        "Once you've completed testing, click 'Submit Report' to save your results to the database.",
      highlight: "submit-button",
    },
  ]

  // Authentication tests
  const [registerTest, setRegisterTest] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [loginTest, setLoginTest] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [forgotPasswordTest, setForgotPasswordTest] = useState<TestResult>({ status: "not-tested", notes: "" })

  // Main section tests
  const [produksiTest, setProduksiTest] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [konsumsiTest, setKonsumsiTest] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [menangahTest, setMenangahTest] = useState<TestResult>({ status: "not-tested", notes: "" })

  // Other tests
  const [misiPilahSampahTest, setMisiPilahSampahTest] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [ikutAksiTest, setIkutAksiTest] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [foodPrintTest, setFoodPrintTest] = useState<TestResult>({ status: "not-tested", notes: "" })

  interface LeaderboardTest extends TestResult {
    type: "only" | "full" | ""
  }

  const [leaderboard, setLeaderboard] = useState<LeaderboardTest>({
    status: "not-tested",
    notes: "",
    type: "",
  })
  const [toko, setToko] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [komunitas, setKomunitas] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [hasilUser, setHasilUser] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [sertifikat, setSertifikat] = useState<TestResult>({ status: "not-tested", notes: "" })
  const [userProfile, setUserProfile] = useState<TestResult>({ status: "not-tested", notes: "" })

  // Stable handlers for CompactTestItem
  const handleRegisterStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setRegisterTest(prev => ({ ...prev, status })), [])
  const handleRegisterNotesChange = useCallback((notes: string) => setRegisterTest(prev => ({ ...prev, notes })), [])

  const handleLoginStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setLoginTest(prev => ({ ...prev, status })), [])
  const handleLoginNotesChange = useCallback((notes: string) => setLoginTest(prev => ({ ...prev, notes })), [])

  const handleForgotPasswordStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setForgotPasswordTest(prev => ({ ...prev, status })), [])
  const handleForgotPasswordNotesChange = useCallback((notes: string) => setForgotPasswordTest(prev => ({ ...prev, notes })), [])

  const handleProduksiStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setProduksiTest(prev => ({ ...prev, status })), [])
  const handleProduksiNotesChange = useCallback((notes: string) => setProduksiTest(prev => ({ ...prev, notes })), [])

  const handleKonsumsiStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setKonsumsiTest(prev => ({ ...prev, status })), [])
  const handleKonsumsiNotesChange = useCallback((notes: string) => setKonsumsiTest(prev => ({ ...prev, notes })), [])

  const handleMenangahStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setMenangahTest(prev => ({ ...prev, status })), [])
  const handleMenangahNotesChange = useCallback((notes: string) => setMenangahTest(prev => ({ ...prev, notes })), [])

  const handleMisiPilahSampahStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setMisiPilahSampahTest(prev => ({ ...prev, status })), [])
  const handleMisiPilahSampahNotesChange = useCallback((notes: string) => setMisiPilahSampahTest(prev => ({ ...prev, notes })), [])

  const handleIkutAksiStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setIkutAksiTest(prev => ({ ...prev, status })), [])
  const handleIkutAksiNotesChange = useCallback((notes: string) => setIkutAksiTest(prev => ({ ...prev, notes })), [])

  const handleFoodPrintStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setFoodPrintTest(prev => ({ ...prev, status })), [])
  const handleFoodPrintNotesChange = useCallback((notes: string) => setFoodPrintTest(prev => ({ ...prev, notes })), [])

  const handleTokoStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setToko(prev => ({ ...prev, status })), [])
  const handleTokoNotesChange = useCallback((notes: string) => setToko(prev => ({ ...prev, notes })), [])

  const handleKomunitasStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setKomunitas(prev => ({ ...prev, status })), [])
  const handleKomunitasNotesChange = useCallback((notes: string) => setKomunitas(prev => ({ ...prev, notes })), [])

  const handleHasilUserStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setHasilUser(prev => ({ ...prev, status })), [])
  const handleHasilUserNotesChange = useCallback((notes: string) => setHasilUser(prev => ({ ...prev, notes })), [])

  const handleSertifikatStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setSertifikat(prev => ({ ...prev, status })), [])
  const handleSertifikatNotesChange = useCallback((notes: string) => setSertifikat(prev => ({ ...prev, notes })), [])

  const handleUserProfileStatusChange = useCallback((status: 'pass' | 'fail' | 'not-tested') => setUserProfile(prev => ({ ...prev, status })), [])
  const handleUserProfileNotesChange = useCallback((notes: string) => setUserProfile(prev => ({ ...prev, notes })), [])

  const updateTestResult = <T extends TestResult>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T,
    value: string,
  ) => {
    setter((prev) => ({ ...prev, [key]: value }))
  }

  const validateForm = () => {
    if (!testerName.trim()) {
      setSubmitMessage("Please enter tester name")
      return false
    }
    if (!testDate) {
      setSubmitMessage("Please select test date")
      return false
    }
    if (!applicationVersion.trim()) {
      setSubmitMessage("Please enter application version")
      return false
    }

    // Check if all test sections have at least one field filled
    const allTests = [
      registerTest,
      loginTest,
      forgotPasswordTest,
      produksiTest,
      konsumsiTest,
      menangahTest,
      misiPilahSampahTest,
      ikutAksiTest,
      foodPrintTest,
      leaderboard,
      toko,
      komunitas,
      hasilUser,
      sertifikat,
      userProfile,
    ]
    const hasAnyTesting = allTests.some((test) => test.status !== "not-tested" || test.notes.trim() !== "")

    if (!hasAnyTesting) {
      setSubmitMessage("Please complete at least one test section")
      return false
    }

    return true
  }

  const resetForm = () => {
    setTesterName("")
    setTestDate(new Date().toISOString().split('T')[0])
    setApplicationVersion("v2.7.9")
    setSubmitMessage("")
    setShowTutorial(false)
    setCurrentTutorialStep(0)
    setHasInteracted(false)

    // Reset all test results
    setRegisterTest({ status: "not-tested", notes: "" })
    setLoginTest({ status: "not-tested", notes: "" })
    setForgotPasswordTest({ status: "not-tested", notes: "" })
    setProduksiTest({ status: "not-tested", notes: "" })
    setKonsumsiTest({ status: "not-tested", notes: "" })
    setMenangahTest({ status: "not-tested", notes: "" })
    setMisiPilahSampahTest({ status: "not-tested", notes: "" })
    setIkutAksiTest({ status: "not-tested", notes: "" })
    setFoodPrintTest({ status: "not-tested", notes: "" })
    setLeaderboard({ status: "not-tested", notes: "", type: "" })
    setToko({ status: "not-tested", notes: "" })
    setKomunitas({ status: "not-tested", notes: "" })
    setHasilUser({ status: "not-tested", notes: "" })
    setSertifikat({ status: "not-tested", notes: "" })
    setUserProfile({ status: "not-tested", notes: "" })
  }



  const submitToSupabase = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const reportData: Omit<QATestReport, "id" | "created_at" | "updated_at"> = {
        tester_name: testerName.trim(),
        test_date: testDate,
        application_version: applicationVersion.trim(),
        auth_tests: {
          register: registerTest,
          login: loginTest,
          forgotPassword: forgotPasswordTest,
        },
        main_section_tests: {
          produksi: produksiTest,
          konsumsi: konsumsiTest,
          menangah: menangahTest,
        },
        side_mission_tests: {
          misiPilahSampah: misiPilahSampahTest,
          ikutAksi: ikutAksiTest,
        },
        food_print_tests: foodPrintTest,
        leaderboard,
        toko,
        komunitas,
        hasil_user: hasilUser,
        sertifikat,
        user_profile: userProfile,
      }

      const { data, error } = await supabase.from("qa_test_reports").insert([reportData]).select()

      if (error) {
        throw error
      }

      // Show success alert with SweetAlert2
      await Swal.fire({
        title: 'Success!',
        text: 'Report submitted successfully!',
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

      // Reset form after successful submission
      resetForm()
      console.log("Report saved:", data)
    } catch (error) {
      console.error("Error submitting report:", error)
      
      // Show error alert with SweetAlert2
      await Swal.fire({
        title: 'Error!',
        text: 'Error submitting report. Please try again.',
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitToSupabase()
  }

  const handleFieldInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
  }

  const CompactTestItem = ({
    label,
    status,
    notes,
    onStatusChange,
    onNotesChange,
  }: {
    label: string
    status: string
    notes: string
    onStatusChange: (status: 'pass' | 'fail' | 'not-tested') => void
    onNotesChange: (notes: string) => void
  }) => {
    // Keep textarea value locally so typing doesn't trigger a full page re-render on every keystroke.
    const [localNotes, setLocalNotes] = React.useState(notes)
    // If the parent pushes a different notes value (e.g. when resetting the form) sync it.
    React.useEffect(() => {
      setLocalNotes(notes)
    }, [notes])

    const sanitizeId = (label: string) => label.replace(/\s+/g, '-').toLowerCase();
    // Uncomment for debug:
    // console.log('Rendering:', label);
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium" htmlFor={`${sanitizeId(label)}-notes`}>{label}</Label>
            <div className="flex gap-2 text-sm">
              <StatusBadge status={status} />
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                handleFieldInteraction()
                onStatusChange('pass')
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                status === 'pass'
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              ✓ Pass
            </button>
            <button
              type="button"
              onClick={() => {
                handleFieldInteraction()
                onStatusChange('fail')
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                status === 'fail'
                  ? 'bg-red-100 text-red-800 border-2 border-red-300'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              ✗ Fail
            </button>
            <button
              type="button"
              onClick={() => {
                handleFieldInteraction()
                onStatusChange('not-tested')
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                status === 'not-tested'
                  ? 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              ○ N/T
            </button>
          </div>

          <Textarea
            id={`${sanitizeId(label)}-notes`}
            name={`${sanitizeId(label)}-notes`}
            placeholder="Notes..."
            value={localNotes}
            onChange={(e) => {
              setLocalNotes(e.target.value)
            }}
            // Propagate the value to the parent only when the user leaves the field.
            onBlur={() => {
              handleFieldInteraction()
              if (localNotes !== notes) {
                onNotesChange(localNotes)
              }
            }}
            className="text-sm resize-none"
            rows={2}
          />
        </CardContent>
      </Card>
    )
  }

  const MemoizedCompactTestItem = React.memo(CompactTestItem)

  // Separate component so we can use hooks while keeping Leaderboard notes local.
  const LeaderboardNotes: React.FC = () => {
    const [localNotes, setLocalNotes] = React.useState(leaderboard.notes)

    React.useEffect(() => {
      setLocalNotes(leaderboard.notes)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leaderboard.notes])

    return (
      <Textarea
        id="leaderboard-notes"
        name="leaderboard-notes"
        placeholder="Notes..."
        value={localNotes}
        onChange={(e) => setLocalNotes(e.target.value)}
        onBlur={() => {
          handleFieldInteraction()
          if (localNotes !== leaderboard.notes) {
            updateTestResult(setLeaderboard, "notes", localNotes)
          }
        }}
        className="text-sm resize-none"
        rows={2}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Quality Assurance Test Report</h1>
              <p className="text-muted-foreground">Application Testing Validation Form</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Information */}
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>Basic information about the test session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testerName">Tester Name *</Label>
                  <Input
                    id="testerName"
                    name="testerName"
                    value={testerName}
                    onChange={(e) => {
                      handleFieldInteraction()
                      setTesterName(e.target.value)
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testDate">Test Date *</Label>
                  <Input
                    id="testDate"
                    name="testDate"
                    type="date"
                    value={testDate}
                    onChange={(e) => {
                      handleFieldInteraction()
                      setTestDate(e.target.value)
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationVersion">App Version *</Label>
                  <Input
                    id="applicationVersion"
                    name="applicationVersion"
                    value={applicationVersion}
                    onChange={(e) => {
                      handleFieldInteraction()
                      setApplicationVersion(e.target.value)
                    }}
                    placeholder="v1.0.0"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MemoizedCompactTestItem
                    label="User Registration"
                    status={registerTest.status}
                    notes={registerTest.notes}
                    onStatusChange={handleRegisterStatusChange}
                    onNotesChange={handleRegisterNotesChange}
                  />
                  <MemoizedCompactTestItem
                    label="User Login"
                    status={loginTest.status}
                    notes={loginTest.notes}
                    onStatusChange={handleLoginStatusChange}
                    onNotesChange={handleLoginNotesChange}
                  />
                  <MemoizedCompactTestItem
                    label="Forgot Password"
                    status={forgotPasswordTest.status}
                    notes={forgotPasswordTest.notes}
                    onStatusChange={handleForgotPasswordStatusChange}
                    onNotesChange={handleForgotPasswordNotesChange}
                  />
                </CardContent>
              </Card>

              {/* Main Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Main Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MemoizedCompactTestItem
                    label="Produksi"
                    status={produksiTest.status}
                    notes={produksiTest.notes}
                    onStatusChange={handleProduksiStatusChange}
                    onNotesChange={handleProduksiNotesChange}
                  />
                  <MemoizedCompactTestItem
                    label="Konsumsi"
                    status={konsumsiTest.status}
                    notes={konsumsiTest.notes}
                    onStatusChange={handleKonsumsiStatusChange}
                    onNotesChange={handleKonsumsiNotesChange}
                  />
                  <MemoizedCompactTestItem
                    label="Menangah"
                    status={menangahTest.status}
                    notes={menangahTest.notes}
                    onStatusChange={handleMenangahStatusChange}
                    onNotesChange={handleMenangahNotesChange}
                  />
                </CardContent>
              </Card>

              {/* Side Mission */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Side Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MemoizedCompactTestItem
                    label="Misi Pilah Sampah"
                    status={misiPilahSampahTest.status}
                    notes={misiPilahSampahTest.notes}
                    onStatusChange={handleMisiPilahSampahStatusChange}
                    onNotesChange={handleMisiPilahSampahNotesChange}
                  />
                  <MemoizedCompactTestItem
                    label="Ikut Aksi"
                    status={ikutAksiTest.status}
                    notes={ikutAksiTest.notes}
                    onStatusChange={handleIkutAksiStatusChange}
                    onNotesChange={handleIkutAksiNotesChange}
                  />
                </CardContent>
              </Card>

              {/* FoodPrint */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    FoodPrint
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MemoizedCompactTestItem
                    label="FoodPrint Feature"
                    status={foodPrintTest.status}
                    notes={foodPrintTest.notes}
                    onStatusChange={handleFoodPrintStatusChange}
                    onNotesChange={handleFoodPrintNotesChange}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">Leaderboard Display</Label>
                      <StatusBadge status={leaderboard.status} />
                    </div>

                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldInteraction()
                          updateTestResult(setLeaderboard, "status", "pass")
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          leaderboard.status === 'pass'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-green-50 hover:text-green-700'
                        }`}
                      >
                        ✓ Pass
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldInteraction()
                          updateTestResult(setLeaderboard, "status", "fail")
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          leaderboard.status === 'fail'
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        ✗ Fail
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldInteraction()
                          updateTestResult(setLeaderboard, "status", "not-tested")
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          leaderboard.status === 'not-tested'
                            ? 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                            : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        ○ N/T
                      </button>
                    </div>

                    <LeaderboardNotes />
                  </div>
                </CardContent>
              </Card>

              {/* Toko */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Toko (Store)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MemoizedCompactTestItem
                    label="Listing All Data → Purchase Items"
                    status={toko.status}
                    notes={toko.notes}
                    onStatusChange={handleTokoStatusChange}
                    onNotesChange={handleTokoNotesChange}
                  />
                </CardContent>
              </Card>

              {/* Komunitas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Komunitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MemoizedCompactTestItem
                    label="Render Properly"
                    status={komunitas.status}
                    notes={komunitas.notes}
                    onStatusChange={handleKomunitasStatusChange}
                    onNotesChange={handleKomunitasNotesChange}
                  />
                </CardContent>
              </Card>

              {/* Hasil User */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Hasil User
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MemoizedCompactTestItem
                    label="Edit Avatar"
                    status={hasilUser.status}
                    notes={hasilUser.notes}
                    onStatusChange={handleHasilUserStatusChange}
                    onNotesChange={handleHasilUserNotesChange}
                  />
                </CardContent>
              </Card>

              {/* Sertifikat */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Sertifikat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MemoizedCompactTestItem
                    label="Sertifikat Unlock All Missions"
                    status={sertifikat.status}
                    notes={sertifikat.notes}
                    onStatusChange={handleSertifikatStatusChange}
                    onNotesChange={handleSertifikatNotesChange}
                  />
                </CardContent>
              </Card>

              {/* User Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MemoizedCompactTestItem
                    label="Edit User Profile"
                    status={userProfile.status}
                    notes={userProfile.notes}
                    onStatusChange={handleUserProfileStatusChange}
                    onNotesChange={handleUserProfileNotesChange}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                {submitMessage && (
                  <Alert className={submitMessage.includes("Error") ? "border-destructive" : "border-green-500"}>
                    <AlertDescription className={submitMessage.includes("Error") ? "text-destructive" : "text-green-600"}>
                      {submitMessage}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 text-lg">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center">
                {tutorialSteps[currentTutorialStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {tutorialSteps[currentTutorialStep].content}
              </p>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowTutorial(false)}
                  size="sm"
                >
                  Skip Tutorial
                </Button>
                
                <div className="flex gap-2">
                  {currentTutorialStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTutorialStep(prev => prev - 1)}
                      size="sm"
                    >
                      Previous
                    </Button>
                  )}
                  
                  {currentTutorialStep < tutorialSteps.length - 1 ? (
                    <Button
                      onClick={() => setCurrentTutorialStep(prev => prev + 1)}
                      size="sm"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowTutorial(false)}
                      size="sm"
                    >
                      Finish
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 