import { fileUrl, resumeDownloadUrl } from '../api'
import { useReveal } from '../hooks/useReveal'
import type { Profile } from '../types'

interface HeroSectionProps {
  profile: Profile
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const ref = useReveal<HTMLDivElement>()
  const photo = fileUrl(profile.photo_url)
  const name = profile.full_name.trim()

  return (
    // `isolate` creates a stacking context, so the -z-10 backdrop layers stay
    // behind this section's content without slipping under the page itself.
    <section className="relative isolate overflow-hidden border-b border-ink-800/60">
      {/* Decorative backdrop, in two layers:
          1. the dimmed photo (per-theme opacity lives in index.css)
          2. a gradient wash that fades to the page colour at the bottom, so
             the banner blends into the next section and the text stays
             readable over bright areas of the photo.
          `to-ink-950` is the page background in BOTH themes - the token flips
          with the theme - so a single gradient covers light and dark. */}
      <div aria-hidden="true" className="hero-photo absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/75 via-ink-950/88 to-ink-950"
      />

      <div className="mx-auto max-w-5xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20">
        {/* Mobile: single centred column with a large photo.
            sm and up: photo beside the text, left-aligned. */}
        <div
          ref={ref}
          className="reveal flex flex-col items-center gap-7 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left"
        >
          {/* Photo, or an initials avatar derived from the name - never a
              bundled placeholder image. */}
          <div className="shrink-0">
            {photo ? (
              <img
                src={photo}
                alt={name ? `Portrait of ${name}` : 'Profile photo'}
                width={192}
                height={192}
                className="size-44 rounded-2xl object-cover ring-2 ring-accent-500/70 ring-offset-4 ring-offset-ink-950 sm:size-40 lg:size-48"
              />
            ) : (
              <div
                className="flex size-44 items-center justify-center rounded-2xl bg-ink-900/80 text-5xl font-semibold text-accent-400 ring-2 ring-accent-500/40 ring-offset-4 ring-offset-ink-950 backdrop-blur-sm sm:size-40 sm:text-4xl lg:size-48 lg:text-5xl"
                aria-hidden={name ? undefined : true}
                aria-label={name ? `${name} (no photo uploaded)` : undefined}
                role={name ? 'img' : undefined}
              >
                {initials(name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            {profile.headline ? (
              <p className="text-sm font-medium tracking-wide text-accent-400 uppercase">
                {profile.headline}
              </p>
            ) : null}

            {name ? (
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-100 sm:text-5xl">
                {name}
              </h1>
            ) : null}

            {profile.tagline ? (
              <p className="mx-auto mt-4 max-w-xl text-base text-ink-300 sm:mx-0 sm:text-lg">
                {profile.tagline}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {/* Plain anchor with `download`: the browser honours the
                  server's Content-Disposition filename. Hidden until a
                  resume exists. */}
              {profile.has_resume ? (
                <a
                  href={resumeDownloadUrl()}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-400"
                >
                  <span aria-hidden="true">{'↓'}</span>
                  Download Resume
                </a>
              ) : null}

              {profile.contact.email ? (
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-950/40 px-5 py-2.5 text-sm font-medium text-ink-200 backdrop-blur-sm transition hover:border-accent-500 hover:text-accent-400"
                >
                  Get in touch
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
