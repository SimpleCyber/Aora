export const siteConfig = {
  name: "Aora",
  title: "Aora - Video Sharing Platform",
  description:
    "Aora is a full-stack React Native application designed to provide users with a seamless experience for browsing and interacting with video content. This app includes features like dynamic home screens, robust authentication, and engaging animations.",
  keywords:
    "video sharing app, react native, full stack, video app, secure authentication, media upload, dynamic UI, mobile app",
  author: "Satyam Yadav",

  // URLs
  downloadUrl: "https://github.com/SimpleCyber/Movie-App/raw/main/aora.apk",
  githubUrl: "https://github.com/SimpleCyber/Aora",

  // Hero section
  hero: {
    title: "Discover Engaging Videos",
    titleAccent: "with Aora",
    features: [
      "Seamless & Secure Authentication Experience",
      "Dynamic Home Screen with Trending Videos",
      "Full-Text Search Across All Video Content",
      "Upload, Share, and Interact with Videos Effortlessly",
    ],
    rating: {
      stars: 5,
      score: "4.9 out of 5",
    },
  },

  // Features section
  features: {
    title: "Powerful Features for Video Lovers",
    subtitle:
      "Built with cutting-edge technologies including React Native, Expo, NativeWind, Appwrite, and modern animations for the ultimate video experience.",
    items: [
      {
        icon: "Lock",
        title: "Secure Authentication",
        description: "Robust login and signup system to ensure user data is safe and protected.",
      },
      {
        icon: "Home",
        title: "Dynamic Home Screen",
        description: "Visually engaging home screen with latest and trending video content.",
      },
      {
        icon: "RefreshCcw",
        title: "Pull-to-Refresh",
        description: "Refresh your feed and content effortlessly with native pull-to-refresh gestures.",
      },
      {
        icon: "Search",
        title: "Full-Text Search",
        description: "Easily find videos using a powerful full-text search feature.",
      },
      {
        icon: "Upload",
        title: "Media Upload",
        description: "Upload and share videos directly from your device.",
      },
      {
        icon: "User",
        title: "Profile Screen",
        description: "Manage your profile with personalized settings and video lists.",
      },
    ],
  },

  // Tech stack
  techStack: {
    title: "Built with Modern Technologies",
    subtitle: "Leveraging the latest tools and frameworks for optimal performance",
    technologies: [
      { name: "React Native", color: "#61dafb" },
      { name: "Expo", color: "#ff8500" },
      { name: "NativeWind", color: "#06b6d4" },
      { name: "Appwrite", color: "#f02e65" },
      { name: "TypeScript", color: "#3178c6" },
      { name: "React Navigation", color: "#fca311" }, 
    ],
  },

  // Download section
  download: {
    title: "Ready to Explore and Share Videos?",
    subtitle: "Download Aora now and start your video discovery journey",
    phases: [
      {
        title: "✅ Phase 1: Setup & Configuration",
        description: "Initial setup with Expo, Tailwind integration, and authentication",
      },
      {
        title: "✅ Phase 2: Navigation & Home Screen",
        description: "Tab navigation, dynamic home screen, and animations",
      },
      {
        title: "✅ Phase 3: Search & Upload Features",
        description: "Full-text search and media upload functionality",
      },
      {
        title: "✅ Phase 4: Profile & Personalization",
        description: "User profile management with personalized settings",
      },
    ],
  },

  // Navigation
  navigation: [
    { href: "#features", label: "Features" },
    { href: "#tech", label: "Tech Stack" },
    { href: "#download", label: "Download" },
  ],

  // Social links
  socialLinks: [
    {
      href: "https://github.com/SimpleCyber",
      icon: "Github",
      label: "GitHub",
    },
    {
      href: "https://linkedin.com/in/satyam-yada",
      icon: "Linkedin",
      label: "LinkedIn",
    },
    {
      href: "https://x.com/Satyam_yadav_04",
      icon: "Twitter",
      label: "Twitter",
    },
    {
      href: "https://leetcode.com/u/yadav-satyam",
      icon: "LC",
      label: "LeetCode",
    },
  ],

  // Footer
  footer: {
    description:
      "Aora is a full-stack React Native application designed to provide users with a seamless experience for browsing and interacting with video content.",
    quickLinks: [
      { href: "#features", label: "Features" },
      { href: "#tech", label: "Tech Stack" },
      { href: "#download", label: "Download" },
    ],
    copyright: "Built with ❤️ by",
  },

  // Screenshots for rotating phone
  screenshots: [
    { src: "/images/landing.jpg", alt: "Landing Screen", title: "Landing" },
    { src: "/images/auth.jpg", alt: "Sign up", title: "Sign up" },
    { src: "/images/home.jpg", alt: "Home Screen", title: "Home" },
    { src: "/images/bookmark.jpg", alt: "Media Upload", title: "Bookmark" },
    { src: "/images/create.jpg", alt: "Search Screen", title: "Create Post" },
    { src: "/images/profile.jpg", alt: "User Profile", title: "Profile" },
  ],
}

export type SiteConfig = typeof siteConfig
