export interface BasicAuthOptions {
  email?: {
    login?: boolean;
    register?: { required: boolean };
    verification?: boolean;
  };
  username?: {
    login?: boolean;
    register?: { required: boolean };
    validation?: RegExp;
  };
  passwod?: {
    validation?: RegExp;
  };
}

export const BasicAuthDefaults: BasicAuthOptions = {
  email: {
    verification: false,
    login: true,
    register: { required: false },
  },
  username: {
    login: true,
    register: { required: false },
  },
};

export const BASIC_AUTH_OPTIONS = 'BASIC_AUTH_OPTIONS';
