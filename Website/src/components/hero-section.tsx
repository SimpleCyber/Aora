"use client"

import { useState, useEffect } from "react"
import { Star, Download, Check } from "lucide-react"
import RotatingPhone from "./rotating-phone"
import { siteConfig } from "@/config/site"

export default function HeroSection() {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([])

  useEffect(() => {
    siteConfig.hero.features.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFeatures((prev) => [...prev, index])
      }, index * 500)
    })
  }, [])

  const handleDownload = () => {
    window.open(siteConfig.downloadUrl, "_blank")
  }

  return (
    <section className="min-h-screen pt-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-poppins">
                <span style={{ color: "var(--foreground)" }}>{siteConfig.hero.title} </span>
                <span className="gradient-text">{siteConfig.hero.titleAccent}</span>
              </h1>

              {/* Animated Features List */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold font-poppins text-primary">Features:</h3>
                <div className="space-y-3">
                  {siteConfig.hero.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        visibleFeatures.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg text-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 group bg-primary text-white"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download APK
            </button>

            {/* Rating */}
            <div className="flex items-center gap-3 p-4 rounded-xl w-fit border border-custom bg-card">
              <div className="flex gap-1">
                {[...Array(siteConfig.hero.rating.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold font-poppins" style={{ color: "var(--foreground)" }}>
                {siteConfig.hero.rating.score}
              </span>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <RotatingPhone />
          </div>
        </div>
      </div>
    </section>
  )
}
