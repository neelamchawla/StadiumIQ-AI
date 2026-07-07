"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  index?: number;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  index = 0,
  className,
}: FeatureCardProps) {
  const reducedMotion = prefersReducedMotion();

  const card = (
    <Card
      className={cn(
        "group h-full transition-shadow hover:shadow-lg",
        href && "cursor-pointer",
        className,
      )}
    >
      <CardHeader>
        <div
          className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {href && (
        <CardContent>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
            Learn more
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </CardContent>
      )}
    </Card>
  );

  const motionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.4, delay: index * 0.1 },
        whileHover: { y: -4 },
      };

  const content = href ? (
    <Link href={href} className="block h-full" aria-label={`${title}: ${description}`}>
      {card}
    </Link>
  ) : (
    card
  );

  return (
    <motion.article {...motionProps} className="h-full">
      {content}
    </motion.article>
  );
}
