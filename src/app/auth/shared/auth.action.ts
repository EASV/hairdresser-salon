
export class LoginWithGoogle {
  static readonly type = '[Auth] LoginWithGoogle';

  constructor() {}
}

export class Logout {
  static readonly type = '[Auth] Logout';

  constructor() {}
}

export class GetRole {
  static readonly type = '[Auth] GetRole';

  constructor(public uid: string) {}
}

/*export class LoginInWithEmail {
  static readonly type = '[Auth] LoginInWithEmail';

  constructor(public authUser: AuthUser) {}
}*/
