"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const floatIcons = [
  { size: 40, x: "10%", y: "20%", delay: 0, icon: "🎲", duration: 8 },
  { size: 30, x: "85%", y: "15%", delay: 1, icon: "⭐", duration: 10 },
  { size: 45, x: "70%", y: "60%", delay: 2, icon: "👑", duration: 7 },
  { size: 25, x: "20%", y: "70%", delay: 0.5, icon: "❤️", duration: 9 },
  { size: 35, x: "45%", y: "30%", delay: 1.5, icon: "⚔️", duration: 11 },
  { size: 30, x: "90%", y: "80%", delay: 3, icon: "🐍", duration: 6 },
]

export default function Home() {
  const router = useRouter()

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_#1c3829_0%,_#0e1c15_70%,_#070d0a_100%)] text-stone-100">
      {/* Tabletop felt texture detail */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      <div className="fixed inset-0 -z-10 overflow-hidden">
        {floatIcons.map((s, i) => (
          <motion.div
            key={i}
            className="absolute select-none flex items-center justify-center pointer-events-none opacity-20 dark:opacity-30"
            style={{
              fontSize: s.size,
              left: s.x,
              top: s.y,
            }}
            animate={{
              x: [0, 20, -15, 10, 0],
              y: [0, -20, 10, -5, 0],
              scale: [1, 1.15, 0.9, 1.05, 1],
              rotate: [0, 10, -10, 5, 0],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            }}
          >
            {s.icon}
          </motion.div>
        ))}
      </div>

      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-black/35 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.5)] max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <span className="text-6xl animate-bounce" style={{ animationDuration: "3s" }}>
              🎲
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Ular & Tantangan
          </h1>
          
          <button
            onClick={() => router.push("/setup")}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-10 py-4 rounded-2xl text-lg shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            Mainkan
          </button>
        </motion.div>
      </section>

      <footer className="py-6 text-center text-[10px] font-mono tracking-widest uppercase text-stone-500">
        Cretaed by N
      </footer>
    </div>
  )
}
