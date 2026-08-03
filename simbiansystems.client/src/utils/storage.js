const key = 'simbian.admin.';
export const storage = {
  getAccessToken: () => localStorage.getItem(`${key}accessToken`),
  getRefreshToken: () => localStorage.getItem(`${key}refreshToken`),
  getUser: () => JSON.parse(localStorage.getItem(`${key}user`) || 'null'),
  getMustChangePassword: () => localStorage.getItem(`${key}mustChangePassword`) === 'true',
  setUser: (user) => localStorage.setItem(`${key}user`, JSON.stringify(user)),
  setMustChangePassword: (value) => localStorage.setItem(`${key}mustChangePassword`, String(value)),
  setAuth: ({ accessToken, refreshToken, user, mustChangePassword }) => {
    if (accessToken) localStorage.setItem(`${key}accessToken`, accessToken);
    if (refreshToken) localStorage.setItem(`${key}refreshToken`, refreshToken);
    if (user) storage.setUser(user);
    storage.setMustChangePassword(Boolean(mustChangePassword));
  },
  clearAuth: () => Object.keys(localStorage).filter((k) => k.startsWith(key)).forEach((k) => localStorage.removeItem(k)),
};
