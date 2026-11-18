/* ==========================================================================
   GRAMUDYAM ADMIN VERIFICATION DATA & REPOSITORY
   Source of truth for Admin Verification Queue, Detail Inspection & Approvals
   ========================================================================== */

const STORAGE_KEY = 'gramudyam_admin_verification_queue';

export const initialVerificationProducts = [
  {
    id: "SKU-WRL-8821",
    productId: "SKU-WRL-8821",
    altId: "PR-2026-089",
    name: "Warli Hand-Painted Pot",
    nameMr: "वारली हँड-पेंटेड पॉट",
    subheading: "Natural Terracotta • White Rice Paste",
    category: "Traditional Handicrafts",
    categoryGroup: "Handicrafts",
    craftDiscipline: "Traditional Handicrafts & Warli",
    price: 1250,
    basePrice: 1450,
    directPayout: 1125,
    payoutPercent: 90,
    status: "pending", // "pending" | "approved" | "rejected"
    submittedDate: "06 Sep 2026",
    submittedTime: "10:15 AM",
    timeAgo: "1.5h ago",
    aiScore: 87,
    purityRating: "Good Purity",
    puritySummary: "Organic binder confirmed",
    motifMatchPercent: 98.4,
    giTag: true,
    giZone: "Palghar Warli Belt",
    giLabel: "Warli Folk Art Registry #412",
    batchId: "DHN-TERRA-089",
    skuListingId: "GM-WR-DHN-089",
    trustTagId: "GRM-TRUST-2026-001284",
    ledgerHash: "0x8f2d7a90b4e2318cf78912c94e82b1",
    publicUrl: "https://gramudyam.in/p/warli-handpainted-pot-dahanu",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUqhWXN-708SNAPMqXK8SX7tQgOigH3hefYqUniIc2o1dxux5H_ZSxEL-ogKV8oPFrNtTHGpM6ENzyil-r2CuyIFk6IgX3y7WmZ8VKH5Hl8OfkdaTr1tkXDTNscRP0l8heEJT-43hlnNhVJ9C8my5iniYX58k2Dq3K0YNMSiMNusZ3dsem8wq3QNtGmDDOQxQuDH4VaCI7tz3XbFUnkMVmfh4wU1FpStNeDVqVYLFbknx0XRBbw4gO-A",
    detailHeroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIUPU0OsbGxoy_wywMY16izI9O2iiOS2CQSPIwwzVZqQs0vvDJsfhcqx76N0eWG8dh7-4lNFQK8vkkKD75VPWG4nYjcQv8XQDWBqke5pG9pdUcVAT3WLYWRMIGAFqUXnuZ05mOg-eSBfAMf0zaI19Qfw5fNcZ4ia3fDDZoctO2AOh9jhMdqgpAgAj41z_RIYoRdMgHQSwuE4HW-KZJbDWrQq_yZYbczuSIpRryDtqugKa7TLuDNYdJqA",
    inspectionAngles: [
      {
        title: "1. Rice Pigment Texture",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOkmPeZCqF_lX9cVnJeAjiw0Z6Am0zhBDYtZ7aHQ_SZKyf2daSX4rOng_qLZUFArjzb6zQZFpWhjrOIB-vnsAFP40pVfKdlJmaH2XG0wk569d6GaoBSDCjsJTW9g4bG-KUIUs8St9sQnQqCKA3r7MJHTA3KHXao2tg9QNSkgs39TJaLRYy3MINZhA1_AWoyc9ECsAKFk8lymnfFWd2tzwIyErjlb0E082T1QFZzijlbNBX7kWUbG2Mtg"
      },
      {
        title: "2. Underside Artisan Seal",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvYobPzIQeXl7nEM4PnHEMOU20K6Lw3gyKIU7Z1IodfFXW0KBxE2aDhdGq94xmqi6seYRhhuOa0GjWCkkPcp3865hkKL4yjfb6IiIA1mIEC596Ner1k4uepF89atDYx3Gd_oUGfTwOxCw35JsLPWF1C60IkZNzcI2ldbaQpNj4fuXrLku1CK3xSZc_CzZbQIqNAzNu6iUSSgEd5XTtyiZI4DdbuY4MjlZmVjiPecA4XfxBdGUVZxQzxA"
      },
      {
        title: "3. Sunlight & Scale Check",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCViuVWYH7zaOrPQ7RXb92mYmg0PyLMq0HRgvLGHaKYsgbBrNv31ZJORynEZHCgbXx4dkonToiepEUdhY_29KSzplk3EJwr99v8jahFwSfdtu6nVzoGXudn3UHLqjl2VBcuQD_xZImrn54XuWMobvVfzOxxT2GKp_ALYpUhBbx-LzNbDqZSx6yiiHtqW6Awn5rSOWOTA9W8jgDAPCGGLwbi-_UDSA59J3rr05p48VWbdx_KnvjfZANPwg"
      }
    ],
    artisan: {
      name: "Meera Devi",
      experience: "Master Terracotta Artisan (8 Yrs Experience)",
      village: "Ganjad Village",
      taluka: "Dahanu Taluka",
      district: "Palghar",
      state: "Maharashtra",
      coordinates: "19.9723° N, 72.8251° E",
      shgName: "Dahanu Mahila Bachat Gat (SHG-419)",
      productsListed: 34,
      fulfillmentRate: "99.1%",
      bankStatus: "Bank of Maharashtra DBT Linked",
      aadhaarVerified: true,
      phone: "+91 98231 44520",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkSVf6QDjKT7h9G7FJ4RqBSdu4JaAaD2s4O0dfXdBNDYPjuVIoOftqLU-jZtSVEs_HfoQxm1JqOVpPYrUoUm7UjCXb65e4UgwyeaWn0fxDjbDKl6EbsZ37qmHEhYSrhMn5C3bCKIt6FRA1TTxouP73BpP3V0mSU3DkI9h7Sssq_N0a1TBAFVeLkGqsMAtgpJyb67EGl_ocV7VjxXK-MupBMMI9rVXMQKl-ZK-lfszYR8rZMUJhJZ4_yQ"
    },
    narrative: "Traditional Warli-inspired hand-painted terracotta pot created using locally sourced riverbed clay from the Surya riverbank and natural finishing techniques. Painted entirely freehand using fermented rice-paste pigment depicting community Tarpa dance and harvest celebrations passed down through maternal Warli lineages.",
    specifications: {
      coreMaterials: "Riverbed Clay, Rice Paste, Babool Gum",
      dimensions: "12 cm × 10 cm",
      weight: "650 grams",
      craftHeritage: "Palghar Warli Tribal Heritage",
      pigmentSafety: "Food-Safe Non-Toxic Binder",
      packaging: "Biodegradable Honeycomb Wrap"
    },
    qualityBreakdown: [
      { label: "Image Resolution & Natural Light", score: 92 },
      { label: "Marathi Audio Transcription Accuracy", score: 84 },
      { label: "Specification Completeness", score: 88 },
      { label: "Tribal Provenance & Folk Narrative", score: 82 }
    ],
    aiTip: "Encourage artisan to capture 1 candid photo of raw clay settling in courtyards for higher consumer resonance.",
    checklist: [
      { id: "c1", label: "Images are clear, authentic, and unedited", note: "Validated no stock photography or digital rendering.", checked: true },
      { id: "c2", label: "Product description is culturally accurate", note: "Tarpa folk motif context accurately represented.", checked: true },
      { id: "c3", label: "Artisan identity & SHG registration confirmed", note: "Dahanu Mahila Bachat Gat active roster #419 matched.", checked: true },
      { id: "c4", label: "Category & GI taxonomy correctly mapped", note: "Under \"Palghar Tribal Handicrafts / Warli\".", checked: true },
      { id: "c5", label: "Fair-Trade price policy verified (≥90% payout)", note: "Meera Devi receives ₹1,125 without intermediary cut.", checked: true },
      { id: "c6", label: "Genuinely handcrafted (Zero factory resin)", note: "Physical texture analysis confirms baked river terracotta.", checked: false },
      { id: "c7", label: "Zero synthetic or machine printed paints", note: "Confirmed organic babool and rice starch paste binder.", checked: false }
    ],
    notes: ""
  },
  {
    id: "SKU-PTH-4402",
    productId: "SKU-PTH-4402",
    altId: "PR-2026-090",
    name: "Handwoven Paithani Dupatta",
    nameMr: "हातमाग पैठणी दुपट्टा",
    subheading: "Pure Mulberry Silk • Real Zari",
    category: "Handloom & Paithani Silk",
    categoryGroup: "Handloom",
    craftDiscipline: "Handloom & Paithani Silk",
    price: 8900,
    basePrice: 8900,
    directPayout: 8010,
    payoutPercent: 90,
    status: "pending",
    submittedDate: "06 Sep 2026",
    submittedTime: "09:30 AM",
    timeAgo: "2.2h ago",
    aiScore: 94,
    purityRating: "Exceptional",
    puritySummary: "Pitloom spectral verified",
    motifMatchPercent: 99.2,
    giTag: true,
    giZone: "Yeola Silk Cluster, Nashik",
    giLabel: "Yeola Paithani Registry #218",
    batchId: "YLA-SILK-4402",
    skuListingId: "GM-PT-YLA-4402",
    trustTagId: "GRM-TRUST-2026-001285",
    ledgerHash: "0x3b19e27c8801f4ad08432b",
    publicUrl: "https://gramudyam.in/p/paithani-dupatta-yeola",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvBqfemFORXpMgWuusr7Q0XUFzblZlUry8ETXkO3K9dx-7mgGZZtbc6gZF1ZzCOuIZTcE42LkU4FWQZSBlQRJpLcYC4G40InKsJHSe8x4H8n0m9uPgiaOdPfwHKUfPCNJ58vDlqa4dXbMgBpC1cA4p42135dM8d5P_Md_DfYBcAKMLU2QT42k_rj2F_N7h96Ok4c3OJW0djNkiGTNmJzLvF-G_6ObRaZV2Sw0IMeKvgnDnzO3upmUADQ",
    detailHeroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvBqfemFORXpMgWuusr7Q0XUFzblZlUry8ETXkO3K9dx-7mgGZZtbc6gZF1ZzCOuIZTcE42LkU4FWQZSBlQRJpLcYC4G40InKsJHSe8x4H8n0m9uPgiaOdPfwHKUfPCNJ58vDlqa4dXbMgBpC1cA4p42135dM8d5P_Md_DfYBcAKMLU2QT42k_rj2F_N7h96Ok4c3OJW0djNkiGTNmJzLvF-G_6ObRaZV2Sw0IMeKvgnDnzO3upmUADQ",
    inspectionAngles: [
      { title: "1. Zari Weave Density", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvBqfemFORXpMgWuusr7Q0XUFzblZlUry8ETXkO3K9dx-7mgGZZtbc6gZF1ZzCOuIZTcE42LkU4FWQZSBlQRJpLcYC4G40InKsJHSe8x4H8n0m9uPgiaOdPfwHKUfPCNJ58vDlqa4dXbMgBpC1cA4p42135dM8d5P_Md_DfYBcAKMLU2QT42k_rj2F_N7h96Ok4c3OJW0djNkiGTNmJzLvF-G_6ObRaZV2Sw0IMeKvgnDnzO3upmUADQ" }
    ],
    artisan: {
      name: "Savita Patil",
      experience: "Master Paithani Weaver (14 Yrs Experience)",
      village: "Yeola Silk Hub",
      taluka: "Yeola",
      district: "Nashik",
      state: "Maharashtra",
      coordinates: "20.0421° N, 74.4892° E",
      shgName: "Yeola Silk Weavers Guild (YLA-902)",
      productsListed: 48,
      fulfillmentRate: "99.5%",
      bankStatus: "State Bank of India DBT Linked",
      aadhaarVerified: true,
      avatar: "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"
    },
    narrative: "Traditional hand-spun Mulberry silk Paithani dupatta adorned with rich Asavali vine motifs and pure silver-gilt zari pallu crafted on century-old cedar pitlooms in Yeola.",
    specifications: {
      coreMaterials: "Pure Mulberry Silk, Silver Zari",
      dimensions: "2.5 m × 1.0 m",
      weight: "340 grams",
      craftHeritage: "Yeola Paithani Heritage",
      pigmentSafety: "Eco-dyed Natural Silk",
      packaging: "Preserved Muslin Wrap"
    },
    qualityBreakdown: [
      { label: "Pitloom Warp Density", score: 96 },
      { label: "Zari Purity Assay", score: 95 },
      { label: "Folk Motif Authenticity", score: 92 },
      { label: "Edge Salvage Finishing", score: 93 }
    ],
    aiTip: "Highlight the master weaver hallmark on the corner border for high-end collector appreciation.",
    checklist: [
      { id: "c1", label: "Images are clear, authentic, and unedited", note: "Pitloom weave verified.", checked: true },
      { id: "c2", label: "Product description is culturally accurate", note: "Yeola guild certified.", checked: true },
      { id: "c3", label: "Artisan identity & SHG registration confirmed", note: "Roster #YLA-902 matched.", checked: true },
      { id: "c4", label: "Fair-Trade price policy verified (≥90% payout)", note: "Savita Patil receives ₹8,010 direct.", checked: true }
    ],
    notes: ""
  },
  {
    id: "SKU-BMB-1092",
    productId: "SKU-BMB-1092",
    altId: "PR-2026-091",
    name: "Bamboo Storage Basket",
    nameMr: "बांबू साठवणूक टोपली",
    subheading: "Smoked River Cane • Hand-Split",
    category: "Bamboo & Cane Works",
    categoryGroup: "Bamboo & Cane",
    craftDiscipline: "Bamboo & Cane Works",
    price: 720,
    basePrice: 720,
    directPayout: 648,
    payoutPercent: 90,
    status: "pending",
    submittedDate: "05 Sep 2026",
    submittedTime: "04:20 PM",
    timeAgo: "Yesterday",
    aiScore: 81,
    purityRating: "Standard",
    puritySummary: "Fungus treatment doc ok",
    motifMatchPercent: 91.0,
    giTag: false,
    giZone: "Melghat Tribal Belt, Amravati",
    giLabel: "Melghat Forest Craft",
    batchId: "MLG-BMB-1092",
    skuListingId: "GM-BM-MLG-1092",
    trustTagId: "GRM-TRUST-2026-001286",
    ledgerHash: "0x12a9c470bf0982d614",
    publicUrl: "https://gramudyam.in/p/bamboo-storage-basket-melghat",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUHFW5UjP8cKuZgvmGL-Mi9o99w0L0X-DJzEvCUMiDJIFxGR5i5LH8KifZmNGQRps7Iy5MtzfkO4nCuHVPpwRmt4_TbmW0T4UERbNZ-BmhN86qN7eU74cZBvpzPvCxNS9v7WpQvnQ25raGhsYyGAgBOkg14ze5sSRFcyeNOU_vJUQ3ZKcqpezzN8t6LuKw5SrYcm0MMwB9VCcPjz7Og7IV_I5VYbOIyZxL6n_YV-cdEv-p5hsg-1PDLQ",
    detailHeroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUHFW5UjP8cKuZgvmGL-Mi9o99w0L0X-DJzEvCUMiDJIFxGR5i5LH8KifZmNGQRps7Iy5MtzfkO4nCuHVPpwRmt4_TbmW0T4UERbNZ-BmhN86qN7eU74cZBvpzPvCxNS9v7WpQvnQ25raGhsYyGAgBOkg14ze5sSRFcyeNOU_vJUQ3ZKcqpezzN8t6LuKw5SrYcm0MMwB9VCcPjz7Og7IV_I5VYbOIyZxL6n_YV-cdEv-p5hsg-1PDLQ",
    inspectionAngles: [
      { title: "1. Cane Weave Interlock", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUHFW5UjP8cKuZgvmGL-Mi9o99w0L0X-DJzEvCUMiDJIFxGR5i5LH8KifZmNGQRps7Iy5MtzfkO4nCuHVPpwRmt4_TbmW0T4UERbNZ-BmhN86qN7eU74cZBvpzPvCxNS9v7WpQvnQ25raGhsYyGAgBOkg14ze5sSRFcyeNOU_vJUQ3ZKcqpezzN8t6LuKw5SrYcm0MMwB9VCcPjz7Og7IV_I5VYbOIyZxL6n_YV-cdEv-p5hsg-1PDLQ" }
    ],
    artisan: {
      name: "Ramesh Jadhav",
      experience: "Cane Craftsman (11 Yrs Experience)",
      village: "Melghat Foothills",
      taluka: "Chikhaldara",
      district: "Amravati",
      state: "Maharashtra",
      coordinates: "21.4034° N, 77.3482° E",
      shgName: "Melghat Bamboo Collective (MBC-118)",
      productsListed: 19,
      fulfillmentRate: "97.8%",
      bankStatus: "Vidarbha Konkan Gramin Bank DBT Linked",
      aadhaarVerified: true,
      avatar: "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"
    },
    narrative: "Naturally woven split river cane storage container treated with traditional neem smoke seasoning to prevent boring insects and mold.",
    specifications: {
      coreMaterials: "Seasoned Wild River Bamboo",
      dimensions: "30 cm × 25 cm",
      weight: "480 grams",
      craftHeritage: "Korku Tribal Bamboo Craft",
      pigmentSafety: "Organic Smoke Treatment",
      packaging: "Corrugated Paper Box"
    },
    qualityBreakdown: [
      { label: "Seasoning & Moisture Level", score: 85 },
      { label: "Weave Uniformity", score: 82 },
      { label: "Rim Strength", score: 80 },
      { label: "Splinter-Free Polishing", score: 79 }
    ],
    aiTip: "Recommend adding load-bearing capacity indication in product tags.",
    checklist: [
      { id: "c1", label: "Images are clear, authentic, and unedited", note: "Authentic cane photography.", checked: true },
      { id: "c2", label: "Product description is culturally accurate", note: "Korku craft verified.", checked: true }
    ],
    notes: ""
  },
  {
    id: "SKU-KLP-5519",
    productId: "SKU-KLP-5519",
    altId: "PR-2026-092",
    name: "Kolhapuri Vegetable-Tan Mojari",
    nameMr: "कोल्हापुरी व्हेजिटेबल-टॅन मोजरी",
    subheading: "Veg-Tanned Leather • Braided Cord",
    category: "Authentic Leather Craft",
    categoryGroup: "Leather Crafts",
    craftDiscipline: "Authentic Leather Craft",
    price: 2100,
    basePrice: 2100,
    directPayout: 1890,
    payoutPercent: 90,
    status: "pending",
    submittedDate: "05 Sep 2026",
    submittedTime: "02:10 PM",
    timeAgo: "Yesterday",
    aiScore: 89,
    purityRating: "High Craft",
    puritySummary: "Chrome-free certified",
    motifMatchPercent: 96.7,
    giTag: true,
    giZone: "Kolhapur Leather Belt",
    giLabel: "Kolhapuri Chappal GI Registry #129",
    batchId: "KLP-MOJ-5519",
    skuListingId: "GM-LP-SHR-5519",
    trustTagId: "GRM-TRUST-2026-001287",
    ledgerHash: "0x99e821b04312ffae67",
    publicUrl: "https://gramudyam.in/p/kolhapuri-mojari-shirol",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKuC9Eyh_2fiVFtB02gfr_XJj5ZGF2NdXZ2hQGCdkrQgTc5A4d5yVtl3C4xZKbIi7iYX2Ho0oamrr_wgh5PL6Xcr9x9isLjKHObl_b9JZLnO_50bTsAeruQjzuKebajfnaVKcE2g7Y0gHG9rxykUxIqBtho30d5Sh5GSuPNn1JKVwuJHVVc5z6cPvQs2UdUzU71x6fHKlQV9KdP3BoRfnHZEChMtRRsVEgNyBXpu2vRIMDo0rcCnMbHQ",
    detailHeroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKuC9Eyh_2fiVFtB02gfr_XJj5ZGF2NdXZ2hQGCdkrQgTc5A4d5yVtl3C4xZKbIi7iYX2Ho0oamrr_wgh5PL6Xcr9x9isLjKHObl_b9JZLnO_50bTsAeruQjzuKebajfnaVKcE2g7Y0gHG9rxykUxIqBtho30d5Sh5GSuPNn1JKVwuJHVVc5z6cPvQs2UdUzU71x6fHKlQV9KdP3BoRfnHZEChMtRRsVEgNyBXpu2vRIMDo0rcCnMbHQ",
    inspectionAngles: [
      { title: "1. Hand-stitched Sole Welt", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKuC9Eyh_2fiVFtB02gfr_XJj5ZGF2NdXZ2hQGCdkrQgTc5A4d5yVtl3C4xZKbIi7iYX2Ho0oamrr_wgh5PL6Xcr9x9isLjKHObl_b9JZLnO_50bTsAeruQjzuKebajfnaVKcE2g7Y0gHG9rxykUxIqBtho30d5Sh5GSuPNn1JKVwuJHVVc5z6cPvQs2UdUzU71x6fHKlQV9KdP3BoRfnHZEChMtRRsVEgNyBXpu2vRIMDo0rcCnMbHQ" }
    ],
    artisan: {
      name: "Manda Kamble",
      experience: "Master Leather Artisan (16 Yrs)",
      village: "Shirol Cluster",
      taluka: "Shirol",
      district: "Kolhapur",
      state: "Maharashtra",
      coordinates: "16.7121° N, 74.6012° E",
      shgName: "Shirol Cobblers Society (SCS-204)",
      productsListed: 27,
      fulfillmentRate: "98.9%",
      bankStatus: "Bank of India DBT Linked",
      aadhaarVerified: true,
      avatar: "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"
    },
    narrative: "Pure vegetable-tanned genuine leather mojari hand-stitched with authentic babool bark tanning and durable braided golden thread work.",
    specifications: {
      coreMaterials: "Babool-tanned Hide, Braided Thread",
      dimensions: "Available in UK sizes 6-10",
      weight: "390 grams / pair",
      craftHeritage: "Kolhapur Traditional Cobblery",
      pigmentSafety: "100% Chrome-Free Vegetable Tan",
      packaging: "Cloth Dust Bag"
    },
    qualityBreakdown: [
      { label: "Vegetable Tanning Purity", score: 94 },
      { label: "Saddle Stitch Precision", score: 90 },
      { label: "Braided Cord Tightness", score: 86 },
      { label: "Sole Density Test", score: 87 }
    ],
    aiTip: "Suggest listing standard sole thickness measurements for export verification.",
    checklist: [
      { id: "c1", label: "Images are clear, authentic, and unedited", note: "Authentic footwear images.", checked: true },
      { id: "c2", label: "Product description is culturally accurate", note: "Kolhapur GI verified.", checked: true }
    ],
    notes: ""
  },
  {
    id: "SKU-BHD-3310",
    productId: "SKU-BHD-3310",
    altId: "PR-2026-085",
    name: "Bhadravati Terracotta Water Matka",
    nameMr: "भद्रावती टेराकोटा पाणी माठ",
    subheading: "Porous Riverbed Red Clay",
    category: "Terracotta & Clay Pottery",
    categoryGroup: "Pottery",
    craftDiscipline: "Terracotta & Clay Pottery",
    price: 480,
    basePrice: 480,
    directPayout: 432,
    payoutPercent: 90,
    status: "approved",
    submittedDate: "05 Sep 2026",
    submittedTime: "11:45 AM",
    timeAgo: "Yesterday",
    aiScore: 90,
    purityRating: "Certified Pure",
    puritySummary: "Lead & cadmium-free pass",
    motifMatchPercent: 97.5,
    giTag: false,
    giZone: "Bhadravati Pottery Hub, Chandrapur",
    giLabel: "Bhadravati Clay Certification #088",
    batchId: "BHD-CLAY-3310",
    skuListingId: "GM-TC-BHD-3310",
    trustTagId: "GRM-TRUST-2026-001288",
    ledgerHash: "0x44f910a76c0291e550",
    publicUrl: "https://gramudyam.in/p/bhadravati-water-matka",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHBe4s6mDzVyhmuTL2lkupt-ggSNtQUhCN48ylZ8dgrP02b2mNdMAX692I72xMl3ABPqtSqk4QyA5UBNUBY4GX3w3C04A7hQPyW9fuScwsTpozz24IRm1ftQKoIIEEyqr_XnUSqHC2HyXe9wT_B2SEqIOJxr3oU3XgOiktZHGI-p54M7eD6X8bMvd78Rz_jtxnIyScHnWFzO31xPLWnYrVt1QIvQVGRm5KUTE7MFKj2j1bB9G_EWGYWA",
    detailHeroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHBe4s6mDzVyhmuTL2lkupt-ggSNtQUhCN48ylZ8dgrP02b2mNdMAX692I72xMl3ABPqtSqk4QyA5UBNUBY4GX3w3C04A7hQPyW9fuScwsTpozz24IRm1ftQKoIIEEyqr_XnUSqHC2HyXe9wT_B2SEqIOJxr3oU3XgOiktZHGI-p54M7eD6X8bMvd78Rz_jtxnIyScHnWFzO31xPLWnYrVt1QIvQVGRm5KUTE7MFKj2j1bB9G_EWGYWA",
    inspectionAngles: [
      { title: "1. Etched Clay Lines", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHBe4s6mDzVyhmuTL2lkupt-ggSNtQUhCN48ylZ8dgrP02b2mNdMAX692I72xMl3ABPqtSqk4QyA5UBNUBY4GX3w3C04A7hQPyW9fuScwsTpozz24IRm1ftQKoIIEEyqr_XnUSqHC2HyXe9wT_B2SEqIOJxr3oU3XgOiktZHGI-p54M7eD6X8bMvd78Rz_jtxnIyScHnWFzO31xPLWnYrVt1QIvQVGRm5KUTE7MFKj2j1bB9G_EWGYWA" }
    ],
    artisan: {
      name: "Sunita Shinde",
      experience: "Pottery Master (12 Yrs)",
      village: "Bhadravati",
      taluka: "Bhadravati",
      district: "Chandrapur",
      state: "Maharashtra",
      coordinates: "20.1002° N, 79.1234° E",
      shgName: "Bhadravati Clay Guild (BCG-77)",
      productsListed: 41,
      fulfillmentRate: "99.0%",
      bankStatus: "Maharashtra Gramin Bank DBT Linked",
      aadhaarVerified: true,
      avatar: "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"
    },
    narrative: "Wheel-thrown earthenware cooler pot sculpted using natural riverbed red soil known for slow evaporative cooling properties.",
    specifications: {
      coreMaterials: "Natural Red Earthen Clay",
      dimensions: "24 cm × 22 cm",
      weight: "1.4 kg",
      craftHeritage: "Bhadravati Traditional Pottery",
      pigmentSafety: "Food Grade & Lead-free",
      packaging: "Molded Straw Cushioning"
    },
    qualityBreakdown: [
      { label: "Pore Micro-distribution", score: 92 },
      { label: "Chemical Toxicity Test", score: 98 },
      { label: "Kiln Firing Evenness", score: 88 }
    ],
    aiTip: "Certified safe for drinking water storage.",
    checklist: [
      { id: "c1", label: "Images are clear, authentic, and unedited", note: "Pass", checked: true },
      { id: "c2", label: "Product description is culturally accurate", note: "Pass", checked: true }
    ],
    notes: "Verified on 05 Sep 2026."
  },
  {
    id: "SKU-SYN-0012",
    productId: "SKU-SYN-0012",
    altId: "PR-2026-079",
    name: "Machine-Imitation Printed Stole",
    nameMr: "यंत्रनिर्मित कृत्रिम छाप स्टोल",
    subheading: "Polyester Screen-Printed • Non-Artisanal",
    category: "Textiles",
    categoryGroup: "Textiles",
    craftDiscipline: "Handloom & Paithani Silk",
    price: 320,
    basePrice: 320,
    directPayout: 288,
    payoutPercent: 90,
    status: "rejected",
    submittedDate: "04 Sep 2026",
    submittedTime: "06:12 PM",
    timeAgo: "2 days ago",
    aiScore: 42,
    purityRating: "Low Purity",
    puritySummary: "Synthetic polymer detected",
    motifMatchPercent: 41.2,
    giTag: false,
    giZone: "Bhiwandi Hub, Thane",
    giLabel: "Flagged Violation",
    batchId: "SYN-FLG-0012",
    skuListingId: "GM-TX-BHW-0012",
    trustTagId: "GRM-TRUST-FLAGGED-012",
    ledgerHash: "0x000000000000000000",
    publicUrl: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANjM8qIHnC8BebH1clnmPMqnAx3EmKwaIa2afrHpwqmnzSz3ks53ZfPM2ARS_mBxf1Zq68bv6uIWxbP5413HBh8cbNyCpSafkeMP84WhgEl-rv9zbyQ8754t9vPYsebP_7Hchp9jJqpfbNKjZ0_4ZXX_MEIcs4N3rjtnNuuG5d1k8y6G_zxphAOaG5GQ6s7jWcaItUvrNQXym6mrLQKuUoY5ISnJCuBcWCy-QEMpxAtqNh5eJYCpOBgQ",
    detailHeroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuANjM8qIHnC8BebH1clnmPMqnAx3EmKwaIa2afrHpwqmnzSz3ks53ZfPM2ARS_mBxf1Zq68bv6uIWxbP5413HBh8cbNyCpSafkeMP84WhgEl-rv9zbyQ8754t9vPYsebP_7Hchp9jJqpfbNKjZ0_4ZXX_MEIcs4N3rjtnNuuG5d1k8y6G_zxphAOaG5GQ6s7jWcaItUvrNQXym6mrLQKuUoY5ISnJCuBcWCy-QEMpxAtqNh5eJYCpOBgQ",
    inspectionAngles: [],
    artisan: {
      name: "Powerloom Trading Agency",
      experience: "Third-party Trader",
      village: "Bhiwandi Hub",
      taluka: "Bhiwandi",
      district: "Thane",
      state: "Maharashtra",
      coordinates: "19.2967° N, 73.0628° E",
      shgName: "Unregistered Commercial Trader",
      productsListed: 1,
      fulfillmentRate: "0%",
      bankStatus: "Unverified Commercial Account",
      aadhaarVerified: false,
      avatar: "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"
    },
    narrative: "Mass-produced polyester printed stole flagged for imitation handloom patterns.",
    specifications: {
      coreMaterials: "100% Synthetic Polyester",
      dimensions: "1.8 m × 0.6 m",
      weight: "120 grams",
      craftHeritage: "Non-Artisanal",
      pigmentSafety: "Synthetic Screen Chemical",
      packaging: "Plastic Sleeve"
    },
    qualityBreakdown: [
      { label: "Handloom Weave Texture", score: 20 },
      { label: "Natural Fibre Content", score: 0 },
      { label: "Authenticity Confidence", score: 15 }
    ],
    aiTip: "Violates rural artisan direct producer policy.",
    checklist: [
      { id: "c1", label: "Images are clear, authentic, and unedited", note: "Failed - stock screen image.", checked: false }
    ],
    notes: "Rejected on 04 Sep 2026. Synthetic imitation violation."
  }
];

export const adminVerificationService = {
  getAll() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVerificationProducts));
      return initialVerificationProducts;
    } catch {
      return initialVerificationProducts;
    }
  },

  getById(id) {
    const list = this.getAll();
    return list.find(
      (item) =>
        String(item.id).toLowerCase() === String(id).toLowerCase() ||
        String(item.productId).toLowerCase() === String(id).toLowerCase() ||
        String(item.altId).toLowerCase() === String(id).toLowerCase()
    );
  },

  approveProduct(id, notes = "") {
    const list = this.getAll();
    let updatedItem = null;
    const updatedList = list.map((item) => {
      if (
        String(item.id).toLowerCase() === String(id).toLowerCase() ||
        String(item.productId).toLowerCase() === String(id).toLowerCase() ||
        String(item.altId).toLowerCase() === String(id).toLowerCase()
      ) {
        updatedItem = {
          ...item,
          status: "approved",
          notes: notes || item.notes || "Approved by Dr. Vinay P. on 06 Sep 2026.",
          approvedAt: new Date().toISOString()
        };
        return updatedItem;
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedItem;
  },

  rejectProduct(id, reason = "Quality / Provenance discrepancy") {
    const list = this.getAll();
    let updatedItem = null;
    const updatedList = list.map((item) => {
      if (
        String(item.id).toLowerCase() === String(id).toLowerCase() ||
        String(item.productId).toLowerCase() === String(id).toLowerCase() ||
        String(item.altId).toLowerCase() === String(id).toLowerCase()
      ) {
        updatedItem = {
          ...item,
          status: "rejected",
          rejectionReason: reason,
          rejectedAt: new Date().toISOString()
        };
        return updatedItem;
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedItem;
  },

  getStats() {
    const list = this.getAll();
    const pending = list.filter((item) => item.status === "pending").length;
    const approved = list.filter((item) => item.status === "approved").length;
    const rejected = list.filter((item) => item.status === "rejected" || item.status === "flagged").length;
    return {
      total: list.length,
      pending,
      approved,
      rejected,
      avgReviewTimeHours: 2.4
    };
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVerificationProducts));
    return initialVerificationProducts;
  }
};
