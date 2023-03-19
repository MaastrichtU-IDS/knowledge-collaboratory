import {atom} from 'nanostores';

interface UserProfile {
  id?: string;
  sub?: string;
  username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

export const userProfile = atom<UserProfile>({});
