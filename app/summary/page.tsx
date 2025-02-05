"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SummaryPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Thank You!</h1>

        <Card className="bg-card p-8">
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Interview Completed Successfully
            </h2>
            <p className="text-muted-foreground text-lg">
              Thank you for completing the interview. We will review your
              responses and contact you regarding the next steps in the process.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Link href="/">
            <Button variant="outline" size="lg">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
