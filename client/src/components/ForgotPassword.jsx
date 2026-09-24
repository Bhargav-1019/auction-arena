import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await requestPasswordReset(email);
      setError("");
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send reset email");
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
          Recover Access
          <span className="block text-xs font-normal text-white/40 tracking-widest mt-1 uppercase">
            We&apos;ll send a secure reset link
          </span>
        </motion.h2>

        <div className="flex flex-col gap-5 mt-6">
          <AuthInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setMessage("");
            }}
            error={error}
            index={0}
          />

          {message && (
            <div role="status" className="rounded-lg px-4 py-3 bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 text-sm">
              {message}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : <><Mail size={16} /> Send Reset Link</>}
          </motion.button>

          <Link to="/login" className="text-center text-xs text-white/50 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
