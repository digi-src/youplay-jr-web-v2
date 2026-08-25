export const AGE_RANGES = [
  { value: '2-3', label: '2–3 anos' },
  { value: '4-5', label: '4–5 anos' },
  { value: '6-8', label: '6–8 anos' },
  { value: '9-10', label: '9–10 anos' },
]

export const SCREEN_TIME_OPTIONS = [
  { value: '30min', label: '30 min' },
  { value: '1h', label: '1 h' },
  { value: '2h', label: '2 h' },
  { value: 'none', label: 'Sem limite' },
]

export const AVATAR_COLORS = [
  '#543ABC',
  '#E2792B',
  '#2F9E82',
  '#C4457F',
  '#2F6FD0',
  '#8A5A2B',
]

export function ageRangeLabel(value) {
  return AGE_RANGES.find((option) => option.value === value)?.label ?? value
}

export function screenTimeLabel(value) {
  return SCREEN_TIME_OPTIONS.find((option) => option.value === value)?.label ?? value
}
