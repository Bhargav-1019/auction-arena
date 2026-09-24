import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";
import { useAuth } from "../context/AuthContext";

const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Minimum 8 characters";
  if (!/[A-Z]/.test(password)) return "At least one uppercase letter";
  if (!/[0-9]/.test(password)) return "At least one number";
  return "";
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(token ? "" : "This reset link is missing its token");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) return;

    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate("/login", { replace: true, state: { message: "Password reset successful. You can now log in." } });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} noValidate>
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white mb-2 tracking-wide"
        >
          Choose a New Password
          <span className="block text-xs font-normal text-white/40 tracking-widest mt-1 uppercase">
            Your reset link expires in 20 minutes
          </span>
        </motion.h2>

        <div className="flex flex-col gap-5 mt-6">
          <PasswordInput
            label="New Password"
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            error={undefined}
            index={0}
          />
          <PasswordInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError("");
            }}
            error={undefined}
            index={1}
          />

          {error && (
            <div role="alert" className="rounded-lg px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !token}
            className="btn-primary w-full py-3.5 rounded-xl text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating…" : <><KeyRound size={16} /> Reset Password</>}
          </motion.button>

          <Link to="/login" className="text-center text-xs text-white/50 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
