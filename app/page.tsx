import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { DatabaseStatus } from "@/components/database-status"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-6">
          <DatabaseStatus />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
          <Link href="/full-app" className="block flex-1 max-w-md">
            <Card className="w-full h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl">Full App Test</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/internal-testing-case" className="block flex-1 max-w-md">
            <Card className="w-full h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl">Internal Testing Case</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
