import ContactRow from '../components/ContactRow'
import Section from '../components/Section'
import type { Contact } from '../types'

interface ContactSectionProps {
  contact: Contact
}

/** Strip the protocol/host so a long profile URL reads as a handle. */
function pretty(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  return trimmed.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const anyValue = Object.values(contact).some((value) => value.trim())
  if (!anyValue) return null

  return (
    <Section
      id="contact"
      title="Contact"
      subtitle="The fastest way to reach me is email."
    >
      <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
        <ContactRow
          label="Phone"
          value={contact.phone}
          href={contact.phone ? `tel:${contact.phone.replace(/\s+/g, '')}` : undefined}
          icon={'☎'}
        />
        <ContactRow
          label="Email"
          value={contact.email}
          href={contact.email ? `mailto:${contact.email}` : undefined}
          icon={'✉'}
        />
        <ContactRow
          label="LinkedIn"
          value={pretty(contact.linkedin_url)}
          href={contact.linkedin_url}
          external
          icon={'in'}
        />
        <ContactRow
          label="GitHub"
          value={pretty(contact.github_url)}
          href={contact.github_url}
          external
          icon={'⚙'}
        />
        <ContactRow
          label="LeetCode"
          value={pretty(contact.leetcode_url)}
          href={contact.leetcode_url}
          external
          icon={'≡'}
        />
        <ContactRow
          label="Website"
          value={pretty(contact.website_url)}
          href={contact.website_url}
          external
          icon={'⌂'}
        />
        <ContactRow label="Address" value={contact.address} icon={'◎'} />
      </ul>
    </Section>
  )
}
