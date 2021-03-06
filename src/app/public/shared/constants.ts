export const firestoreConstants = {
  // Firestore
  slash: '/',
  roles: 'roles',
  admin: 'admin',
  products: 'products',
  topProducts: 'top-products'
};

export const firestorageConstants = {
  // Firestore
  images: 'images'
};

export const routingConstants = {
  // Navigation
  slash: '/',
  welcome: 'welcome',
  authLogin: 'auth/login',
  login: 'login',
  auth: 'auth',
  products: 'products',
  create: 'create',
  edit: 'edit'
};

export const stateKeys = {
  products: 'products',
  public: 'public',
  files: 'files',
  upload: 'upload'
};

export function joinPath(...parts: string[]): string {
  return parts.join('/');
}
