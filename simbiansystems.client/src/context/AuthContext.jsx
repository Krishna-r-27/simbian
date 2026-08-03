import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
const Context = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser()); const [accessToken, setAccessToken] = useState(storage.getAccessToken());
  const login = async (credentials) => { const payload = await authService.login(credentials); const profile = payload.profile ?? payload.Profile; storage.setAuth({ accessToken: payload.accessToken ?? payload.AccessToken, refreshToken: payload.refreshToken ?? payload.RefreshToken, user: profile, mustChangePassword: payload.mustChangePassword }); setUser(profile); setAccessToken(payload.accessToken ?? payload.AccessToken); return payload; };
  const logout = async () => { try { await authService.logout(storage.getRefreshToken()); } finally { storage.clearAuth(); setUser(null); setAccessToken(null); } };
  const refreshProfile = async () => { const profile = await authService.getProfile(); setUser(profile); storage.setUser(profile); return profile; };
  return <Context.Provider value={{ user, accessToken, isAuthenticated: !!accessToken, login, logout, refreshProfile }}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
