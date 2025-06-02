import { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { database } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export function useAdmin() {
  const { currentUser } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!currentUser) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const adminRef = ref(database, `admin/${currentUser.uid}`)
        const snapshot = await get(adminRef)
        setIsAdmin(snapshot.exists() && snapshot.val().role === 'admin')
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [currentUser])

  return { isAdmin, loading }
}