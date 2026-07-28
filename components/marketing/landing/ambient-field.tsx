export function AmbientField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="operating-aurora absolute -left-24 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/18 blur-3xl" />
      <div className="operating-aurora absolute right-[-10rem] top-24 h-[38rem] w-[38rem] rounded-full bg-violet-400/16 blur-3xl [animation-delay:-7s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),transparent_34%),linear-gradient(180deg,rgba(3,5,18,0.14),#030512_76%)]" />
      <div className="operating-grid absolute inset-[-20%] opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:88px_88px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(3,5,18,0.92)_88%)]" />
    </div>
  )
}
