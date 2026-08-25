const DEFAULT_API_URL = 'https://api.youplay.com.br/v3'

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '')
