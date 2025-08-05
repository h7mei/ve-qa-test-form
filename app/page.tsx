import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-start p-6">
      <div className="flex gap-4">
        <Link href="/full-app" className="block">
          <Card className="w-full max-w-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Full App Test</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/internal-testing-case" className="block">
          <Card className="w-full max-w-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Internal Testing Case</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
