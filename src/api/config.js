const DEFAULT_API_URL = 'https://api.youplay.com.br/v3'
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const invalidApiUrlValues = new Set(['undefined', 'null'])
const hasValidApiUrl =
  configuredApiUrl && !invalidApiUrlValues.has(configuredApiUrl.toLowerCase())

export const API_URL = (hasValidApiUrl ? configuredApiUrl : DEFAULT_API_URL).replace(/\/+$/, '')
