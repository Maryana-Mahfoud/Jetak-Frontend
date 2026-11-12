/**
 * Animated success checkmark.
 *
 * A soft green badge scales in, then a ring is drawn around it, then the tick.
 * It is pure CSS (the animate-* classes live in index.css): no animation library
 * and no state. Under prefers-reduced-motion it simply appears already complete.
 *
 * It is decorative: the text next to it ("Welcome Back!") is what tells the user
 * about the success, so the whole thing is hidden from screen readers.
 */

interface AnimatedCheckProps {
  // Outer size of the badge in pixels.
  size?: number
}

export function AnimatedCheck({ size = 72 }: AnimatedCheckProps) {
  return (
    <div
      aria-hidden="true"
      className="animate-scale-in flex items-center justify-center rounded-full bg-jetak-success-soft"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 52 52" fill="none" className="h-3/4 w-3/4 text-jetak-success">
        {/*
          pathLength="1" makes the "length" of each shape equal to 1, so the same
          dash values work for any size. The dash pattern is "1 1.1": the gap is slightly
          longer than the dash, because with an equal gap the round line cap would draw a
          tiny dot at the start while the shape is still "undrawn".
        */}
        <circle
          cx="26"
          cy="26"
          r="23"
          pathLength={1}
          strokeDasharray="1 1.1"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          // A circle starts at 3 o'clock by default: rotate it so the ring is drawn from the top.
          transform="rotate(-90 26 26)"
          className="animate-check-ring"
        />
        <path
          d="M15 27.5 L23 35.5 L37.5 19"
          pathLength={1}
          strokeDasharray="1 1.1"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-check-tick"
        />
      </svg>
    </div>
  )
}