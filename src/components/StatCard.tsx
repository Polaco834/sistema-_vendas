import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ label, value, icon, trend, trendUp }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start">
        <span className="stat-label">{label}</span>
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`text-sm mt-2 ${trendUp ? "text-success" : "text-danger"}`}>
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;