export interface User {
  id: string
  email: string
  fullName: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const authStorage = {
  getUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem("blinq_user")
    return userData ? JSON.parse(userData) : null
  },

  setUser: (user: User): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("blinq_user", JSON.stringify(user))
  },

  removeUser: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem("blinq_user")
  },

  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("blinq_users")
    return users ? JSON.parse(users) : []
  },

  addUser: (user: User): void => {
    if (typeof window === "undefined") return
    const users = authStorage.getUsers()
    users.push(user)
    localStorage.setItem("blinq_users", JSON.stringify(users))
  },

  findUserByEmail: (email: string): User | null => {
    const users = authStorage.getUsers()
    return users.find((user) => user.email === email) || null
  },

  validatePassword: (email: string, password: string): boolean => {
    if (typeof window === "undefined") return false
    const passwords = localStorage.getItem("blinq_passwords")
    const passwordMap = passwords ? JSON.parse(passwords) : {}
    return passwordMap[email] === password
  },

  setPassword: (email: string, password: string): void => {
    if (typeof window === "undefined") return
    const passwords = localStorage.getItem("blinq_passwords")
    const passwordMap = passwords ? JSON.parse(passwords) : {}
    passwordMap[email] = password
    localStorage.setItem("blinq_passwords", JSON.stringify(passwordMap))
  },
}

export const generateUserId = (): string => {
  return "user_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}
