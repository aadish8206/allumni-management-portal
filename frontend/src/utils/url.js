export const ensureProtocol = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

export const getLinkedInVanity = (url) => {
  if (!url) return null;
  const match = url.match(/linkedin\.com\/in\/([^/?#]+)/i);
  return match ? match[1] : null;
};
