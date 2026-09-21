import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthInput from "./AuthInput";

export default function PasswordInput({ label = "Password", id = "password", index, error, ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <AuthInput
        label={label}
        id={id}
        index={index}
        error={error}
        type={visible ? "text" : "password"}
        className="pr-11"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 text-white/40 hover:text-cyan-400 transition-colors duration-200 focus-visible:text-cyan-400"
        style={{ top: "calc(1.25rem + 14px)" }}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
