import { API } from '@/lib'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useAuth(redirectTo: string = '/login') {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    API.get('/api/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => router.push(redirectTo))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}


/*
export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  return <div>Welcome {user?.username}</div>
}

*/