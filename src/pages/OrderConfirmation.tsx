import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plane, CheckCircle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id");

  useEffect(() => {
    if (!bookingId) {
      navigate("/book");
    }
  }, [bookingId, navigate]);

  if (!bookingId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <div className="bg-primary/10 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Aeolus</h1>
          </div>
        </div>
      </div>

      {/* Confirmation Content */}
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-green-500 rounded-full p-6">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-green-600">
              Your Order is Confirmed!
            </h1>
            <p className="text-xl text-muted-foreground">
              Thank you for choosing Aeolus for your journey
            </p>
          </div>

          {/* Email Confirmation Card */}
          <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-center gap-3 text-green-700 dark:text-green-300">
                <Mail className="h-6 w-6" />
                <p className="text-lg font-medium">
                  A confirmation email has been sent to your inbox
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {bookingId.split('-')[0].toUpperCase()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="space-y-4 text-muted-foreground">
            <p>
              You will receive a detailed itinerary shortly. Our team will contact you
              24 hours before your scheduled flight with final instructions.
            </p>
            <p className="text-sm">
              Need help? Contact us at{" "}
              <a href="mailto:support@aeolus.com" className="text-primary hover:underline">
                support@aeolus.com
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/book")}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              Book Another Flight
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/book")}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
