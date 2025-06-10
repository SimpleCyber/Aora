"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Moon, Sun, Film, Github, Linkedin, Twitter, X } from "lucide-react"
import { useTheme } from "next-themes"
import { siteConfig } from "@/config/site"

const iconMap = {
  Github,
  Linkedin,
  Twitter,
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-custom"
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-gradient-primary">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl font-poppins" style={{ color: "var(--foreground)" }}>
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {siteConfig.navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium transition-colors duration-300 hover-primary text-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Social & Theme */}
          <div className="hidden md:flex items-center space-x-4">
            {siteConfig.socialLinks.slice(0, 3).map((social, index) => {
              const IconComponent = iconMap[social.icon as keyof typeof iconMap]
              return (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 transition-colors duration-300 hover-primary text-muted"
                >
                  <IconComponent className="w-5 h-5" />
                </Link>
              )
            })}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 transition-colors duration-300 hover-primary text-muted"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              href="#download"
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-300 bg-primary text-white"
            >
              Get App
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 transition-colors duration-300 text-muted"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 transition-colors duration-300 text-muted"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="fixed inset-0 top-16 z-50">
              <div
                className="fixed inset-0"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onClick={() => setIsMenuOpen(false)}
              />
              <div
                className="fixed right-0 top-0 h-full w-[300px] p-6 border-l border-custom"
                style={{ backgroundColor: "var(--nav-bg)" }}
              >
                <div className="flex flex-col space-y-6">
                  {siteConfig.navigation.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium transition-colors hover-primary text-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t pt-6 border-custom">
                    <div className="flex space-x-4 mb-6">
                      {siteConfig.socialLinks.slice(0, 3).map((social, index) => {
                        const IconComponent = iconMap[social.icon as keyof typeof iconMap]
                        return (
                          <Link
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 transition-colors hover-primary text-muted"
                          >
                            <IconComponent className="w-5 h-5" />
                          </Link>
                        )
                      })}
                    </div>
                    <Link
                      href="#download"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center py-3 rounded-lg font-medium transition-colors bg-primary text-white"
                    >
                      Get App
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
