import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'pass':
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">✓ PASS</Badge>
    case 'fail':
      return <Badge variant="destructive" className="text-white">✗ FAIL</Badge>
    case 'not-tested':
      return <Badge variant="secondary">○ N/T</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
} 