import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongoose";
import Notification from "@/models/Notification";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowLeft,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function NotificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  await dbConnect();

  try {
    const notification = await Notification.findOne({
      _id: id,
      recipient: session.user.id,
    });

    if (!notification) {
      notFound();
    }

    // Mark as read if not already
    if (!notification.read) {
      notification.read = true;
      await notification.save();
    }

    const getIcon = (type: string) => {
      switch (type) {
        case "success":
          return <CheckCircle2 className="h-6 w-6 text-green-500" />;
        case "warning":
          return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
        case "error":
          return <AlertCircle className="h-6 w-6 text-red-500" />;
        default:
          return <Info className="h-6 w-6 text-blue-500" />;
      }
    };

    const getBadgeVariant = (type: string) => {
      switch (type) {
        case "success":
          return "default"; // green usually associated with success, or we can use custom classes if needed. standard badge has 'default' (primary), 'secondary', 'destructive', 'outline'
        case "error":
          return "destructive";
        case "warning":
          return "secondary"; // or a custom style, but secondary is okay
        default:
          return "secondary"; // info
      }
    };

    // Custom color mapping just in case standard variants aren't enough or we want specific coloring
    const getTypeLabel = (type: string) => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar (Ads) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-24">
              <div className="h-[600px] w-full bg-muted/30 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm font-medium">
                Ad Space Left
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Button
              variant="ghost"
              asChild
              className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
            >
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Card className="overflow-hidden border-2">
              <CardHeader className="border-b bg-muted/20 pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="mt-1 p-2 bg-background rounded-full border shadow-sm">
                      {getIcon(notification.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={getBadgeVariant(notification.type) as any}
                          className="capitalize"
                        >
                          {notification.type}
                        </Badge>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(new Date(notification.createdAt), "PPP p")}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-bold leading-tight">
                        {notification.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {notification.message}
                  </p>
                </div>

                {notification.link && (
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full sm:w-auto">
                      <Link
                        href={notification.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Related Link
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar (Ads) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-24">
              <div className="h-[600px] w-full bg-muted/30 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm font-medium">
                Ad Space Right
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching notification:", error);
    notFound(); // or handle error gracefully
  }
}
