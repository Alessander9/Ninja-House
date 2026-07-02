// Particles disabled temporarily - using CSS animation instead for reliability
export function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated dots using CSS */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#67B946', '#5A287A', '#F6D853'][i % 3],
            opacity: Math.random() * 0.3 + 0.05,
            animation: `float ${Math.random() * 4 + 4}s ease-in-out ${Math.random() * 4}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}
