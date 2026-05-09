export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Zyra",
    "description": "Premium silk and cotton sarees online store",
    "url": "https://www.zyrastyllz.com",
    "logo": "https://www.zyrastyllz.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Tamil"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, UPI"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}