import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import { QRCodeView } from '../../components/QRCodeView';
import confetti from 'canvas-confetti';

export const ProductPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addOrUpdateProduct } = useProducts();
  const { lang } = useLanguage();
  const fileInputRef = useRef(null);

  // State for product details
  const [product, setProduct] = useState(() => {
    if (location.state?.draftProduct) {
      return location.state.draftProduct;
    }
    try {
      const draft = localStorage.getItem('gramudyam_draft_product');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (!parsed.isPublished) return parsed;
      }
    } catch {}
    return {
      id: String(Date.now()),
      name: "Traditional Warli Tribal Art",
      nameMr: "पारंपरिक वारली चित्रकला",
      category: "Handicrafts & Tribal Art",
      price: 1200,
      originalPrice: 1500,
      image: "https://lh3.googleusercontent.com/aida/AEtjO1X3LEEY6ALq7o8roki26KHrB7VZgQBBySHXkwLk9SDfdYFAxEOw5Sp1qsd5pxT-LLfTMYihu3k3YwHmAGRDKE61Zk5YQvucYVhf2XnzMMYpr1pb3o6VOqzL2PVFqIDp7GkrLYtnh_O-SyAO7SORHBtD37h_qo4t6TVyMk76q47EjuQ-C9Es5nPhUPXJkWyEZdkdbIztkyNSm1Zo5c8NUF84bBQe5O5--W07bvG3xWkXH5okp0nT6uDUMJ4F",
      artisan: {
        name: "Savita Patil",
        nameMr: "सविता पाटील",
        role: "Master Artisan",
        village: "Ganjad, Dahanu",
        district: "Palghar",
        cluster: "Dahanu Tribal Collective",
        shgName: "Adivasi Mahila Warli Kala Bachat Gat"
      },
      trustTagId: "GM-TRUST-0012",
      blockHash: "0x89b1420af12c98d64115f2",
      description: "Hand-painted traditional Warli painting on cow-dung and red mud primed canvas board using organic rice paste paint and hand-carved bamboo twigs.",
      story: "Passed down across maternal generations in northern Sahyadri villages.",
      qualityScore: 94,
      isPublished: false,
      isEditing: false,
      scansCount: 1,
      remittancePercent: 86.2
    };
  });

  const [published, setPublished] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Keep state updated if navigated with a new draftProduct state
  const prevDraftRef = useRef(location.state?.draftProduct);
  useEffect(() => {
    if (location.state?.draftProduct && location.state.draftProduct !== prevDraftRef.current) {
      prevDraftRef.current = location.state.draftProduct;
      setProduct(location.state.draftProduct);
      setPublished(false);
      setUploadStatus(null);
    }
  }, [location.state?.draftProduct]);

  // Helper to save updated product state to localStorage
  const updateProductState = (newProductData) => {
    setProduct(newProductData);
    try {
      localStorage.setItem('gramudyam_draft_product', JSON.stringify(newProductData));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  };

  // File Picker Trigger
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Image Upload & Validation Handler
  const handleImageFileSelect = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    // Reset status
    setUploadStatus(null);

    // 1. File Type Validation (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileNameLower = file.name.toLowerCase();
    const isValidExt = fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg') || fileNameLower.endsWith('.png') || fileNameLower.endsWith('.webp');

    if (!validTypes.includes(file.type) && !isValidExt) {
      setUploadStatus({
        type: 'error',
        message: lang === 'mr'
          ? 'कृपया JPG, PNG किंवा WEBP फॉरमॅटमधील फोटो अपलोड करा.'
          : lang === 'hi'
          ? 'कृपया JPG, PNG या WEBP प्रारूप में फोटो अपलोड करें।'
          : 'Please upload a JPG, PNG, or WEBP image.'
      });
      event.target.value = '';
      return;
    }

    // 2. File Size Validation (Max 5 MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE_BYTES) {
      setUploadStatus({
        type: 'error',
        message: lang === 'mr'
          ? 'फोटोची साईज 5 MB पेक्षा कमी असावी.'
          : lang === 'hi'
          ? 'फोटो का आकार 5 MB से कम होना चाहिए।'
          : 'Image size must be less than 5 MB.'
      });
      event.target.value = '';
      return;
    }

    // 3. Read file & update state
    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      const updatedProduct = {
        ...product,
        image: imageDataUrl,
        images: [imageDataUrl, ...(product.images || []).slice(1)]
      };

      updateProductState(updatedProduct);
      setIsUploading(false);
      setUploadStatus({
        type: 'success',
        message: lang === 'mr'
          ? '✓ उत्पादनाचा फोटो यशस्वीपणे अपलोड झाला'
          : lang === 'hi'
          ? '✓ उत्पाद की फोटो सफलतापूर्वक अपलोड हो गई'
          : '✓ Product image uploaded'
      });

      // Clear input element so re-selecting same file triggers onChange
      event.target.value = '';

      // Auto dismiss success notice after 4 seconds
      setTimeout(() => {
        setUploadStatus((prev) => (prev?.type === 'success' ? null : prev));
      }, 4000);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadStatus({
        type: 'error',
        message: lang === 'mr'
          ? 'फोटो अपलोड करणे शक्य झाले नाही. कृपया पुन्हा प्रयत्न करा.'
          : lang === 'hi'
          ? 'फोटो अपलोड नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Unable to upload image. Please try again.'
      });
      event.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  // Remove Image Handler
  const handleRemoveImage = () => {
    const updatedProduct = {
      ...product,
      image: '',
      images: [],
      image_url: ''
    };
    updateProductState(updatedProduct);
    setUploadStatus({
      type: 'success',
      message: lang === 'mr'
        ? 'फोटो काढला गेला आहे. नवीन फोटो अपलोड करा.'
        : lang === 'hi'
        ? 'फोटो हटा दिया गया है। नई फोटो अपलोड करें।'
        : 'Product image removed.'
    });

    setTimeout(() => {
      setUploadStatus((prev) => (prev?.message?.includes('removed') || prev?.message?.includes('काढला') ? null : prev));
    }, 3000);
  };

  const handlePublish = async () => {
    if (published || isUploading) return;

    setIsUploading(true);
    setUploadStatus(null);
    let newlyUploadedPath = null;

    try {
      // Get the authenticated artisan (from Supabase auth session or AuthContext)
      const {
        data: { user: authUser },
        error: authError
      } = await supabase.auth.getUser();

      if (authError) {
        console.warn('Supabase auth notice:', authError);
      }

      const effectiveUser = authUser || user;

      if (!effectiveUser?.id) {
        throw new Error(
          lang === 'mr'
            ? 'कृपया प्रकाशित करण्यापूर्वी नोंदणीकृत खात्याने लॉग इन करा.'
            : lang === 'hi'
            ? 'कृपया प्रकाशित करने से पहले अपने पंजीकृत खाते से लॉगिन करें।'
            : 'Please sign in with your registered account before publishing.'
        );
      }

      const name = String(product.name || '').trim();
      const price = Number(product.price);
      if (!name) throw new Error('Please enter a product name.');
      if (!Number.isFinite(price) || price < 0) {
        throw new Error('Please enter a valid product price.');
      }

      let imageUrl = product.image_url || '';

      // Images selected in this page are stored as data URLs until publishing.
      if (typeof product.image === 'string' && product.image.startsWith('data:image/')) {
        const imageResponse = await fetch(product.image);
        const imageBlob = await imageResponse.blob();
        if (imageBlob.size > 5 * 1024 * 1024) {
          throw new Error('Image size must be 5 MB or less.');
        }

        const extensionByMimeType = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp'
        };
        const extension = extensionByMimeType[imageBlob.type];
        if (!extension) {
          throw new Error('Please upload a JPG, PNG, or WEBP image.');
        }

        const filePath = `${effectiveUser.id}/${crypto.randomUUID()}.${extension}`;
        const { error: imageUploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageBlob, {
            contentType: imageBlob.type,
            upsert: false
          });

        if (imageUploadError) {
          const errMsg = imageUploadError.message || '';
          if (
            errMsg.toLowerCase().includes('bucket not found') ||
            imageUploadError.statusCode === '404' ||
            imageUploadError.code === 'NoSuchBucket'
          ) {
            throw new Error(
              lang === 'mr'
                ? 'सुपाबेस स्टोरेज बकेट "product-images" सापडली नाही. कृपया सुपाबेस डॅशबोर्डमध्ये (Storage > New Bucket) "product-images" बकेट तयार करा.'
                : lang === 'hi'
                ? 'सुपाबेस स्टोरेज बकेट "product-images" नहीं मिली। कृपया सुपाबेस डैशबोर्ड (Storage > New Bucket) में "product-images" बकेट बनाएं।'
                : 'Supabase Storage bucket "product-images" was not found. Please create the "product-images" public bucket in your Supabase Dashboard (Storage > New Bucket).'
            );
          }
          throw imageUploadError;
        }

        newlyUploadedPath = filePath;
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      } else if (!imageUrl && typeof product.image === 'string' && /^https?:\/\//i.test(product.image)) {
        imageUrl = product.image;
      }

      const rawStock = Number(product.stock_quantity ?? product.stockQuantity ?? 1);
      const productRow = {
        artisan_id: effectiveUser.id,
        name,
        description: String(product.description || product.story || ''),
        price,
        stock_quantity: Number.isFinite(rawStock) ? Math.max(0, Math.floor(rawStock)) : 1,
        category: product.category || 'Handicrafts & Tribal Art',
        craft: product.craft || product.category || 'Handicrafts',
        village: product.artisan?.village || product.location || '',
        district: product.artisan?.district || 'Palghar',
        image_url: imageUrl || null,
        is_available: true
      };

      // Genuinely NEW product vs editing an existing product:
      // An edit MUST be explicit with isEditing: true and a valid supabaseId.
      // A new product creation ALWAYS performs .insert() to generate a brand new UUID row.
      const isExplicitEdit = Boolean(product.isEditing && product.supabaseId);

      let savedProduct;
      let saveError;
      if (isExplicitEdit) {
        const result = await supabase
          .from('products')
          .update({ ...productRow, updated_at: new Date().toISOString() })
          .eq('id', product.supabaseId)
          .eq('artisan_id', effectiveUser.id)
          .select()
          .single();
        savedProduct = result.data;
        saveError = result.error;
      } else {
        const result = await supabase
          .from('products')
          .insert(productRow)
          .select()
          .single();
        savedProduct = result.data;
        saveError = result.error;
      }

      if (saveError) throw saveError;
      if (!savedProduct) throw new Error('Supabase did not return the saved product.');

      const defaultImage =
        'https://lh3.googleusercontent.com/aida/AEtjO1X3LEEY6ALq7o8roki26KHrB7VZgQBBySHXkwLk9SDfdYFAxEOw5Sp1qsd5pxT-LLfTMYihu3k3YwHmAGRDKE61Zk5YQvucYVhf2XnzMMYpr1pb3o6VOqzL2PVFqIDp7GkrLYtnh_O-SyAO7SORHBtD37h_qo4t6TVyMk76q47EjuQ-C9Es5nPhUPXJkWyEZdkdbIztkyNSm1Zo5c8NUF84bBQe5O5--W07bvG3xWkXH5okp0nT6uDUMJ4F';

      const publishedProduct = {
        ...product,
        id: savedProduct.id,
        supabaseId: savedProduct.id,
        artisan_id: savedProduct.artisan_id,
        name: savedProduct.name,
        description: savedProduct.description,
        price: Number(savedProduct.price),
        stock_quantity: savedProduct.stock_quantity,
        inStock: savedProduct.stock_quantity,
        category: savedProduct.category,
        craft: savedProduct.craft,
        village: savedProduct.village,
        district: savedProduct.district,
        image: savedProduct.image_url || product.image || defaultImage,
        image_url: savedProduct.image_url || '',
        is_available: savedProduct.is_available,
        isPublished: true,
        isEditing: false,
        isDemo: false,
        trustTagId: product.trustTagId || `GM-TRUST-${String(savedProduct.id).replace(/-/g, '').slice(0, 6).toUpperCase()}`,
        blockHash: product.blockHash || `0x${String(savedProduct.id).replace(/-/g, '').slice(0, 16)}`
      };

      // Keep the existing app's ProductContext and local catalog in sync.
      addOrUpdateProduct(publishedProduct);
      setProduct(publishedProduct);

      // Successfully published: remove the completed draft so the next product starts completely fresh
      try {
        localStorage.removeItem('gramudyam_draft_product');
      } catch (storageError) {
        console.warn('Could not clear local product draft:', storageError);
      }

      setPublished(true);
      setUploadStatus({
        type: 'success',
        message: 'Product saved successfully to the Gramudyam database.'
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (error) {
      console.error('Product publishing error:', error);

      // Preserve typed product data in localStorage draft so nothing is lost if save fails
      try {
        localStorage.setItem('gramudyam_draft_product', JSON.stringify(product));
      } catch {}

      // Remove the newly uploaded image if the database insert/update failed.
      if (newlyUploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from('product-images')
          .remove([newlyUploadedPath]);
        if (cleanupError) console.warn('Image cleanup failed:', cleanupError);
      }

      setUploadStatus({
        type: 'error',
        message: error?.message || 'Unable to publish the product. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleImageFileSelect}
      />

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.35rem' }}>
            Step 4 of 5 • पूर्वावलोकन
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            E-Commerce Listing Preview
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            Review how your voice-generated listing appears to national buyers, upload product photo, and inspect its new TrustTag QR seal.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/entrepreneur/voice-create', { state: { draftProduct: product } })}
            className="btn-cream"
          >
            <span className="material-symbols-outlined">edit</span>
            <span>Edit with Voice</span>
          </button>

          {!published ? (
            <button onClick={handlePublish} disabled={isUploading || published} className="btn-primary btn-lg">
              <span className="material-symbols-outlined">{isUploading ? 'progress_activity' : 'rocket_launch'}</span>
              <span>{isUploading ? 'Publishing...' : 'Publish to Marketplace (विक्री सुरू करा)'}</span>
            </button>
          ) : (
            <Link to="/marketplace" className="btn-secondary btn-lg">
              <span className="material-symbols-outlined">visibility</span>
              <span>View in Marketplace</span>
            </Link>
          )}
        </div>
      </div>

      {published && (
        <div style={{ backgroundColor: 'var(--success-container)', color: 'var(--success)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>check_circle</span>
          <span>Congratulations! Your product is now live on the public Gramudyam marketplace.</span>
        </div>
      )}

      {uploadStatus && (
        <div role="status" style={{ backgroundColor: uploadStatus.type === 'error' ? 'var(--error-container)' : 'var(--success-container)', color: uploadStatus.type === 'error' ? 'var(--error)' : 'var(--success)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', fontWeight: '600' }}>
          {uploadStatus.message}
        </div>
      )}

      {/* Main Preview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Left: Product Card Preview & Upload Centerpiece */}
        <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          {/* Upload Status Banner */}
          {uploadStatus && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: uploadStatus.type === 'error' ? 'var(--error-container)' : 'var(--primary-container)',
                color: uploadStatus.type === 'error' ? 'var(--error)' : 'white'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {uploadStatus.type === 'error' ? 'error' : 'check_circle'}
              </span>
              <span>{uploadStatus.message}</span>
            </div>
          )}

          {/* Product Image Container (Populated or Empty State) */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              backgroundColor: 'var(--surface-container-low)',
              border: product.image ? '1px solid var(--border-subtle)' : '2px dashed var(--outline-variant)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isUploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <span className="material-symbols-outlined spin" style={{ fontSize: '36px' }}>progress_activity</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Uploading image...</span>
              </div>
            ) : product.image ? (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: 'var(--surface-container-low)'
                  }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                  GI Tagged Craft
                </div>
              </>
            ) : (
              /* Empty Image Upload State */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem', gap: '0.75rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline)' }}>
                  photo_camera
                </span>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {lang === 'mr' ? 'उत्पादनाचा फोटो अपलोड करा' : lang === 'hi' ? 'उत्पाद की फोटो अपलोड करें' : 'No Product Image Uploaded'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                    JPG, PNG, or WEBP (Max 5 MB)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="btn-primary btn-md"
                  style={{ marginTop: '0.25rem' }}
                >
                  <span className="material-symbols-outlined">add_a_photo</span>
                  <span>📷 Upload Product Image</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons for Uploaded Image */}
          {product.image && !isUploading && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={triggerFileInput}
                className="btn-cream btn-sm"
                style={{ flex: 1, minWidth: '140px', justifyContent: 'center' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>published_with_changes</span>
                <span>🔄 Change Product Image</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn-cream btn-sm"
                style={{ color: 'var(--error)', borderColor: 'var(--error-container)', justifyContent: 'center' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                <span>Remove</span>
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>location_on</span>
            <span>{product.artisan?.village} • {product.artisan?.name}</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            {product.name}
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--outline)', textTransform: 'uppercase' }}>Direct Producer Price</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: '700', color: 'var(--primary)' }}>
                ₹{Number(product.price || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <span className="badge-pill badge-primary">
              86.2% Direct Margin
            </span>
          </div>
        </div>

        {/* Right: Quality Score & QR TrustTag Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quality Score summary card */}
          <div className="card-cream" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
                AI Quality Score
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                94 / 100
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                ✓ Title, Fair Price, & Village Provenance Complete
              </div>
            </div>

            <Link to="/entrepreneur/quality-score" className="btn-cream btn-sm">
              View Detailed Score →
            </Link>
          </div>

          {/* QR TrustTag Box */}
          <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
              Generated QR TrustTag
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>
              Ready to print and affix onto your parcel before carrier pickup.
            </p>

            <QRCodeView product={product} size={150} showActions={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
