"use client";

import React from "react";

interface AIPlatformLogoProps {
  platform: string;
  size?: number;
  className?: string;
}

export default function AIPlatformLogo({
  platform,
  size = 24,
  className = "",
}: AIPlatformLogoProps) {
  const logoComponents: { [key: string]: React.ReactNode } = {
    ChatGPT: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient
            id="chatgpt-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#10a37f" />
            <stop offset="100%" stopColor="#1a7f64" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          fill="url(#chatgpt-gradient)"
        />
      </svg>
    ),
    Perplexity: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient
            id="perplexity-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          fill="url(#perplexity-gradient)"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="url(#perplexity-gradient)"
          opacity="0.3"
        />
      </svg>
    ),
    "Google AI": (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285f4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34a853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#fbbc05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#ea4335"
        />
      </svg>
    ),
    Gemini: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient
            id="gemini-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff6d01" />
            <stop offset="100%" stopColor="#ff8c00" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          fill="url(#gemini-gradient)"
        />
        <path
          d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
          fill="url(#gemini-gradient)"
          opacity="0.3"
        />
      </svg>
    ),
    Claude: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient
            id="claude-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ee5a52" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          fill="url(#claude-gradient)"
        />
        <circle cx="12" cy="12" r="2" fill="white" opacity="0.8" />
      </svg>
    ),
    Copilot: (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <defs>
          <linearGradient
            id="copilot-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0078d4" />
            <stop offset="100%" stopColor="#106ebe" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          fill="url(#copilot-gradient)"
        />
        <path
          d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
          fill="white"
          opacity="0.2"
        />
      </svg>
    ),
  };

  return (
    <div className="flex items-center justify-center">
      {logoComponents[platform] || (
        <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">
            {platform.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}
