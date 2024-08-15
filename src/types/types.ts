export interface IUser {
  id: number
  email: string
  token: string
}

export interface IUserData {
  email: string
  password: string
}

export interface IResUser {
  email: string | undefined
  password: string | undefined
  user_name: string | null | undefined
  id: number | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
}

export interface IResUserData {
  token: string
  user: IResUser
}

export interface IPatchData {
  id: number
  text: string
  updatedAt: Date
}
