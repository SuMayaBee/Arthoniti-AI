import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/home/NavBar";
import { Song_Myung } from "next/font/google";

// Load Song Myung font for brand text
const songMyung = Song_Myung({ weight: "400" });

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 font-sans">
              Refund Policy
            </h1>
            <p className="text-muted-foreground font-sans">
              Last updated: September 15, 2025
            </p>
          </div>

          <Card className="shadow-lg border-gray-200">
            <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none font-sans">
              <div className="space-y-8">
                <section>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    At Hyperscaler, we strive to deliver exceptional value with our AI solutions. If you are not fully satisfied 
                    with your purchase or subscription, we offer the following policy:
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Subscriptions & SaaS Plans
                  </h2>
                  <div className="p-6 bg-red-50 rounded-xl border border-red-200 mb-4">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">
                      Important Notice - 7 Day Refund Window
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-red-800">
                      <li>Refund requests must be submitted within <strong>7 days</strong> of the initial purchase.</li>
                      <li>Refunds are not available after the first 7 days of service.</li>
                      <li>Renewal payments are non-refundable.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Custom Software & Services
                  </h2>
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Custom Development Policy
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-blue-800">
                      <li>If work has not started, a partial refund may be considered.</li>
                      <li>Due to the tailored nature of custom development, refunds are generally not available once work has begun.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    How to Request a Refund
                  </h2>
                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Contact Process
                    </h3>
                    <div className="space-y-3 text-green-800">
                      <p>
                        Please email <a 
                          href="mailto:support@scalebuild.ai" 
                          className="text-green-700 hover:text-green-900 underline font-semibold"
                        >
                          support@scalebuild.ai
                        </a> with your order details.
                      </p>
                      <p>
                        Our team will review and respond within <strong>5 business days</strong>.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
