import {AuthUser} from './auth-user';

export class LoginWithGoogle {
  static readonly type = '[Auth] LoginWithGoogle';

  constructor() {}
}

export class Logout {
  static readonly type = '[Auth] Logout';

  constructor() {}
}

export class GetAuthUser {
  static readonly type = '[Auth] GetAuthUser';
}
