export function getTokenFromLocalStorage(): string {
  const data = localStorage.getItem('token')
  const token: string = data ? JSON.parse(data) : ''

  return token
}

export function getTokenExpiryFromLocalStorage(): string {
  const data = localStorage.getItem('tokenExpiry')
  const tokenExpiry: string = data ? JSON.parse(data) : ''

  return tokenExpiry
}

export function setTokenToLocalStorage(key: string, token: string) {
  localStorage.setItem(key, JSON.stringify(token))
}

export function setTokenExpiryToLocalStorage(key: string, date: string) {
  localStorage.setItem(key, JSON.stringify(date))
}

export function removeTokenFromLocalStorage(key: string): void {
  localStorage.removeItem(key)
}

export function removeTokenExpiryFromLocalStorage(key: string): void {
  localStorage.removeItem(key)
}
