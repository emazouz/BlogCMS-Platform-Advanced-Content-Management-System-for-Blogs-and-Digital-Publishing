"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Save,
  Trash2,
  Calendar,
  TrendingUp,
  MousePointerClick,
  Eye,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [statToDelete, setStatToDelete] = useState<string | null>(null);

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
    try {
      const response = await fetch(`/api/adsense/${id}`, { method: "DELETE" });
      if (response.ok) {
        setStats(stats.filter((s) => s._id !== id));
        setShowDeleteDialog(false);
        setStatToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting stat:", error);
    }
  };

  // Calculate totals
  const totalEarnings = stats.reduce((sum, stat) => sum + stat.earnings, 0);
  const totalImpressions = stats.reduce(
    (sum, stat) => sum + stat.impressions,
    0
  );
  const totalClicks = stats.reduce((sum, stat) => sum + stat.clicks, 0);
  const avgCTR =
    stats.length > 0
      ? stats.reduce((sum, stat) => sum + stat.ctr, 0) / stats.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            AdSense Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your advertising revenue
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Impressions
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {totalImpressions.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Clicks
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {totalClicks.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <MousePointerClick className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg CTR
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {avgCTR.toFixed(2)}%
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Add Daily Stats
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
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
                    className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Impressions
                  </label>
                  <input
                    type="number"
                    name="impressions"
                    value={formData.impressions}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Clicks
                  </label>
                  <input
                    type="number"
                    name="clicks"
                    value={formData.clicks}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    CTR (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="ctr"
                    value={formData.ctr}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Historical Data</h3>
              <span className="text-sm text-muted-foreground">
                {stats.length} entries
              </span>
            </div>
            {loading ? (
              <div
                className="p-12 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <span className="sr-only">Loading stats...</span>
                <p className="text-muted-foreground mt-4">Loading stats...</p>
              </div>
            ) : stats.length === 0 ? (
              <div className="p-12 text-center">
                <BarChart3
                  className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50"
                  aria-hidden="true"
                />
                <p className="text-foreground font-medium mb-1">
                  No data recorded yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Add your first AdSense entry using the form
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Impressions
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Clicks
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        CTR
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stats.map((stat) => (
                      <tr
                        key={stat._id}
                        className="hover:bg-accent/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-foreground font-medium">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(stat.date), "MMM d, yyyy")}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            ${stat.earnings.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {stat.impressions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {stat.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {stat.ctr.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setStatToDelete(stat._id);
                                setShowDeleteDialog(true);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this AdSense entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => statToDelete && handleDelete(statToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
