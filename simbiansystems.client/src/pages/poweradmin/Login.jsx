import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../utils/format';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '', rememberMe: true });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      navigate(
        data.mustChangePassword
          ? '/poweradmin/change-password'
          : location.state?.from?.pathname || '/poweradmin/dashboard',
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth">
      <form className="admin-card w-full max-w-md p-8" onSubmit={submit}>
        <h1 className="mb-1 text-2xl font-bold text-[#004A7C]">Simbian Systems</h1>
        <p className="mb-6 text-slate-500">Admin panel sign in</p>
        <label className="admin-label">Username or Email</label>
        <input
          required
          className="admin-input mb-4"
          value={form.usernameOrEmail}
          onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
          autoComplete="username"
        />
        <label className="admin-label">Password</label>
        <input
          required
          type="password"
          className="admin-input mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
        />
        <label className="mb-5 flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
          />
          Remember me
        </label>
        <button className="admin-button w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <Link className="admin-link mt-4 block text-center text-sm" to="/poweradmin/forgot-password">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
