import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export const SEO = ({ title, description, image, url }: SEOProps) => {
  const siteTitle = "Zovallo | Premium Furniture Boutique";
  const fullTitle = `${title} | ${siteTitle}`;
  const siteDescription = "Masterfully crafted premium furniture blending traditional joinery with modern silhouettes. Discover our walnut and olive collection.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || siteDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || siteDescription} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || siteDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};
