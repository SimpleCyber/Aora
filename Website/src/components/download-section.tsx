"use client"

import { Download, Github } from "lucide-react"
import { siteConfig } from "@/config/site"

export default function DownloadSection() {
  const handleDownload = () => {
    window.open(siteConfig.downloadUrl, "_blank")
  }

  return (
    <section id="download" className="py-20" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins" style={{ color: "var(--foreground)" }}>
            {siteConfig.download.title}
          </h2>
          <p className="text-xl text-muted">{siteConfig.download.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-3 px-8 py-4 rounded-xl font-semibold"
            >
              <Download className="w-5 h-5" />
              Download APK
            </button>

            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-3 px-8 py-4 rounded-xl font-semibold"
            >
              <Github className="w-5 h-5" />
              View Source Code
            </a>
          </div>

          <div className="rounded-xl p-6 max-w-2xl mx-auto border border-custom bg-card">
            <h3 className="text-lg font-semibold mb-3 font-poppins text-primary">Development Phases</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {siteConfig.download.phases.map((phase, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
                    {phase.title}
                  </h4>
                  <p className="text-sm text-muted">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
