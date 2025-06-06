import type { Metadata } from "next"

export function createMetadata({
  title,
  description,
  path = "",
  image = "/devsLogo.png",
}: {
  title?: string
  description?: string
  path?: string
  image?: string
}): Metadata {
  const baseTitle = "Developers Club of TSEC"
  const baseDescription = "Creators of the official TSEC App and innovative tech solutions for the TSEC community"
  const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} | TSEC Devs Club`
  const fullDescription = description || baseDescription
  const url = `https://tsecdevsclub.com${path}`

  return {
    metadataBase: new URL("https://tsecdevsclub.com"),
    title: fullTitle,
    description: fullDescription,
    keywords: [
      "TSEC",
      "developers club",
      "tech",
      "programming",
      "coding",
      "student developers",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    authors: [{ name: "TSEC Developers Club" }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      type: "website",
      url,
      siteName: "TSEC Developers Club",
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${fullTitle} - TSEC Devs Club Banner`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
      creator: "@tsecdevsclub",
    },
    other: {
      "facebook-domain-verification": "[your-verification-code]",
      "linkedin:owner": "tsecdevsclub",
      "instagram:creator": "tsecdevsclub",
    },
  }
}
