import { useEffect, useState } from "react";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
}

const CircularProgress = ({
  percentage,
  size = 200,
  strokeWidth = 15,
  circleColor = "#6366f1"
}: CircularProgressProps) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-1000 ease-in-out"
          strokeWidth={strokeWidth}
          stroke={circleColor}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default CircularProgress;