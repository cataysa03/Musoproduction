'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils";
import { useState } from "react";

export const ParallaxServices = () => {
    // Array of section data mapped from the services page
    const sections = [
        {
            id: 1,
            title: "Commercial Production",
            subtitle: "01 — Commercial Production",
            description: "We craft commercial campaigns that abandon static corporate tropes in favor of scene logic and deliberate pacing. By treating brand messages like film narratives, we command attention and establish technical authority before a single word of copy is read.",
            imageUrl: '/images/services/DSC08516.jpg',
            reverse: false
        },
        {
            id: 2,
            title: "Documentary & Short Film",
            subtitle: "02 — Documentary & Short Film",
            description: "True luxury design treats whitespace as an active element; our documentary approach treats silence and observation the same way. We uncover the human element behind your organization through empathetic, restraint-driven storytelling.",
            imageUrl: '/images/services/IMG_0294.jpg',
            reverse: true
        },
        {
            id: 3,
            title: "Post-Production & Color",
            subtitle: "03 — Post-Production & Color",
            description: "The edit is where the film is truly written. We apply rigorous post-production standards, utilizing custom film grain textures, deep midnight blue anchors, and warm analog grading to evoke high-end cinema and luxury branding.",
            imageUrl: '/images/services/DSC04258.jpg',
            reverse: false
        }
    ]

    // Create refs and animations for each section
    const sectionRefs = sections.map(() => useRef(null));
    
    const scrollYProgress = sections.map((_, index) => {
        return useScroll({
            target: sectionRefs[index],
            offset: ["start end", "center start"]
        }).scrollYProgress;
    });

    // Create animations for each section
    const opacityContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 0.7], [0, 1])
    );
    
    const clipProgresses = scrollYProgress.map(progress => 
        useTransform(progress, [0, 0.7], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
    );
    
    const translateContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 1], [-50, 0])
    );

  return (
    <div className="w-full">
      <div className="flex flex-col md:px-0 px-10">
            {sections.map((section, index) => (
                <div 
                    key={section.id}
                    ref={sectionRefs[index]} 
                    className={`min-h-screen py-24 flex flex-col md:flex-row items-center justify-center md:gap-40 gap-16 ${section.reverse ? 'md:flex-row-reverse' : ''}`}
                >
                    <motion.div style={{ y: translateContents[index] }} className="flex-1 max-w-lg">
                        <h2 className="text-sm font-body uppercase tracking-widest text-brass mb-6">{section.subtitle}</h2>
                        <h3 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-6">{section.title}</h3>
                        <motion.p 
                            style={{ y: translateContents[index] }} 
                            className="font-body text-neutral-grayBeige font-light leading-relaxed text-lg"
                        >
                            {section.description}
                        </motion.p>
                    </motion.div>
                    <motion.div 
                        style={{ 
                            opacity: opacityContents[index],
                            clipPath: clipProgresses[index],
                        }}
                        className="relative flex-1 flex justify-center items-center w-full"
                    >
                        <div className="aspect-[4/5] w-full max-w-[400px] relative overflow-hidden rounded-lg">
                            <img 
                                src={section.imageUrl} 
                                className="absolute inset-0 w-full h-full object-cover" 
                                alt={section.title}
                            />
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    </div>
  );
};
