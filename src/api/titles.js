const API_URL = import.meta.env.VITE_API_URL

function getToken() {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Usuário não autenticado')
  }
  return token
}

export async function fetchTitles(catId) {
  const token = getToken()

  let res
  try {
    res = await fetch(`${API_URL}/titles?catId=${catId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new Error('Não foi possível carregar os títulos agora. Tente novamente mais tarde.')
  }

  if (!res.ok) {
    throw new Error('Erro ao buscar títulos')
  }

  return res.json()
}

export async function fetchTitle(id) {
  const token = getToken()

  let res
  try {
    res = await fetch(`${API_URL}/titles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    throw new Error('Não foi possível carregar essa série agora. Tente novamente mais tarde.')
  }

  if (!res.ok) {
    throw new Error('Erro ao buscar a série')
  }

  return res.json()
}
