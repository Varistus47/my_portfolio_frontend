/**
 * Typed fetch client.
 *
 * Every request path is relative (`/api/...`). What `VITE_API_BASE` is set to
 * decides where the browser actually sends it:
 *
 *   VITE_API_BASE=                        -> same-origin; the Vite dev proxy
 *                                            forwards /api to the backend.
 *                                            No CORS involved.
 *   VITE_API_BASE=http://127.0.0.1:8000   -> the browser calls the backend
 *                                            directly, so it shows as port
 *                                            8000 in DevTools and the
 *                                            backend's CORS rules apply.
 *
 * Either way, `fileUrl()` must be used for photo and project image URLs: the
 * API returns them root-relative (`/uploads/x.png`), so they need the same
 * base prefix or they resolve against the frontend origin and 404.
 */

import { clearToken, getToken } from './adminAuth'
import type {
  Education,
  EducationInput,
  Experience,
  ExperienceInput,
  PortfolioData,
  Profile,
  ProfileInput,
  Project,
  ProjectInput,
  Skill,
  SkillInput,
} from './types'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Prefix a root-relative URL from the API (photo_url, image_url) with the base. */
export function fileUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return `${API_BASE}${url}`
}

export const resumeDownloadUrl = (): string => `${API_BASE}/api/resume`
export const resumeInlineUrl = (): string => `${API_BASE}/api/resume/inline`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const token = getToken()
  if (token) headers.set('X-Admin-Token', token)

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(
      0,
      'Cannot reach the API. Is the backend running on port 8000?',
    )
  }

  if (response.status === 401) {
    // Token expired or rejected: drop it so the admin gate reappears.
    clearToken()
    throw new ApiError(401, await readDetail(response, 'Session expired'))
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      await readDetail(response, `Request failed (${response.status})`),
    )
  }

  if (response.status === 204) return undefined as T
  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

/** FastAPI reports errors as {detail: string} or {detail: [{msg, loc}, ...]}. */
async function readDetail(response: Response, fallback: string): Promise<string> {
  try {
    const body: unknown = JSON.parse(await response.text())
    if (body && typeof body === 'object' && 'detail' in body) {
      const detail = (body as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail)) {
        const parts = detail
          .map((item) => {
            if (item && typeof item === 'object') {
              const entry = item as { msg?: unknown; loc?: unknown }
              const field = Array.isArray(entry.loc)
                ? entry.loc.filter((p) => p !== 'body').join('.')
                : ''
              const msg = typeof entry.msg === 'string' ? entry.msg : ''
              return field ? `${field}: ${msg}` : msg
            }
            return ''
          })
          .filter(Boolean)
        if (parts.length > 0) return parts.join('; ')
      }
    }
  } catch {
    /* fall through */
  }
  return fallback
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

function uploadInit(file: File): RequestInit {
  const form = new FormData()
  form.append('file', file)
  // Deliberately no Content-Type: the browser must generate the multipart
  // boundary. Setting it by hand is the classic cause of a 422 here.
  return { method: 'POST', body: form }
}

// ------------------------------------------------------------------ admin

export const login = (password: string) =>
  request<{ token: string; expires_in: number }>(
    '/api/admin/login',
    jsonInit('POST', { password }),
  )

export const checkSession = () =>
  request<{ valid: boolean }>('/api/admin/session')

// -------------------------------------------------------------- portfolio

export const getPortfolio = () => request<PortfolioData>('/api/portfolio')

// ---------------------------------------------------------------- profile

export const getProfile = () => request<Profile>('/api/profile')

export const updateProfile = (payload: ProfileInput) =>
  request<Profile>('/api/profile', jsonInit('PUT', payload))

export const uploadPhoto = (file: File) =>
  request<{ photo_url: string }>('/api/profile/photo', uploadInit(file))

export const deletePhoto = () =>
  request<void>('/api/profile/photo', { method: 'DELETE' })

export const uploadResume = (file: File) =>
  request<{ resume_url: string; resume_original_name: string }>(
    '/api/profile/resume',
    uploadInit(file),
  )

export const deleteResume = () =>
  request<void>('/api/profile/resume', { method: 'DELETE' })

// ----------------------------------------------------------------- skills

export const listSkills = () => request<Skill[]>('/api/skills')
export const createSkill = (p: SkillInput) =>
  request<Skill>('/api/skills', jsonInit('POST', p))
export const updateSkill = (id: number, p: SkillInput) =>
  request<Skill>(`/api/skills/${id}`, jsonInit('PUT', p))
export const deleteSkill = (id: number) =>
  request<void>(`/api/skills/${id}`, { method: 'DELETE' })

// --------------------------------------------------------------- projects

export const listProjects = () => request<Project[]>('/api/projects')
export const createProject = (p: ProjectInput) =>
  request<Project>('/api/projects', jsonInit('POST', p))
export const updateProject = (id: number, p: ProjectInput) =>
  request<Project>(`/api/projects/${id}`, jsonInit('PUT', p))
export const deleteProject = (id: number) =>
  request<void>(`/api/projects/${id}`, { method: 'DELETE' })
export const uploadProjectImage = (id: number, file: File) =>
  request<{ image_url: string }>(`/api/projects/${id}/image`, uploadInit(file))
export const deleteProjectImage = (id: number) =>
  request<void>(`/api/projects/${id}/image`, { method: 'DELETE' })

// -------------------------------------------------------------- education

export const listEducation = () => request<Education[]>('/api/education')
export const createEducation = (p: EducationInput) =>
  request<Education>('/api/education', jsonInit('POST', p))
export const updateEducation = (id: number, p: EducationInput) =>
  request<Education>(`/api/education/${id}`, jsonInit('PUT', p))
export const deleteEducation = (id: number) =>
  request<void>(`/api/education/${id}`, { method: 'DELETE' })

// ------------------------------------------------------------- experience

export const listExperience = () => request<Experience[]>('/api/experience')
export const createExperience = (p: ExperienceInput) =>
  request<Experience>('/api/experience', jsonInit('POST', p))
export const updateExperience = (id: number, p: ExperienceInput) =>
  request<Experience>(`/api/experience/${id}`, jsonInit('PUT', p))
export const deleteExperience = (id: number) =>
  request<void>(`/api/experience/${id}`, { method: 'DELETE' })
