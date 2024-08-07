export interface ISigninRequest {
  username: string,
  password: string
}

export interface ISigninResponse {
  user: {
    collaboratorId: number,
    name: string,
    lastName: string,
    email: string,
    sectors: string[],
    access: IAccess,
    systems: string[],
    teams: string[]
  },
  authorities: string[],
  token: string
}

interface IAccess {
  accessId: number,
  username: string,
  password: string,
  role: string
}
