import { motion } from "framer-motion";
import { LogOut, Sword, Users, Trophy, Zap, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function GameCard({ icon: Icon, title, subtitle, badge }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02, borderColor: "rgba(0,212,255,0.35)" }}
      className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 cursor-pointer transition-colors duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center group-hover:bg-cyan-400/20 transition-colors">
            <Icon size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {badge && (
          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "??";

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "linear-gradient(135deg, #050a1a 0%, #0a0520 50%, #050a1a 100%)" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-xl font-black tracking-[0.2em] uppercase text-white">
              AUCTION{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #00d4ff, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ARENA
              </span>
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/50 mt-0.5">
              Build. Bid. Conquer.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-red-500/10 text-white/60 hover:text-red-400 text-xs font-semibold tracking-wider uppercase transition-all duration-200"
          >
            <LogOut size={14} />
            Logout
          </motion.button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-card rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #00d4ff33, #8b5cf633)", border: "1px solid rgba(0,212,255,0.25)" }}
          >
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Signed in as</p>
            <h2 className="text-2xl font-black text-white tracking-wide">{user?.username}</h2>
            <p className="text-sm text-white/40 mt-0.5">{user?.email}</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/60">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          <GameCard icon={Sword} title="Create Game" subtitle="Start a new auction battle" badge="Soon" />
          <GameCard icon={Users} title="Join Game" subtitle="Enter with a room code" badge="Soon" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Trophy size={18} className="text-yellow-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Auction Arena — Coming Soon
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Live Auctions", desc: "Real-time bidding battles" },
              { label: "Leaderboard", desc: "Climb the global rankings" },
              { label: "Season Rewards", desc: "Earn gold for your wins" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="rounded-xl p-4 border border-white/5 bg-white/[0.03] flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-purple-400" />
                  <p className="text-xs font-semibold text-white/70">{feature.label}</p>
                </div>
                <p className="text-[11px] text-white/30">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
