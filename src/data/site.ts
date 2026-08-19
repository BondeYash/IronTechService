// Sourced from irontechdetailing.com (Home, AboutUs, Our-Services, Projects, Careers, Contact).

export const site = {
  name: "Irontech Detailing Services Pvt Ltd",
  legalName: "Irontech Steel Detailing Services Pvt Ltd",
  tagline: "The Structural Steel Detailing Company",
  heroHeadline: "Welcome to Irontech Detailing Services Pvt Ltd",
  heroSubline: "The structural steel detailing company",
  ctaHeadline: "Contact For Structural Steel Detailing Services",
  ctaSubline: "Structural detailing services that bring your projects to life",
  legacyUrl: "https://irontechdetailing.com",
  logo: "/assets/logos/irontech.jpg",
  logoTransparent: "/assets/logos/itrans.png",
  favicon: "/assets/logos/favicon.ico",
} as const;

export const contact = {
  email: "ganesh@irontechdetailing.com",
  phone: "+91-99700 74825",
  phoneHref: "tel:+919970074825",
} as const;

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/irontech-detailing/" },
  { label: "Instagram", href: "https://www.instagram.com/irontechdetailing" },
] as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Our Projects", href: "/projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
] as const;

// old path -> new path, for redirects in next.config.ts
export const legacyRoutes = {
  "/Home": "/",
  "/AboutUs": "/about",
  "/Our-Services": "/services",
  "/Projects": "/projects",
  "/Careers": "/careers",
  "/Contact": "/contact",
} as const;
