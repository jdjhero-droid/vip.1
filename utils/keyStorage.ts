
/**
 * External Key Management Utility
 * The application strictly relies on process.env.API_KEY provided by the platform.
 * Local manual storage is disabled for security and compliance with system instructions.
 */

export const isVaultActivated = (): boolean => {
  return localStorage.getItem('wt_vault_activated') === 'true';
};

export const setVaultActivated = (active: boolean) => {
  localStorage.setItem('wt_vault_activated', active ? 'true' : 'false');
};
