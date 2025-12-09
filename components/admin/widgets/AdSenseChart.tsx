"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign } from "lucide-react";

type Period = "7d" | "30d" | "90d";

interface ChartData {
  date: string;
  earnings: number;
  impressions: number;
}

export function AdSenseChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("30d");

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/adsense?period=${period}`);
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Error fetching adsense data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <p className="text-sm text-gray-600 mt-0.5">
              AdSense earnings and impressions
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                ${
                  period === p
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                padding: "12px",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: "8px" }}
              formatter={(value: any, name: string) => {
                if (name === "Earnings") return [`$${value}`, name];
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="earnings"
              stroke="#16a34a"
              strokeWidth={2}
              name="Earnings"
              dot={{ fill: "#16a34a", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="impressions"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Impressions"
              dot={{ fill: "#f59e0b", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
