"use client"

import { Github, Linkedin, Twitter, Film } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "@/config/site"

const iconMap = {
  Github,
  Linkedin,
  Twitter,
  LC: ({ className }: { className?: string }) => <span className={`text-sm font-bold ${className}`}>LC</span>,
}

export default function Footer() {
  return (
    <footer className="border-t border-custom bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-primary">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl font-poppins" style={{ color: "var(--foreground)" }}>
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-muted">{siteConfig.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold font-poppins" style={{ color: "var(--foreground)" }}>
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2">
              {siteConfig.footer.quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover-primary text-muted">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold font-poppins" style={{ color: "var(--foreground)" }}>
              Connect with me
            </h3>
            <div className="flex space-x-4">
              {siteConfig.socialLinks.map((social, index) => {
                const IconComponent = iconMap[social.icon as keyof typeof iconMap]
                return (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 text-muted"
                    style={{ backgroundColor: "var(--card-bg)" }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center border-custom">
          <p className="text-muted">
            © {new Date().getFullYear()} {siteConfig.name}. {siteConfig.footer.copyright}{" "}
            <Link href={siteConfig.socialLinks[0].href} className="hover:underline text-primary">
              {siteConfig.author}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
