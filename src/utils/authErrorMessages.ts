import type { AuthErrorCode } from '@/src/services/authService';
import type { TranslationKey } from '@/src/i18n';

// Maps normalized service-layer error codes to translation keys. Keeping
// this in one place means authService/profileService/addressService never
// need to know about i18n, and screens never hardcode English fallback text.
export function authErrorTranslationKey(code: AuthErrorCode): TranslationKey {
  switch (code) {
    case 'invalid_credentials':
      return 'invalidEmailOrPassword';
    case 'account_exists':
      return 'accountAlreadyExists';
    case 'email_verification_required':
      return 'emailVerificationRequired';
    case 'network_error':
      return 'networkError';
    case 'not_configured':
      return 'backendNotConfigured';
    case 'unknown':
    default:
      return 'somethingWentWrong';
  }
}
