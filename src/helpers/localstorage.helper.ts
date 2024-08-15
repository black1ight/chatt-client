export function getTokenFromLocalStorage(): string {
  const data = localStorage.getItem('token')
  const token: string = data ? JSON.parse(data) : ''

  return token
}

export function setTokenToLocalStorage(key: string, token: string) {
  localStorage.setItem(key, JSON.stringify(token))
}

export function removeTokenFromLocalStorage(key: string): void {
  localStorage.removeItem(key)
}
