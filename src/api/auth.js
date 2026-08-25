const API_URL = import.meta.env.VITE_API_URL

export async function requestOtp(email) {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    throw new Error('Não foi possível enviar o código. Confira o e-mail e tente novamente.')
  }

  return res.json().catch(() => ({}))
}

export async function verifyOtp(email, code) {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })

  if (!res.ok) {
    throw new Error('Código inválido. Confira e tente novamente.')
  }

  const data = await res.json()
  const token = data?.pro?.[0]?.key

  if (!token) {
    throw new Error('Código inválido. Confira e tente novamente.')
  }

  return token
}
