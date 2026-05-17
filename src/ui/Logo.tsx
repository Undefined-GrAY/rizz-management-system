//{ src } as prop
function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo-light.png"
      alt="Logo"
      className={`w-auto ${className ?` ${className}`: "h-24"}`} // 9.6rem ≈ 38 Tailwind units (1 unit = 0.25rem
    />
  );
}

export default Logo;
