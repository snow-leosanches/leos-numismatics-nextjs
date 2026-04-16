"use client";

import { useState } from "react";
import { trackCustomerIdentificationSpec } from "../../snowtype/snowplow";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);
  const [disabled, setDisabled] = useState(false);

  const subscribe = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setFeedback({ message: "Enter an email address.", error: true });
      return;
    }
    if (!isValidEmail(trimmed)) {
      setFeedback({ message: "Enter a valid email address.", error: true });
      return;
    }

    trackCustomerIdentificationSpec({ email: trimmed, phone: null });

    setFeedback({ message: "Subscribed!", error: false });
    setEmail("");
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
      setFeedback(null);
    }, 3000);
  };

  return (
    <section className="border-t border-neutral-200 dark:border-neutral-800 py-10">
      <div className="container mx-auto px-4 max-w-screen-xl flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Stay in the loop
        </p>
        <div className="flex gap-2 w-full max-w-sm">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="your@email.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !disabled && subscribe()}
            className="flex-1 rounded-full border border-solid border-gray-300 dark:border-gray-600 bg-transparent text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={subscribe}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
          >
            Subscribe
          </button>
        </div>
        {feedback && (
          <p
            aria-live="polite"
            className={`text-sm ${feedback.error ? "text-red-500" : "text-green-600 dark:text-green-400"}`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </section>
  );
}
