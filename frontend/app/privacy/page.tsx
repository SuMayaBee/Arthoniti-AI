import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/home/NavBar";
import { Song_Myung } from "next/font/google";

// Load Song Myung font for brand text
const songMyung = Song_Myung({ weight: "400" });

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 font-sans">
              Privacy Policy
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
                    <strong className="text-gray-700">Your Privacy Matters:</strong> At Hyperscaler, we respect your privacy and protect your personal data.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Information We Collect
                  </h2>
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Data Collection
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-blue-800">
                      <li>Personal information you provide (name, email, payment details).</li>
                      <li>Usage data (IP address, browser type, device info, analytics).</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    How We Use Your Information
                  </h2>
                  <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                      Usage Purposes
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-purple-800">
                      <li>To provide and improve our services.</li>
                      <li>To communicate important updates and offers.</li>
                      <li>To comply with legal requirements.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Data Protection
                  </h2>
                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Security Measures
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-green-800">
                      <li>We use encryption, secure servers, and access controls to protect your data.</li>
                      <li>We do not sell or rent your personal information to third parties.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Third-Party Services
                  </h2>
                  <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">
                      Trusted Partners
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-orange-800">
                      <li>We may use trusted partners (e.g., payment processors, analytics tools).</li>
                      <li>These partners are bound by confidentiality and data protection agreements.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    Your Rights
                  </h2>
                  <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                      User Rights
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-indigo-800">
                      <li>You may request access, correction, or unsubscribe from the service after the required procedure.</li>
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
