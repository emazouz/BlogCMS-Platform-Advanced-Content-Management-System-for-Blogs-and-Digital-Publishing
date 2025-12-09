// /app/api/analytics/chart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { PageView } from '@/models/PageView';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setHours(0, 0, 0, 0);

    // Fetch daily stats
    const stats = await PageView.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          pageViews: { $sum: '$views' },
          uniqueVisitors: { $sum: '$uniqueVisitors' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format data for chart
    const chartData = stats.map(stat => ({
      date: new Date(stat._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: stat.pageViews,
      uniqueVisitors: stat.uniqueVisitors
    }));

    // Fill in missing dates with zeros
    const filledData = fillMissingDates(chartData, daysAgo);

    return NextResponse.json({
      success: true,
      data: filledData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

function fillMissingDates(data: any[], days: number) {
  const result = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const existing = data.find(d => d.date === dateStr);
    
    result.push({
      date: dateStr,
      pageViews: existing?.pageViews || 0,
      uniqueVisitors: existing?.uniqueVisitors || 0
    });
  }
  
  return result;
}