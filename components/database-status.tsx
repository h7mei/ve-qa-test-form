'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

export function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('qa_test_reports').select('count', { count: 'exact', head: true })
        setIsConnected(!error)
      } catch (error) {
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        Checking connection...
      </Badge>
    )
  }

  return (
    <Badge variant={isConnected ? "default" : "destructive"}>
      Database: {isConnected ? "Connected" : "Disconnected"}
    </Badge>
  )
}