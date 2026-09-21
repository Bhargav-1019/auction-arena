import { forwardRef } from "react";
import { motion } from "framer-motion";

const AuthInput = forwardRef(function AuthInput(
  { label, id, error, index = 0, className = "", ...rest },
  ref
) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-1.5"
    >
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-widest uppercase text-cyan-300/80"
      >
        {label}
      </label>

      <input
        ref={ref}
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={[
          "w-full rounded-lg px-4 py-3 text-sm text-white",
          "bg-white/5 border border-white/10",
          "placeholder:text-white/25 transition-all duration-200",
          "input-glow focus:outline-none",
          error ? "border-red-500/60" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />

      {error && (
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-xs text-red-400 flex items-center gap-1 mt-0.5"
        >
          <span aria-hidden="true">⚠</span> {error}
        </motion.p>
      )}
    </motion.div>
  );
});

export default AuthInput;
