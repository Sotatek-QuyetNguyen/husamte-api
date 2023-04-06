export const USER_ROLES = {
  ADMIN: 1,
  USER: 0,
};

export const REDIS = {
  PREFIX: 'IPEX_DEV',
  RESEND_EXPIRED: 'IPEX_DEV_RESEND_EXPIRED',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN_EMAIL_VERIFICATION: 'LOGIN_EMAIL_VERIFICATION',
  REMOVE_TWO_FA_EMAIL_VERIFICATION: 'REMOVE_TWO_FA_EMAIL_VERIFICATION',
  REMOVE_AUTHENTICATOR_EMAIL_VERIFICATION:
    'REMOVE_AUTHENTICATOR_EMAIL_VERIFICATION',
  REQUEST_CHANGE_PASSWORD: 'REQUEST_CHANGE_PASSWORD',
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  SECRET_AUTHEN: 'SECRET_AUTHEN',
  ENABLE_2FA_GOOGLE: 'ENABLE_2FA_GOOGLE',
  ENABLE_2FA: 'ENABLE_2FA',
  USER_UPDATE_TIME: 'USER_UPDATE_TIME',
  EXPIRED_SECRET_AUTHENTICATOR: 20 * 60,
  EXPIRED_FORGOT_PASSWORD: 60 * 60,
  EXPIRED_EMAIL_VERIFICATION: 2 * 60,
  EXPIRED_EMAIL_LOGIN_VERIFICATION: 5 * 60,
  EXPIRED_ENABLE_2FA: 5 * 60,
  EXPIRED_EMAIL_RESEND: 2 * 60,
  EXPIRED_ACCOUNT: 24 * 60 * 60 * 1000,
};

export const REDIS_EXPIRE_RESEND = {
  LOGIN_EMAIL_VERIFICATION: 1,
  REMOVE_TWO_FA_EMAIL_VERIFICATION: 2,
  REMOVE_AUTHENTICATOR_EMAIL_VERIFICATION: 3,
  REQUEST_CHANGE_PASSWORD: 4,
  ENABLE_2FA_GOOGLE: 5,
  ENABLE_2FA: 6,
};

export const FIELD_REQUIRED = 'This field is required';
export const REGEX_ONLY_NUMBER_MAX_2_AFTER_DOT = /^[0-9][0-9]*[.]?[0-9]{0,2}$/;

export const AUTHENTICATOR = {
  NUMBER_OF_LOOP: 0,
  EXPIRED_EMAIL_VERIFICATION: 5 * 60 * 1000,
  LIMIT_EMAIL_VERIFICATION: 2 * 60 * 1000,
  RESET_PASSWORD: 24 * 60 * 60 * 1000,
};

export const EMAIL_TYPE = {
  RESET_PASSWORD: 3,
};
