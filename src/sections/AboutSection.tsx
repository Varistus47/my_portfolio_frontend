import Section from '../components/Section'

interface AboutSectionProps {
  about: string
}

export default function AboutSection({ about }: AboutSectionProps) {
  const paragraphs = about
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  // Empty sections render nothing at all - no placeholder on the public site.
  if (paragraphs.length === 0) return null

  return (
    <Section id="about" title="About Me">
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-ink-300">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Section>
  )
}
