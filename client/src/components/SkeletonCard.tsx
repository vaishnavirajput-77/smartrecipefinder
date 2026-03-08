'use client';

import { motion } from 'framer-motion';

interface SkeletonCardProps {
    count?: number;
}

export default function SkeletonCard({ count = 6 }: SkeletonCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--card-border)]"
                >
                    <div className="skeleton aspect-[4/3] rounded-none" />
                    <div className="p-4 space-y-3">
                        <div className="skeleton h-5 w-3/4" />
                        <div className="flex gap-4">
                            <div className="skeleton h-4 w-20" />
                            <div className="skeleton h-4 w-16" />
                        </div>
                        <div className="skeleton h-6 w-24 rounded-lg" />
                    </div>
                </motion.div>
            ))}
        </>
    );
}
