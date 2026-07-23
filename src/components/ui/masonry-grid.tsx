"use client";

import * as React from 'react';
import {
  motion,
  useInView,
  type Variants,
} from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a `cn` utility from shadcn

/**
 * Props for the MasonryGrid component.
 * @template T - The type of the items in the grid.
 */
interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: string;
  staggerDelay?: number;
}

const MasonryGrid = <T,>({
  items,
  renderItem,
  className,
  gap = '1rem',
  staggerDelay = 0.05,
}: MasonryGridProps<T>) => {
  const containerRef = React.useRef(null);
  // `amount` is a fraction of the *whole* container's height. On mobile the
  // grid falls back to a single CSS column (columns-1), so all items stack
  // vertically and the container becomes much taller than on desktop's
  // multi-column layout — a 20% threshold could require scrolling well past
  // the point where items should already be visible. Trigger as soon as any
  // part of the container enters the viewport instead.
  const isInView = useInView(containerRef, { once: true, amount: 0 });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // WebKit (Safari/iOS) mis-renders children with a `transform` (translate/scale)
  // inside a CSS multi-column container (`column-count`/`columns-*`) — items can
  // end up invisible or clipped instead of just animating in. This grid uses
  // CSS columns for the masonry layout, so the entrance animation is opacity-only
  // to avoid triggering that bug on mobile Safari.
  const itemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn('w-full', className)}
      style={{ columnGap: gap }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      role="list"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="mb-4 break-inside-avoid [content-visibility:auto] [contain-intrinsic-size:0_300px]"
          variants={itemVariants}
          role="listitem"
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MasonryGrid;
