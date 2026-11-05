import { useCallback, useEffect, useState } from 'react'

import {
  ApiError,
  deletePhoto,
  deleteResume,
  fileUrl,
  getProfile,
  resumeDownloadUrl,
  updateProfile,
  uploadPhoto,
  uploadResume,
} from '../api'
import ErrorBox from '../components/ErrorBox'
import Spinner from '../components/Spinner'
import { useApi } from '../hooks/useApi'
import type { Profile, ProfileInput } from '../types'
import FileDrop from './widgets/FileDrop'
import { TextAreaField, TextField } from './widgets/Field'

const toDraft = (profile: Profile): ProfileInput => ({
  full_name: profile.full_name,
  headline: profile.headline,
  tagline: profile.tagline,
  about: profile.about,
  summary: profile.summary,
  phone: profile.contact.phone,
  email: profile.contact.email,
  address: profile.contact.address,
  linkedin_url: profile.contact.linkedin_url,
  github_url: profile.contact.github_url,
  leetcode_url: profile.contact.leetcode_url,
  website_url: profile.contact.website_url,
})

export default function ProfilePanel() {
  const fetchProfile = useCallback(() => getProfile(), [])
  const { data, loading, error, reload } = useApi(fetchProfile)

  const [draft, setDraft] = useState<ProfileInput | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) setDraft(toDraft(data))
  }, [data])

  const update = (patch: Partial<ProfileInput>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current))
    setSaved(false)
  }

  const save = async () => {
    if (!draft) return
    setSaving(true)
    setSaveError(null)
    try {
      await updateProfile(draft)
      setSaved(true)
      reload()
    } catch (err: unknown) {
      setSaveError(err instanceof ApiError ? err.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner label="Loading profile" />
  if (error || !data || !draft) {
    return <ErrorBox message={error ?? 'Could not load the profile.'} onRetry={reload} />
  }

  const photo = fileUrl(data.photo_url)

  return (
    <div className="space-y-10">
      {/* ------------------------------------------------ photo & resume */}
      <section>
        <h2 className="font-semibold text-ink-100">Photo & Resume</h2>
        <p className="mt-1 text-xs text-ink-400">
          The photo appears in the hero. The resume adds a download button to
          the home page.
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-800 bg-ink-900/50 p-4">
            <div className="flex items-start gap-4">
              {photo ? (
                <img
                  src={photo}
                  alt="Current profile photo"
                  className="size-20 shrink-0 rounded-lg object-cover ring-1 ring-ink-800"
                />
              ) : (
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-ink-850 text-xs text-ink-400">
                  No photo
                </div>
              )}
              <div className="min-w-0 flex-1">
                <FileDrop
                  label={photo ? 'Replace photo' : 'Upload photo'}
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  hint="Square images look best. Max 8 MB."
                  onUpload={async (file) => {
                    await uploadPhoto(file)
                    reload()
                  }}
                />
                {photo ? (
                  <button
                    type="button"
                    onClick={() => {
                      void deletePhoto().then(reload)
                    }}
                    className="mt-2 text-xs text-ink-400 transition hover:text-danger"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-ink-800 bg-ink-900/50 p-4">
            <FileDrop
              label={data.has_resume ? 'Replace resume' : 'Upload resume'}
              accept="application/pdf"
              hint="PDF only. Max 8 MB."
              onUpload={async (file) => {
                await uploadResume(file)
                reload()
              }}
            />
            {data.has_resume ? (
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={resumeDownloadUrl()}
                  download
                  className="font-medium text-accent-400 transition hover:text-accent-300"
                >
                  Test download {'↓'}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    void deleteResume().then(reload)
                  }}
                  className="text-ink-400 transition hover:text-danger"
                >
                  Remove resume
                </button>
              </div>
            ) : (
              <p className="mt-3 text-xs text-ink-400">
                No resume uploaded, so the download button is hidden on the
                site.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- about you */}
      <section>
        <h2 className="font-semibold text-ink-100">About You</h2>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Full name"
              value={draft.full_name}
              onChange={(full_name) => update({ full_name })}
              placeholder="Your Name"
            />
            <TextField
              label="Headline"
              value={draft.headline}
              onChange={(headline) => update({ headline })}
              placeholder="Software Engineer"
            />
          </div>
          <TextField
            label="Tagline"
            value={draft.tagline}
            onChange={(tagline) => update({ tagline })}
            placeholder="I build reliable backends and clean interfaces."
            hint="One line under your name in the hero."
          />
          <TextAreaField
            label="About me"
            value={draft.about}
            onChange={(about) => update({ about })}
            hint="Leave a blank line between paragraphs."
            rows={7}
          />
          <TextAreaField
            label="Summary"
            value={draft.summary}
            onChange={(summary) => update({ summary })}
            hint="Your professional summary. Skills are managed on the Skills tab."
            rows={5}
          />
        </div>
      </section>

      {/* ------------------------------------------------------- contact */}
      <section>
        <h2 className="font-semibold text-ink-100">Contact Details</h2>
        <p className="mt-1 text-xs text-ink-400">
          Any field left blank is simply not shown on the site.
        </p>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Phone"
              type="tel"
              value={draft.phone}
              onChange={(phone) => update({ phone })}
              placeholder="+91 90000 00000"
            />
            <TextField
              label="Email"
              type="email"
              value={draft.email}
              onChange={(email) => update({ email })}
              placeholder="you@example.com"
            />
          </div>
          <TextField
            label="Address"
            value={draft.address}
            onChange={(address) => update({ address })}
            placeholder="Chennai, Tamil Nadu, India"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="LinkedIn"
              type="url"
              value={draft.linkedin_url}
              onChange={(linkedin_url) => update({ linkedin_url })}
              placeholder="https://linkedin.com/in/you"
            />
            <TextField
              label="GitHub"
              type="url"
              value={draft.github_url}
              onChange={(github_url) => update({ github_url })}
              placeholder="https://github.com/you"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="LeetCode"
              type="url"
              value={draft.leetcode_url}
              onChange={(leetcode_url) => update({ leetcode_url })}
              placeholder="https://leetcode.com/u/you"
            />
            <TextField
              label="Portfolio website"
              type="url"
              value={draft.website_url}
              onChange={(website_url) => update({ website_url })}
              placeholder="https://you.dev"
            />
          </div>
        </div>
      </section>

      {/* Sticky save bar, so the button is reachable from any field. */}
      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-ink-800 bg-ink-950/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded-lg bg-accent-500 px-5 py-2 text-sm font-semibold text-ink-950 transition hover:bg-accent-400 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved ? (
          <span className="text-xs text-success" role="status">
            Saved.
          </span>
        ) : null}
        {saveError ? (
          <span className="text-xs text-danger" role="alert">
            {saveError}
          </span>
        ) : null}
      </div>
    </div>
  )
}
