import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sword } from "lucide-react";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import { useAuth } from "../context/AuthContext";

const validate = (form) => {
  const errs = {};

  if (!form.username.trim()) errs.username = "Username is required";
  else if (form.username.length < 3) errs.username = "At least 3 characters";
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = "Only letters, numbers, and underscores";

  if (!form.email.trim()) errs.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";

  if (!form.password) errs.password = "Password is required";
  else if (form.password.length < 8) errs.password = "Minimum 8 characters";
  else if (!/[A-Z]/.test(form.password)) errs.password = "At least one uppercase letter";
  else if (!/[0-9]/.test(form.password)) errs.password = "At least one number";

  if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
  else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";

  return errs;
};

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");
    try {
      await register(form.username, form.email, form.password);
      navigate("/home", { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
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
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xl font-bold text-white mb-6 tracking-wide"
        >
          Join the Arena
          <span className="block text-xs font-normal text-white/40 tracking-widest mt-1 uppercase">
            Claim your identity and enter the battle
          </span>
        </motion.h2>

        <div className="flex flex-col gap-5">
          <AuthInput
            label="Username"
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="e.g. shadow_blade99"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            index={0}
          />

          <AuthInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            index={1}
          />

          <PasswordInput
            label="Password"
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            index={2}
          />

          <PasswordInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            index={3}
          />

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="rounded-lg px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            >
              {serverError}
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating Account…
              </>
            ) : (
              <>
                <Sword size={16} />
                Create Account →
              </>
            )}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.4 }}
            className="text-center text-xs text-white/40"
          >
            Already a warrior?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Enter Arena →
            </Link>
          </motion.p>
        </div>
      </form>
    </AuthLayout>
  );
}
