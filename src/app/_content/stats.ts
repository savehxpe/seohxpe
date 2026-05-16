export const stats = [
  {
    id: "spotify",
    label: "Spotify Streams",
    shortLabel: "Spotify",
    value: "3.7M+",
    countUp: { value: 3700000, unit: "M", precision: 1 },
    trajectory: { x: 58, y: 128, tooltipX: 86, tooltipY: 74 },
  },
  {
    id: "audience",
    label: "Social Media Audience",
    shortLabel: "Audience",
    value: "100K+",
    countUp: { value: 100000, unit: "K", precision: 0 },
    trajectory: { x: 252, y: 88, tooltipX: 276, tooltipY: 34 },
  },
  {
    id: "youtube",
    label: "YouTube Views",
    shortLabel: "YouTube",
    value: "800K+",
    countUp: { value: 800000, unit: "K", precision: 0 },
    trajectory: { x: 454, y: 64, tooltipX: 470, tooltipY: 10 },
  },
  {
    id: "shortform",
    label: "Short-Form Views",
    shortLabel: "Short-form",
    value: "4.2M+",
    countUp: { value: 4200000, unit: "M", precision: 1 },
    trajectory: { x: 654, y: 36, tooltipX: 442, tooltipY: 8 },
  },
] as const;
