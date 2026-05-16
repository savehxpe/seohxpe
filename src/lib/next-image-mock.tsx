import React from 'react'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  layout?: string
  objectFit?: string
  style?: React.CSSProperties
  [key: string]: unknown
}

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  layout,
  objectFit,
  priority,
  style,
  ...props
}: ImageProps) {
  const imgStyle: React.CSSProperties = { ...style }
  if (objectFit) imgStyle.objectFit = objectFit as React.CSSProperties['objectFit']
  if (layout === 'responsive') {
    imgStyle.width = '100%'
    imgStyle.height = 'auto'
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={imgStyle}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  )
}
