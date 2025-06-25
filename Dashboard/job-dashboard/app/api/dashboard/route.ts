import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    stats: {
      totalVisitor: 1700,
      shortlisted: 3,
      views: 2100,
      appliedJob: 7,
    },
    jobViews: [
      { day: "Sun", count: 80 },
      { day: "Mon", count: 150 },
      { day: "Tue", count: 450 },
      { day: "Wed", count: 320 },
      { day: "Thu", count: 250 },
      { day: "Fri", count: 140 }
    ],
    jobs: [
      { id: "1", title: "Fulltime", type: "Fulltime", location: "Spain, Barcelona", tag: "Fulltime" },
      { id: "2", title: "Part time", type: "Part time", location: "USA, New York", tag: "Part time" },
      { id: "3", title: "Fixed-Price", type: "Fixed-Price", location: "USA, Mountain View", tag: "Fixed-Price" }
    ]
  });
}
