const STORAGE_KEY = 'youplay_profiles'

export function getProfiles() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function createProfile({ name, ageRange, color, screenTimeLimit }) {
  const profile = {
    id: crypto.randomUUID(),
    name,
    ageRange,
    color,
    screenTimeLimit,
  }

  const profiles = getProfiles()
  profiles.push(profile)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))

  return profile
}

export function getProfile(id) {
  return getProfiles().find((profile) => profile.id === id) ?? null
}
