import { useCallback, useEffect } from 'react'

import { getPortfolio } from '../api'
import ErrorBox from '../components/ErrorBox'
import Spinner from '../components/Spinner'
import { useApi } from '../hooks/useApi'
import AboutSection from '../sections/AboutSection'
import ContactSection from '../sections/ContactSection'
import EducationSection from '../sections/EducationSection'
import ExperienceSection from '../sections/ExperienceSection'
import HeroSection from '../sections/HeroSection'
import ProjectsPreview from '../sections/ProjectsPreview'
import SummarySection from '../sections/SummarySection'

export default function HomePage() {
  // One aggregate request for the whole page; sections receive props rather
  // than each fetching their own slice.
  const fetchPortfolio = useCallback(() => getPortfolio(), [])
  const { data, loading, error, reload } = useApi(fetchPortfolio)

  const fullName = data?.profile.full_name ?? ''
  const headline = data?.profile.headline ?? ''

  useEffect(() => {
    // Title comes from the database too, never a hardcoded string.
    const name = fullName.trim()
    if (!name) return
    document.title = headline.trim() ? `${name} — ${headline}` : name
  }, [fullName, headline])

  if (loading) return <Spinner label="Loading portfolio" />

  if (error || !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <ErrorBox message={error ?? 'Could not load the portfolio.'} onRetry={reload} />
      </div>
    )
  }

  return (
    <>
      {/* The hero sits OUTSIDE the width wrapper so its backdrop photo can
          span the full viewport. It applies the same max-width to its own
          content internally, so the text still lines up with the sections
          below. */}
      <HeroSection profile={data.profile} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <AboutSection about={data.profile.about} />
        <SummarySection summary={data.profile.summary} skills={data.skills} />
        <ExperienceSection experience={data.experience} />
        <ProjectsPreview projects={data.projects} />
        <EducationSection education={data.education} />
        <ContactSection contact={data.profile.contact} />
      </div>
    </>
  )
}
