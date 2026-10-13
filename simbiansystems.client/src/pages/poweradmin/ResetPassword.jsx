import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getApiErrorMessage } from '../../utils/format';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await authService.resetPassword({
        email: params.get('email'),
        token: params.get('token'),
        newPassword,
        confirmPassword,
      });
      toast.success('Password reset. You can now sign in.');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth">
      <form className="admin-card w-full max-w-md p-8" onSubmit={submit}>
        <h1 className="mb-5 text-2xl font-bold text-[#004A7C]">Choose a password</h1>
        <input
          className="admin-input mb-3"
          placeholder="New password"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="admin-input mb-5"
          placeholder="Confirm password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button className="admin-button w-full" disabled={loading}>
          {loading ? 'Saving…' : 'Reset password'}
        </button>
        <Link className="admin-link mt-4 block text-center text-sm" to="/poweradmin/login">
          Back to sign in
        </Link>
      </form>
    </div>
  );
}
