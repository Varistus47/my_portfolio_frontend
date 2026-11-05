/**
 * Mirrors the backend's Pydantic models.
 *
 * `*Input` types are what the admin forms send; the others are what the API
 * returns. Note: `erasableSyntaxOnly` is enabled in tsconfig.app.json, so
 * const-assertion arrays are used instead of TS `enum`s.
 */

export interface Contact {
  phone: string
  email: string
  address: string
  linkedin_url: string
  github_url: string
  leetcode_url: string
  website_url: string
}

export interface Profile {
  full_name: string
  headline: string
  tagline: string
  about: string
  summary: string
  photo_url: string | null
  has_resume: boolean
  resume_url: string | null
  contact: Contact
  updated_at: string
}

/** Flat, mirroring the single admin profile form. */
export interface ProfileInput {
  full_name: string
  headline: string
  tagline: string
  about: string
  summary: string
  phone: string
  email: string
  address: string
  linkedin_url: string
  github_url: string
  leetcode_url: string
  website_url: string
}

export interface Skill {
  id: number
  name: string
  category: string
  level: number
  display_order: number
}

export interface SkillInput {
  name: string
  category: string
  level: number
  display_order?: number | null
}

export interface Project {
  id: number
  title: string
  short_description: string
  description: string
  tech_stack: string[]
  github_url: string
  live_url: string
  image_url: string | null
  featured: boolean
  start_date: string
  end_date: string
  display_order: number
}

export interface ProjectInput {
  title: string
  short_description: string
  description: string
  tech_stack: string[]
  github_url: string
  live_url: string
  featured: boolean
  start_date: string
  end_date: string
  display_order?: number | null
}

export interface Education {
  id: number
  institution: string
  degree: string
  field: string
  location: string
  start_date: string
  end_date: string
  grade: string
  description: string
  display_order: number
}

export interface EducationInput {
  institution: string
  degree: string
  field: string
  location: string
  start_date: string
  end_date: string
  grade: string
  description: string
  display_order?: number | null
}

export interface Experience {
  id: number
  company: string
  role: string
  location: string
  employment_type: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
  tech_stack: string[]
  display_order: number
}

export interface ExperienceInput {
  company: string
  role: string
  location: string
  employment_type: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
  tech_stack: string[]
  display_order?: number | null
}

/** The aggregate payload the home page fetches in one request. */
export interface PortfolioData {
  profile: Profile
  skills: Skill[]
  projects: Project[]
  education: Education[]
  experience: Experience[]
}

/** Anything with an id and a position, for the generic reorder helpers. */
export interface Orderable {
  id: number
  display_order: number
}

export const SKILL_CATEGORY_SUGGESTIONS = [
  'Languages',
  'Frameworks',
  'Databases',
  'Tools & DevOps',
  'Cloud',
  'Concepts',
  'Other',
] as const

export const EMPLOYMENT_TYPE_SUGGESTIONS = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Freelance',
] as const
