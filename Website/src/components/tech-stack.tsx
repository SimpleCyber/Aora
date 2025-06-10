"use client"

import { siteConfig } from "@/config/site"

export default function TechStack() {
  return (
    <section id="tech" className="py-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-poppins" style={{ color: "var(--foreground)" }}>
            {siteConfig.techStack.title}
          </h2>
          <p className="text-muted">{siteConfig.techStack.subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.techStack.technologies.map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 border border-custom bg-card"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.color }}></div>
              <span className="font-medium" style={{ color: "var(--foreground)" }}>
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
