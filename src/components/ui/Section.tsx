interface SectionProps {
  dark?: boolean
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ dark = false, children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={[
        'py-20 md:py-28',
        dark ? 'bg-near-black' : 'bg-bg-page',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  )
}
