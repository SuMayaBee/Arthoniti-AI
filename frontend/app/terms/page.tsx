import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/home/NavBar";
import { Song_Myung } from "next/font/google";

// Load Song Myung font for brand text
const songMyung = Song_Myung({ weight: "400" });

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 font-sans">
              Terms & Conditions
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
                    By accessing or using our website and services, you agree to the following terms:
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Use of Services
                  </h2>
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Service Requirements
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-blue-800">
                      <li>You must be at least <strong>18 years old</strong> to use our services.</li>
                      <li>You agree not to misuse our services, attempt to hack, reverse engineer, or disrupt operations.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Intellectual Property
                  </h2>
                  <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                      Ownership Rights
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-purple-800">
                      <li>All content, trademarks, software, and technology remain the property of Hyperscaler.</li>
                      <li>You may not copy, distribute, or resell our solutions without prior written consent.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Payments & Subscriptions
                  </h2>
                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Billing Terms
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-green-800">
                      <li>Pricing and subscription details are clearly stated on our website.</li>
                      <li>By subscribing, you authorize recurring charges until cancellation.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Limitation of Liability
                  </h2>
                  <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                    <h3 className="text-lg font-semibold text-amber-900 mb-3">
                      Service Disclaimer
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-amber-800">
                      <li>Our tools are provided "as is." We are not liable for indirect or consequential damages.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Termination
                  </h2>
                  <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">
                      Account Termination Policy
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-red-800">
                      <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                    </ul>
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
