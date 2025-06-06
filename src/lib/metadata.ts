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
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${fullTitle} - Image`,
        },
      ],
    },
    twitter: {
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "og:url": url,
      "og:image": image,
      "twitter:url": url,
      "linkedin:url": url,
    }
  }
}