import { useCallback } from 'react'
import { Outlet } from 'react-router'

import { getProfile } from './api'
import Footer from './components/Footer'
import Nav from './components/Nav'
import ScrollToHash from './components/ScrollToHash'
import { useApi } from './hooks/useApi'

/**
 * Public layout shell: nav + page + footer.
 *
 * The admin route sits OUTSIDE this layout (see main.tsx), so it renders with
 * no nav and no footer - a standalone screen with no link back into it.
 */
export default function App() {
  const fetchProfile = useCallback(() => getProfile(), [])
  const { data: profile } = useApi(fetchProfile)

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToHash />
      <Nav fullName={profile?.full_name ?? ''} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer profile={profile} />
    </div>
  )
}
