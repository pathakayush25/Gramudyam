/**
 * Gramudyam Trust Tag Utility Functions
 * Handles URL resolution, QR code rendering to high-res PNG,
 * clipboard copying, and identifier formatting.
 */

/**
 * Returns the public application base URL.
 * Prefers VITE_PUBLIC_APP_URL from environment variables,
 * falls back to window.location.origin in browser,
 * or default production domain.
 */
export function getPublicAppUrl() {
  const envUrl = import.meta.env.VITE_PUBLIC_APP_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'https://gramudyam.in';
}

/**
 * Returns the stable, dedicated public Trust Tag verification URL for a product.
 * Route: /trust-tag/:productId
 */
export function getProductTrustTagUrl(productId) {
  if (!productId) return '';
  const baseUrl = getPublicAppUrl();
  return `${baseUrl}/trust-tag/${encodeURIComponent(productId)}`;
}

/**
 * Formats a clean public reference ID for the product's Trust Tag.
 */
export function formatTrustTagId(productId) {
  if (!productId) return 'GM-TRUST-000000';
  if (String(productId).startsWith('GM-TRUST-')) {
    return String(productId);
  }
  const cleanId = String(productId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
  return `GM-TRUST-${cleanId || '000000'}`;
}

/**
 * Formats Indian Rupee currency.
 */
export function formatCurrency(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Copies the product's public Trust Tag URL to the system clipboard.
 */
export async function copyTrustTagUrl(productId) {
  const url = getProductTrustTagUrl(productId);
  if (!url) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard writeText failed, falling back:', err);
  }

  // Fallback for older browsers or restricted iframe contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error('All clipboard copy attempts failed:', fallbackErr);
    return false;
  }
}

/**
 * Generates a high-resolution, print-ready PNG image of the QR Trust Tag
 * and triggers a browser download.
 *
 * @param {Object} options
 * @param {Object} options.product - The product object
 * @param {HTMLCanvasElement} [options.qrCanvas] - Existing rendered QR canvas element
 */
export async function downloadTrustTagPng({ product, qrCanvas }) {
  if (!product || !product.id) {
    throw new Error('Product is required to generate a Trust Tag.');
  }

  const tagId = formatTrustTagId(product.id);
  const productName = product.name || 'Artisan Craft';
  const craftName = product.craft || product.category || 'Handicrafts';
  const location = [product.village || product.artisan?.village, product.district || product.artisan?.district, 'Maharashtra']
    .filter(Boolean)
    .join(', ');

  // Create high-res off-screen canvas (800 x 1060 px - suitable for 300 DPI 2.7"x3.5" tag)
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1060;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context.');
  }

  // 1. Tag Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative outer border (Deep forest green)
  ctx.strokeStyle = '#073827';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Inner subtle border
  ctx.strokeStyle = '#C96F4A';
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

  // 2. Header Area
  ctx.fillStyle = '#073827';
  ctx.textAlign = 'center';

  // Small Badge Pill
  ctx.fillStyle = '#234F3D';
  ctx.beginPath();
  ctx.roundRect(canvas.width / 2 - 140, 56, 280, 36, 18);
  ctx.fill();

  ctx.fillStyle = '#BDEDD5';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('GRAMUDYAM TRUST TAG', canvas.width / 2, 80);

  // Brand Title
  ctx.fillStyle = '#073827';
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillText('ग्रामोद्योग सत्यता मुद्रा', canvas.width / 2, 140);

  ctx.fillStyle = '#964826';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('AUTHENTIC INDIAN CRAFT PROVENANCE', canvas.width / 2, 170);

  // Thin separator
  ctx.strokeStyle = '#E5DAC6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 195);
  ctx.lineTo(canvas.width - 70, 195);
  ctx.stroke();

  // 3. Product Title & Craft
  ctx.fillStyle = '#073827';
  ctx.font = 'bold 28px "Playfair Display", Georgia, serif';
  const displayTitle = productName.length > 36 ? `${productName.slice(0, 33)}...` : productName;
  ctx.fillText(displayTitle, canvas.width / 2, 240);

  ctx.fillStyle = '#555555';
  ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const subtitle = location ? `${craftName} • ${location}` : craftName;
  ctx.fillText(subtitle, canvas.width / 2, 275);

  // 4. Draw QR Code
  const qrSize = 420;
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = 320;

  // White box with border for QR quiet zone
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX - 18, qrY - 18, qrSize + 36, qrSize + 36);
  ctx.strokeStyle = '#E5DAC6';
  ctx.lineWidth = 2;
  ctx.strokeRect(qrX - 18, qrY - 18, qrSize + 36, qrSize + 36);

  if (qrCanvas) {
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
  } else {
    // If no canvas passed, draw placeholder frame
    ctx.fillStyle = '#073827';
    ctx.font = '16px monospace';
    ctx.fillText('QR Code Data', canvas.width / 2, qrY + qrSize / 2);
  }

  // 5. TrustTag Reference Code
  ctx.fillStyle = '#073827';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(tagId, canvas.width / 2, 805);

  // 6. Scan Instruction Callout
  ctx.fillStyle = '#234F3D';
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Scan to discover this product and the artisan behind it.', canvas.width / 2, 850);

  ctx.fillStyle = '#717974';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Scan with normal phone camera • No app download needed', canvas.width / 2, 880);

  // 7. Footer
  ctx.strokeStyle = '#E5DAC6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(90, 920);
  ctx.lineTo(canvas.width - 90, 920);
  ctx.stroke();

  ctx.fillStyle = '#073827';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('GRAMUDYAM • RURAL ARTISAN EMPOWERMENT PLATFORM', canvas.width / 2, 955);

  ctx.fillStyle = '#964826';
  ctx.font = '500 14px monospace';
  const publicUrl = getProductTrustTagUrl(product.id);
  const displayUrl = publicUrl.replace(/^https?:\/\//, '');
  ctx.fillText(displayUrl, canvas.width / 2, 985);

  // Convert to Blob and trigger download
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create image blob from canvas.'));
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = (product.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .slice(0, 30);
      link.download = `Gramudyam_TrustTag_${safeName}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png');
  });
}
