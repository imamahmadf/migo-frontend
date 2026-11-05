"use client";

import { useEffect, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
};

export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  const shared = {
    ref: setNode,
    className: `reveal ${visible ? "is-visible" : ""} ${className}`.trim(),
    style: { transitionDelay: `${delay}ms` },
  };

  if (as === "li") {
    return <li {...shared}>{children}</li>;
  }

  return <div {...shared}>{children}</div>;
}
