"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is the difference between GEO and SEO?",
      answer:
        "Unlike SEO, which is one-dimensional and cares about ranking on the SERP, GEO is two-dimensional, where being mentioned matters, but how you are mentioned is just as important. GEO focuses on optimizing for AI search engines like ChatGPT, Perplexity, and Google's AI Overviews.",
    },
    {
      question: "How can I increase my AI visibility?",
      answer:
        "Optimize for AI readability, leverage structured data, focus on quality content, and monitor and adapt. Our platform helps you achieve all of the above in one unified solution with actionable recommendations and real-time monitoring.",
    },
    {
      question: "Is GEO going to be more important than SEO?",
      answer:
        "The future of search is generative. Even Google is coming out with its own generative search called AI Mode beyond just AI Overviews. As the search architecture increasingly shifts to generative search, GEO will become increasingly a necessity for all businesses.",
    },
    {
      question:
        "Is there a benefit to optimize for GEO now when most people still use normal search engines?",
      answer:
        "There is an early mover advantage to optimizing for GEO. Much like how many businesses are built on SEO, companies that adopt GEO now position themselves to be leaders as AI search grows. You'll be ahead of your competitors when AI search becomes mainstream.",
    },
    {
      question: "Which AI platforms do you monitor?",
      answer:
        "We monitor all major AI platforms including ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, Copilot, Grok, and more. Our platform continuously adds support for new AI engines as they emerge.",
    },
    {
      question: "How accurate is your citation detection?",
      answer:
        "Our AI-powered citation detection has 99.2% accuracy. We use advanced machine learning algorithms to identify and track citations across multiple AI platforms, ensuring you get reliable insights about your brand's AI visibility.",
    },
    {
      question: "Can I track my competitors' AI visibility?",
      answer:
        "Yes! Our Professional and Enterprise plans include comprehensive competitor analysis. You can monitor how your competitors are performing across AI platforms and identify opportunities to improve your own visibility.",
    },
    {
      question: "Do you offer custom integrations?",
      answer:
        "Yes, our Enterprise plan includes custom integrations with your existing tools and workflows. We also provide full API access for advanced users who want to build custom solutions.",
    },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-6">
          <HelpCircle className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">
            Frequently Asked Questions
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Got{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Questions?
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about GEO, our platform, and how to
          get started.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0">
                {openIndex === index ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Minus className="w-4 h-4 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </button>

            {openIndex === index && (
              <div className="px-8 pb-6">
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you get the most out of GEO Search
            Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
