import {atom} from 'nanostores'

interface UserProfile {
  id?: string
  sub?: string
  username?: string
  name?: string
  given_name?: string
  family_name?: string
}

export const userProfile = atom<UserProfile>({})

interface UserSettings {
  api: string
}

export const userSettings = atom<UserSettings>({
  api: 'https://api.collaboratory.semanticscience.org'
})
