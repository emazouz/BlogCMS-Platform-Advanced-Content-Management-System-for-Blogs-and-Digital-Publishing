"use client";

import { useState, useEffect } from "react";
import { DollarSign, Save, Trash2, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface AdSenseStat {
  _id: string;
  date: string;
  earnings: number;
  impressions: number;
  clicks: number;
  ctr: number;
  rpm: number;
}

export default function AdSensePage() {
  const [stats, setStats] = useState<AdSenseStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    earnings: "",
    impressions: "",
    clicks: "",
    ctr: "",
    rpm: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/adsense");
      const data = await response.json();
      setStats(data.stats || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.earnings) return;

    try {
      const response = await fetch("/api/adsense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          earnings: "",
          impressions: "",
          clicks: "",
          ctr: "",
          rpm: "",
        });
        fetchStats();
      } else {
        const err = await response.json();
        alert(err.error || "Failed to save stats");
      }
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const response = await fetch(`/api/adsense/${id}`, { method: "DELETE" });
      if (response.ok) {
        setStats(stats.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error("Error deleting stat:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AdSense Manager</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your revenue data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Add Daily Stats
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Earnings ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="earnings"
                    value={formData.earnings}
                    onChange={handleInputChange}
                    required
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impressions
                  </label>
                  <input
                    type="number"
                    name="impressions"
                    value={formData.impressions}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clicks
                  </label>
                  <input
                    type="number"
                    name="clicks"
                    value={formData.clicks}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTR (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="ctr"
                    value={formData.ctr}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition"
              >
                <Save className="h-4 w-4" />
                Save Entry
              </button>
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Historical Data</h3>
              <span className="text-sm text-gray-500">
                {stats.length} entries
              </span>
            </div>
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : stats.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No data recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Revenue
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Impr.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Clicks
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.map((stat) => (
                      <tr key={stat._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {format(new Date(stat.date), "MMM d, yyyy")}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">
                          ${stat.earnings.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {stat.impressions.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {stat.clicks.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(stat._id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
