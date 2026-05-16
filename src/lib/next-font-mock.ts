interface FontOptions {
  variable?: string
  subsets?: string[]
  weight?: string[]
}

interface FontResult {
  variable: string
  className: string
  style: { fontFamily: string }
}

function createFont(options: FontOptions, fallback: string): FontResult {
  const variable = options.variable || ''
  return {
    variable,
    className: '',
    style: { fontFamily: fallback },
  }
}

export function Syne(options: FontOptions = {}): FontResult {
  return createFont(options, "'Syne', sans-serif")
}

export function Space_Mono(options: FontOptions = {}): FontResult {
  return createFont(options, "'Space Mono', monospace")
}

export function Inter(options: FontOptions = {}): FontResult {
  return createFont(options, "'Inter', sans-serif")
}
