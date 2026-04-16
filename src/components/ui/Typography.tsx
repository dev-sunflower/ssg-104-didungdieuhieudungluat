interface TypoProps {
  children: React.ReactNode
  className?: string
}

export function DisplayHeading({ children, className }: TypoProps) {
  return (
    <h1 className={['heading-display text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h1>
  )
}

export function SectionHeading({ children, className }: TypoProps) {
  return (
    <h2 className={['heading-section text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h2>
  )
}

export function SubheadingLg({ children, className }: TypoProps) {
  return (
    <h2 className={['heading-sub-lg text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h2>
  )
}

export function Subheading({ children, className }: TypoProps) {
  return (
    <h3 className={['heading-sub text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h3>
  )
}

export function SubheadingSm({ children, className }: TypoProps) {
  return (
    <h3 className={['heading-sub-sm text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h3>
  )
}

export function FeatureTitle({ children, className }: TypoProps) {
  return (
    <h4 className={['heading-feature text-text-primary', className].filter(Boolean).join(' ')}>
      {children}
    </h4>
  )
}

export function BodyLg({ children, className }: TypoProps) {
  return (
    <p className={['text-[1.25rem] leading-[1.6] text-text-secondary', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}

export function Body({ children, className }: TypoProps) {
  return (
    <p className={['text-base leading-[1.6] text-text-secondary', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}

export function Caption({ children, className }: TypoProps) {
  return (
    <p className={['text-[0.88rem] leading-[1.43] text-text-tertiary', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  )
}
