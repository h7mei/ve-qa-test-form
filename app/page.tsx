"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { User, Shield, Store, Users, Award, Settings, HelpCircle, Save, Loader2 } from "lucide-react"
import { supabase, type QATestReport } from "../lib/supabase"

interface TestResult {
  status: "pass" | "fail" | "not-tested"
  notes: string
}

export default function Page() {
  const formRef = useRef<HTMLDivElement>(null)
  const [testerName, setTesterName] = useState("")
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0])
  const [applicationVersion, setApplicationVersion] = useState("v2.7.8")
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

  const updateGroupTestResult = <T extends Record<string, TestResult>>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    field: string,
    key: keyof TestResult,
    value: string,
  ) => {
    setter((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }))
  }

  const getStatusSymbol = (status: string) => {
    switch (status) {
      case "pass":
        return "✓"
      case "fail":
        return "✗"
      default:
        return "○"
    }
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

  const submitToSupabase = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const reportData: Omit<QATestReport, "id" | "created_at" | "updated_at"> = {
        tester_name: testerName.trim(),
        test_date: testDate,
        application_version: applicationVersion.trim(),
        test_environment: "Default",
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

      setSubmitMessage("Report submitted successfully!")
      console.log("Report saved:", data)
    } catch (error) {
      console.error("Error submitting report:", error)
      setSubmitMessage("Error submitting report. Please try again.")
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
      <div className="mb-4 p-3 border border-gray-300 rounded">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium text-gray-800" htmlFor={`${sanitizeId(label)}-notes`}>{label}</Label>
          <div className="flex gap-2 text-sm">
            <span
              className={`px-2 py-1 rounded text-xs ${status === "pass"
                ? "bg-green-100 text-green-800"
                : status === "fail"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              {getStatusSymbol(status)} {status.toUpperCase()}
            </span>
          </div>
        </div>

        <RadioGroup
          value={status}
          onValueChange={(value) => {
            handleFieldInteraction()
            onStatusChange(value as 'pass' | 'fail' | 'not-tested')
          }}
          className="flex gap-4 mb-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="pass" id={`${sanitizeId(label)}-pass`} className="h-3 w-3" />
            <Label htmlFor={`${sanitizeId(label)}-pass`} className="text-xs">
              Pass
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="fail" id={`${sanitizeId(label)}-fail`} className="h-3 w-3" />
            <Label htmlFor={`${sanitizeId(label)}-fail`} className="text-xs">
              Fail
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="not-tested" id={`${sanitizeId(label)}-not-tested`} className="h-3 w-3" />
            <Label htmlFor={`${sanitizeId(label)}-not-tested`} className="text-xs">
              N/T
            </Label>
          </div>
        </RadioGroup>

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
          className="text-xs h-16 resize-none"
          rows={2}
        />
      </div>
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
        className="text-xs h-16 resize-none"
        rows={2}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-6 max-w-full">
        {/* Action Buttons Removed */}

        {/* Form Content */}
        <div ref={formRef} className="bg-white shadow-lg rounded-lg" style={{ minHeight: "100vh", padding: "2rem" }}>
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">QUALITY ASSURANCE TEST REPORT</h1>
            <p className="text-sm text-gray-600">Application Testing Validation Form</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Information - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="testerName" className="text-xs font-semibold text-gray-700">TESTER NAME *</Label>
                <Input
                  id="testerName"
                  name="testerName"
                  value={testerName}
                  onChange={(e) => {
                    handleFieldInteraction()
                    setTesterName(e.target.value)
                  }}
                  className="text-sm h-8 mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="testDate" className="text-xs font-semibold text-gray-700">TEST DATE *</Label>
                <Input
                  id="testDate"
                  name="testDate"
                  type="date"
                  value={testDate}
                  onChange={(e) => {
                    handleFieldInteraction()
                    setTestDate(e.target.value)
                  }}
                  className="text-sm h-8 mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="applicationVersion" className="text-xs font-semibold text-gray-700">APP VERSION *</Label>
                <Input
                  id="applicationVersion"
                  name="applicationVersion"
                  value={applicationVersion}
                  onChange={(e) => {
                    handleFieldInteraction()
                    setApplicationVersion(e.target.value)
                  }}
                  className="text-sm h-8 mt-1 bg-gray-100"
                  placeholder="v1.0.0"
                  required
                  readOnly
                />
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Authentication */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    AUTHENTICATION
                  </h3>
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
                </div>

                {/* Main Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    MAIN SECTION
                  </h3>
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
                </div>

                {/* Side Mission */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    SIDE MISSION
                  </h3>
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
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Leaderboard */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    LEADERBOARD
                  </h3>
                  <div className="mb-4 p-3 border border-gray-300 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-800">Leaderboard Display</Label>
                      <div className="flex gap-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${leaderboard.status === "pass"
                            ? "bg-green-100 text-green-800"
                            : leaderboard.status === "fail"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {getStatusSymbol(leaderboard.status)} {leaderboard.status.toUpperCase()}
                        </span>
                      </div>
                    </div>



                    <RadioGroup
                      value={leaderboard.status}
                      onValueChange={(status) => {
                        handleFieldInteraction()
                        updateTestResult(setLeaderboard, "status", status)
                      }}
                      className="flex gap-4 mb-2"
                      id="leaderboard-status"
                      name="leaderboard-status"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="pass" id="leaderboard-pass" className="h-3 w-3" />
                        <Label htmlFor="leaderboard-pass" className="text-xs">
                          Pass
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="fail" id="leaderboard-fail" className="h-3 w-3" />
                        <Label htmlFor="leaderboard-fail" className="text-xs">
                          Fail
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="not-tested" id="leaderboard-not-tested" className="h-3 w-3" />
                        <Label htmlFor="leaderboard-not-tested" className="text-xs">
                          N/T
                        </Label>
                      </div>
                    </RadioGroup>

                    <LeaderboardNotes />
                  </div>
                </div>

                {/* Toko */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    TOKO (STORE)
                  </h3>
                  <MemoizedCompactTestItem
                    label="Listing All Data → Purchase Items"
                    status={toko.status}
                    notes={toko.notes}
                    onStatusChange={handleTokoStatusChange}
                    onNotesChange={handleTokoNotesChange}
                  />
                </div>

                {/* Komunitas */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    KOMUNITAS
                  </h3>
                  <MemoizedCompactTestItem
                    label="Render Properly"
                    status={komunitas.status}
                    notes={komunitas.notes}
                    onStatusChange={handleKomunitasStatusChange}
                    onNotesChange={handleKomunitasNotesChange}
                  />
                </div>

                {/* Hasil User */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    HASIL USER
                  </h3>
                  <MemoizedCompactTestItem
                    label="Edit Avatar"
                    status={hasilUser.status}
                    notes={hasilUser.notes}
                    onStatusChange={handleHasilUserStatusChange}
                    onNotesChange={handleHasilUserNotesChange}
                  />
                </div>

                {/* Sertifikat */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    SERTIFIKAT
                  </h3>
                  <MemoizedCompactTestItem
                    label="Sertifikat Unlock All Missions"
                    status={sertifikat.status}
                    notes={sertifikat.notes}
                    onStatusChange={handleSertifikatStatusChange}
                    onNotesChange={handleSertifikatNotesChange}
                  />
                </div>

                {/* User Profile */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    USER PROFILE
                  </h3>
                  <MemoizedCompactTestItem
                    label="Edit User Profile"
                    status={userProfile.status}
                    notes={userProfile.notes}
                    onStatusChange={handleUserProfileStatusChange}
                    onNotesChange={handleUserProfileNotesChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="mt-8 pt-6 border-t-2 border-gray-800">
              <div className="flex flex-col items-center gap-4">
                {submitMessage && (
                  <div
                    className={`text-sm font-medium ${submitMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}
                  >
                    {submitMessage}
                  </div>
                )}
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
          </form>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {tutorialSteps[currentTutorialStep].title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {tutorialSteps[currentTutorialStep].content}
              </p>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowTutorial(false)}
                  className="text-sm"
                >
                  Skip Tutorial
                </Button>
                
                <div className="flex gap-2">
                  {currentTutorialStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTutorialStep(prev => prev - 1)}
                      className="text-sm"
                    >
                      Previous
                    </Button>
                  )}
                  
                  {currentTutorialStep < tutorialSteps.length - 1 ? (
                    <Button
                      onClick={() => setCurrentTutorialStep(prev => prev + 1)}
                      className="text-sm"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowTutorial(false)}
                      className="text-sm"
                    >
                      Finish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
