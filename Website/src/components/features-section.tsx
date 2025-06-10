"use client"

import { Lock, Home, RefreshCcw, Search, Upload, User } from "lucide-react"
import { siteConfig } from "@/config/site"

const iconMap = {
  Lock,
  Home,
  RefreshCcw,
  Search,
  Upload,
  User,
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-poppins" style={{ color: "var(--foreground)" }}>
            {siteConfig.features.title}
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-muted">{siteConfig.features.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.features.items.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
            return (
              <div
                key={index}
                className="rounded-xl p-6 transition-all duration-300 group hover:scale-105 border border-custom bg-card"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "var(--primary-light)" }}
                >
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-poppins" style={{ color: "var(--foreground)" }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
