import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    jsonLd?: any;
}

const SEO = ({
    title,
    description,
    keywords = "TalentHub, việc làm IT, tuyển dụng lập trình viên, freelancer Việt Nam",
    ogImage = "https://talenthub.io.vn/thumbnail.png",
    ogType = "website",
    canonicalUrl = "",
    jsonLd = null
}: SEOProps) => {
    const siteUrl = "https://talenthub.io.vn";
    const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Canonical */}
            <link rel="canonical" href={fullUrl} />

            {/* Alternative Language */}
            <link rel="alternate" hreflang="vi" href={fullUrl} />
            <link rel="alternate" hreflang="x-default" href={fullUrl} />

            {/* JSON-LD structured data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;