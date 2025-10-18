"use client";

import { useState } from "react";
import {
  Check,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses getting started with GEO",
      monthlyPrice: 2499,
      annualPrice: 24990,
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-500/10 to-orange-600/10",
      borderColor: "border-orange-500/30",
      popular: false,
      features: [
        "AI visibility monitoring on 5 platforms",
        "Up to 10 domains",
        "Basic citation tracking",
        "Email alerts",
        "Standard support",
        "Monthly reports",
      ],
    },
    {
      name: "Professional",
      description: "Advanced features for growing businesses",
      monthlyPrice: 4999,
      annualPrice: 49990,
      icon: TrendingUp,
      color: "from-orange-400 to-orange-500",
      bgColor: "from-orange-400/10 to-orange-500/10",
      borderColor: "border-orange-400/30",
      popular: true,
      features: [
        "AI visibility monitoring on 12+ platforms",
        "Up to 50 domains",
        "Advanced citation tracking",
        "Real-time alerts & notifications",
        "Content optimization suggestions",
        "Priority support",
        "Weekly reports",
        "Competitor analysis",
        "API access",
      ],
    },
    {
      name: "Enterprise",
      description: "Complete solution for large organizations",
      monthlyPrice: 9999,
      annualPrice: 99990,
      icon: Crown,
      color: "from-orange-600 to-orange-700",
      bgColor: "from-orange-600/10 to-orange-700/10",
      borderColor: "border-orange-600/30",
      popular: false,
      features: [
        "AI visibility monitoring on all platforms",
        "Unlimited domains",
        "Advanced analytics & insights",
        "Custom alerts & workflows",
        "AI-powered content optimization",
        "Dedicated account manager",
        "Daily reports & insights",
        "Advanced competitor intelligence",
        "Full API access",
        "Custom integrations",
        "SLA guarantee",
      ],
    },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 mb-6">
          <Star className="w-4 h-4 text-orange-400 mr-2" />
          <span className="text-sm font-medium text-orange-300">
            Transparent Pricing
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Choose Your{" "}
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            Perfect Plan
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Start with our free trial and scale as you grow. All plans include our
          core GEO features.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <span
            className={`text-lg font-medium ${
              !isAnnual ? "text-white" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
              isAnnual ? "bg-orange-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isAnnual ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-lg font-medium ${
              isAnnual ? "text-white" : "text-gray-400"
            }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-gray-800 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              plan.popular
                ? "border-orange-500/50 shadow-xl scale-105"
                : "border-gray-600 hover:border-orange-500/30"
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">
                      ₹
                      {isAnnual
                        ? Math.floor(plan.annualPrice / 12)
                        : plan.monthlyPrice}
                    </span>
                    <span className="text-xl text-gray-400 ml-2">/month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-400 mt-2">
                      Billed annually (₹{plan.annualPrice.toLocaleString()})
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-orange-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/dashboard"
                className={`w-full inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900"
                }`}
              >
                {plan.name === "Enterprise"
                  ? "Contact Sales"
                  : "Start Free Trial"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <p className="text-gray-300 mb-4">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span>Cancel Anytime</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-2" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
