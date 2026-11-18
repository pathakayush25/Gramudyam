/* ==========================================================================
   AI SERVICE (Frontend Algorithmic Engine & Mock AI Generators)
   Simulates GraminNLP voice parser, AI Quality Scoring, & Branding Generators
   ========================================================================== */

export const aiService = {
  // Extract and format product name from spoken transcript
  extractProductName(transcript = '', targetLang = 'en') {
    if (!transcript || !transcript.trim()) return '';

    let text = transcript.trim();

    // 1. Strip conversational prefixes/fillers
    text = text.replace(/^(?:this is (?:a|an)?|here is (?:a|an)?|i have (?:a|an)?|we have (?:a|an)?|i made (?:a|an)?|selling (?:a|an)?|product is (?:a|an)?|product name is|name is)\s+/i, '');
    text = text.replace(/^(?:हे|हा|ही|ह्या|माझे|आमचे|येथे|इथे)\s+(?:एक\s+)?/i, '');
    text = text.replace(/^(?:डहाणूचे|येवल्याचे|कोल्हापूरचे|महाराष्ट्राचे)\s+/i, '');
    text = text.replace(/^(?:यह|ये|मेरा|हमारा|यहाँ|यहाँ पर)\s+(?:एक\s+)?/i, '');

    // 2. Strip price clauses and suffixes
    text = text.replace(/[,]?\s*(?:costing|price is|price|for|at|priced at|rate is|costs?)\s*(?:₹|rs\.?|rupees?)?\s*\d+.*$/i, '');
    text = text.replace(/[,]?\s*(?:किंमत|दर|भाव)\s*.*$/i, '');
    text = text.replace(/[,]?\s*\d+\s*(?:रुपये|रु\.).*$/i, '');
    text = text.replace(/[,]?\s*(?:बाराशे|पंधराशे|दोन हजार|चौदा हजार पाचशे|हजार)\s*(?:रुपये)?.*$/i, '');
    text = text.replace(/[,]?\s*(?:कीमत|दाम|मूल्य)\s*.*$/i, '');
    text = text.replace(/[,]?\s*(?:बारह सौ|पंद्रह सौ|दो हजार|चौदह हजार पांच सौ|हजार)\s*(?:रुपये)?.*$/i, '');

    // 3. Strip trailing punctuation
    text = text.replace(/[.,;!?]+$/g, '').trim();

    // 4. Strip trailing helper verbs
    text = text.replace(/\s+(?:आहे|आहेत|असून|होते)$/i, '').trim();
    text = text.replace(/\s+(?:है|हैं|था|थी)$/i, '').trim();
    text = text.replace(/\s+(?:is|are)$/i, '').trim();
    text = text.replace(/[.,;!?]+$/g, '').trim();

    // 5. Title Case formatting for Latin script words (e.g. "warli painting on canvas" -> "Warli Painting on Canvas")
    const isDevanagari = /[\u0900-\u097F]/.test(text);
    if (!isDevanagari && text) {
      const lowerWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'with'];
      const words = text.split(/\s+/);
      text = words.map((w, idx) => {
        const clean = w.toLowerCase();
        if (idx > 0 && lowerWords.includes(clean)) {
          return clean;
        }
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      }).join(' ');
    }

    return text;
  },

  // Generate concise, relevant 1-3 sentence product description based on product name and craft context
  generateProductDescription(productName = '', targetLang = 'en', rawTranscript = '') {
    const combined = `${productName} ${rawTranscript}`.toLowerCase();

    const isWarli = combined.includes('warli') || combined.includes('वारली');
    const isPaithani = combined.includes('paithani') || combined.includes('पैठणी') || combined.includes('saree') || combined.includes('साडी') || combined.includes('रेशीम') || combined.includes('silk');
    const isPottery = combined.includes('pot') || combined.includes('भांडे') || combined.includes('clay') || combined.includes('माती') || combined.includes('terracotta') || combined.includes('मटका') || combined.includes('बर्तन');
    const isBamboo = combined.includes('bamboo') || combined.includes('बांबू') || combined.includes('बांस') || combined.includes('basket') || combined.includes('टोपली') || combined.includes('cane');
    const isLeather = combined.includes('chappal') || combined.includes('चप्पल') || combined.includes('leather') || combined.includes('kolhapuri') || combined.includes('चामडे') || combined.includes('चमड़ा');
    const isMetal = combined.includes('brass') || combined.includes('तांबे') || combined.includes('पितळ') || combined.includes('पीतल') || combined.includes('diya') || combined.includes('दिवा') || combined.includes('दीया') || combined.includes('bell') || combined.includes('घंटी') || combined.includes('metal') || combined.includes('copper');
    const isWood = combined.includes('wood') || combined.includes('लाकूड') || combined.includes('लकड़ी') || combined.includes('carv') || combined.includes('कोरीव');
    const isTextile = combined.includes('cotton') || combined.includes('सुती') || combined.includes('सूती') || combined.includes('dupatta') || combined.includes('दुपट्टा') || combined.includes('khadi') || combined.includes('खादी') || combined.includes('loom') || combined.includes('विणकाम');
    const isHoney = combined.includes('honey') || combined.includes('मध') || combined.includes('शहद') || combined.includes('organic') || combined.includes('सेंद्रिय') || combined.includes('जैविक');

    const mentionsCanvas = combined.includes('canvas') || combined.includes('कॅनव्हास');

    // 1. Warli
    if (isWarli) {
      if (targetLang === 'mr') {
        return mentionsCanvas
          ? "अस्सल लोककला तंत्राचा वापर करून कुशल कारागिरांनी कॅनव्हासवर तयार केलेली हस्तनिर्मित वारली चित्रकला, ज्यामध्ये पारंपरिक आदिवासी नक्षीकाम व ग्रामीण संस्कृतीचे दर्शन घडते."
          : "कुशल कारागिरांनी पारंपरिक आदिवासी नक्षीकाम व ग्रामीण संस्कृतीच्या कथा लोककला तंत्राने रेखाटलेली हस्तनिर्मित वारली कलाकृती.";
      }
      if (targetLang === 'hi') {
        return mentionsCanvas
          ? "कुशल कारीगरों द्वारा कैनवास पर पारंपरिक जनजातीय रूपांकनों और लोककला तकनीकों से बनाई गई हस्तनिर्मित वारली पेंटिंग।"
          : "कुशल कारीगरों द्वारा प्रामाणिक लोककला तकनीकों से पारंपरिक जनजातीय रूपांकनों को दर्शाती हस्तनिर्मित वारली कलाकृती।";
      }
      return mentionsCanvas
        ? "A handcrafted Warli painting featuring traditional tribal patterns and storytelling motifs on canvas, created by skilled artisans using authentic folk-art techniques."
        : "A handcrafted Warli artwork depicting traditional tribal patterns and storytelling motifs, created by skilled artisans using authentic folk-art techniques.";
    }

    // 2. Paithani / Silk
    if (isPaithani) {
      if (targetLang === 'mr') {
        return "कुशल विणकरांनी हातमागावर शुद्ध रेशीम आणि पारंपरिक नक्षीकामाचा वापर करून विणलेली अस्सल पैठणी, जी समृद्ध वस्त्रकलेचा वारसा दर्शवते.";
      }
      if (targetLang === 'hi') {
        return "पारंपरिक हथकरघा बुनकरों द्वारा शुद्ध रेशम और पारंपरिक रूपांकनों से तैयार की गई प्रामाणिक पैठणी, जो समृद्ध वस्त्र परंपरा को दर्शाती है।";
      }
      return "An authentic handwoven Paithani piece woven with fine silk threads, featuring intricate traditional border motifs crafted by heritage handloom artisans.";
    }

    // 3. Pottery / Terracotta
    if (isPottery) {
      if (targetLang === 'mr') {
        return "कुंभाराच्या चाकावर नैसर्गिक मातीपासून हाताने घडवलेली आणि पारंपरिक पद्धतीने भाजून तयार केलेली मातीची कलाकृती.";
      }
      if (targetLang === 'hi') {
        return "प्राकृतिक मिट्टी से चाक पर हाथ से तैयार किया गया और पारंपरिक भट्टी में पकाया गया टिकाऊ एवं प्रामाणिक टेराकोटा शिल्प।";
      }
      return "A traditional terracotta craft hand-shaped from natural clay on a potter's wheel, pit-fired using time-honored artisanal techniques for natural charm and durability.";
    }

    // 4. Bamboo / Cane
    if (isBamboo) {
      if (targetLang === 'mr') {
        return "स्थानिक बांबूच्या पट्ट्यांपासून कुशल हातांनी विणलेली मजबूत, पर्यावरणपूरक आणि पारंपरिक बांबू हस्तकला.";
      }
      if (targetLang === 'hi') {
        return "प्राकृतिक बांस की पट्टियों से हाथ से बुना गया टिकाऊ, पर्यावरण के अनुकूल और कार्यात्मक हस्तशिल्प।";
      }
      return "A sturdy, eco-friendly craft handwoven from natural seasoned bamboo strips, combining traditional weaving patterns with everyday functional utility.";
    }

    // 5. Leather / Kolhapuri
    if (isLeather) {
      if (targetLang === 'mr') {
        return "नैसर्गिक चामड्यापासून कारागिरांनी हाताने शिवून तयार केलेली अस्सल आणि मजबूत चर्मकला.";
      }
      if (targetLang === 'hi') {
        return "पारंपरिक हस्तनिर्मित चमड़े का उत्पाद, जिसे कुशल कारीगरों द्वारा हाथ से सिलकर टिकाऊ और आरामदायक बनाया गया है।";
      }
      return "Traditional handcrafted leather footwear shaped with meticulous hand-stitching, offering authentic artisanal comfort and durable construction.";
    }

    // 6. Metal / Brass
    if (isMetal) {
      if (targetLang === 'mr') {
        return "पारंपरिक धातूकामातील कुशल कारागिरांनी बारकाईने नक्षीकाम करून हाताने तयार केलेली वैशिष्ट्यपूर्ण कलाकृती.";
      }
      if (targetLang === 'hi') {
        return "कुशल धातु शिल्पकारों द्वारा पारंपरिक नक्काशी और बारीकियों के साथ तैयार किया गया प्रामाणिक हस्तशिल्प।";
      }
      return "A traditional handcrafted metal piece shaped with fine artisan detailing, offering timeless cultural elegance and enduring craft quality.";
    }

    // 7. Wood / Carving
    if (isWood) {
      if (targetLang === 'mr') {
        return "नैसर्गिक लाकडावर हाताने कोरीव काम करून स्थानिक कारागिरांनी तयार केलेली सुंदर आणि टिकाऊ लाकडी कलाकृती.";
      }
      if (targetLang === 'hi') {
        return "प्राकृतिक लकड़ी पर कुशल कारीगरों द्वारा हाथ से तराशा गया सुंदर और टिकाऊ काष्ठ शिल्प।";
      }
      return "A distinctive wooden craft hand-carved by skilled artisans, celebrating natural wood grains and time-honored rural woodworking traditions.";
    }

    // 8. Textile / Handloom
    if (isTextile) {
      if (targetLang === 'mr') {
        return "पारंपरिक हातमाग आणि नक्षीकामाचा वापर करून कुशल कारागिरांनी तयार केलेले अस्सल कापडी उत्पादन.";
      }
      if (targetLang === 'hi') {
        return "पारंपरिक हथकरघा और बारीक कढ़ाई से तैयार किया गया सुरुचिपूर्ण हस्तनिर्मित वस्त्र।";
      }
      return "A handcrafted textile piece featuring authentic artisanal weaving and detailed patterns, created with care using traditional handloom techniques.";
    }

    // 9. Honey / Food
    if (isHoney) {
      if (targetLang === 'mr') {
        return "नैसर्गिक पद्धतीने गोळा केलेले १००% शुद्ध, सेंद्रिय आणि पारंपरिक ग्रामीण उत्पादन.";
      }
      if (targetLang === 'hi') {
        return "पारंपरिक और प्राकृतिक तरीकों से एकत्र किया गया शुद्ध, जैविक एवं गुणवत्तापूर्ण ग्रामीण उत्पाद।";
      }
      return "Pure and naturally sourced rural produce gathered using sustainable traditional harvesting methods, preserving natural purity and wholesome nutrition.";
    }

    // 10. General fallback using cleaned productName
    const displayItem = productName ? productName.trim() : (targetLang === 'mr' ? 'कलाकृती' : targetLang === 'hi' ? 'शिल्प' : 'craft');
    if (targetLang === 'mr') {
      return `ग्रामीण कारागिरांनी पारंपरिक कौशल्याचा आणि अस्सल तंत्राचा वापर करून हाताने तयार केलेले ${displayItem}.`;
    }
    if (targetLang === 'hi') {
      return `ग्रामीण कारीगरों द्वारा पारंपरिक शिल्प कौशल और प्रामाणिक तकनीकों से तैयार किया गया हस्तनिर्मित ${displayItem}।`;
    }
    return `A meticulously handcrafted ${displayItem.toLowerCase()} created by skilled artisans, celebrating authentic craftsmanship and traditional handmade techniques.`;
  },

  // Auto-detect craft category based on product title and keywords
  detectCategory(productName = '', transcript = '', targetLang = 'en') {
    const text = `${productName} ${transcript}`.toLowerCase();
    if (text.includes("warli") || text.includes("वारली") || text.includes("paint") || text.includes("चित्र")) {
      return targetLang === 'mr' ? "हस्तकला आणि आदिवासी कला" : targetLang === 'hi' ? "हस्तशिल्प और जनजातीय कला" : "Handicrafts & Tribal Art";
    }
    if (text.includes("paithani") || text.includes("पैठणी") || text.includes("saree") || text.includes("साडी") || text.includes("silk") || text.includes("रेशीम") || text.includes("cotton") || text.includes("dupatta")) {
      return targetLang === 'mr' ? "कापड आणि पैठणी" : targetLang === 'hi' ? "कपड़े और पैठणी" : "Textiles & Paithani";
    }
    if (text.includes("pot") || text.includes("भांडे") || text.includes("clay") || text.includes("माती") || text.includes("terracotta") || text.includes("मटका")) {
      return targetLang === 'mr' ? "मातीची भांडी आणि टेराकोटा" : targetLang === 'hi' ? "मिट्टी के बर्तन और टेराकोटा" : "Terracotta & Clay Pottery";
    }
    if (text.includes("chappal") || text.includes("चप्पल") || text.includes("leather") || text.includes("kolhapuri") || text.includes("चामडे") || text.includes("चमड़ा")) {
      return targetLang === 'mr' ? "चामड्याच्या वस्तू आणि चप्पल" : targetLang === 'hi' ? "चमड़े का सामान और जूते" : "Leather & Footwear";
    }
    if (text.includes("bamboo") || text.includes("बांबू") || text.includes("बांस") || text.includes("basket") || text.includes("टोपली") || text.includes("cane")) {
      return targetLang === 'mr' ? "बांबू आणि वेताच्या वस्तू" : targetLang === 'hi' ? "बांस और बेंत का शिल्प" : "Bamboo & Cane Craft";
    }
    if (text.includes("brass") || text.includes("पितळ") || text.includes("तांबे") || text.includes("diya") || text.includes("दिवा") || text.includes("bell") || text.includes("copper") || text.includes("metal")) {
      return targetLang === 'mr' ? "धातूकाम आणि पितळी वस्तू" : targetLang === 'hi' ? "धातु शिल्प और पीतल" : "Metal Craft & Brassware";
    }
    if (text.includes("wood") || text.includes("लाकूड") || text.includes("लकड़ी") || text.includes("carv")) {
      return targetLang === 'mr' ? "लाकडी वस्तू आणि कोरीवकाम" : targetLang === 'hi' ? "काष्ठ शिल्प" : "Wooden Crafts & Carving";
    }
    if (text.includes("honey") || text.includes("मध") || text.includes("शहद") || text.includes("organic") || text.includes("forest")) {
      return targetLang === 'mr' ? "वन उत्पादने आणि सेंद्रिय अन्न" : targetLang === 'hi' ? "वन और जैविक उत्पाद" : "Forest & Organic Food";
    }
    return targetLang === 'mr' ? "हस्तकला आणि ग्रामोद्योग" : targetLang === 'hi' ? "हस्तशिल्प और ग्रामोद्योग" : "Handicrafts & Tribal Art";
  },

  // Multi-lingual Voice transcript parser (GraminNLP simulator)
  extractFromVoice(transcript = '', targetLang = 'en') {
    const text = transcript.toLowerCase();
    
    // 1. Robust Price Extraction (digits, Devnagari numerals, & word numbers in EN/HI/MR)
    let price = '';
    
    // Direct digits match (₹1200, Rs. 1500, 1200 rupees, 1200 रुपये, 14,500)
    const digitMatch = transcript.match(/(?:₹|rs\.?|rupees?|रुपये|रु\.?)?\s*(\d[\d,]{1,6})\s*(?:rs\.?|rupees?|रुपये|रु\.?)?/i);
    if (digitMatch && digitMatch[1]) {
      const numStr = digitMatch[1].replace(/,/g, '');
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > 0) price = num;
    }

    // Devnagari numerals match (१२००, १४५००, १५००)
    if (!price) {
      const devnagariDigits = { '०':0, '१':1, '२':2, '३':3, '४':4, '५':5, '६':6, '७':7, '८':8, '९':9 };
      const devMatch = transcript.match(/[०१२३४५६७८९]{2,6}/);
      if (devMatch) {
        const converted = devMatch[0].split('').map(ch => devnagariDigits[ch] !== undefined ? devnagariDigits[ch] : ch).join('');
        const num = parseInt(converted, 10);
        if (!isNaN(num)) price = num;
      }
    }

    // Spoken number words in Marathi/Hindi/English
    if (!price) {
      if (text.includes("बाराशे") || text.includes("बारह सौ") || text.includes("twelve hundred")) price = 1200;
      else if (text.includes("पंधराशे") || text.includes("पंद्रह सौ") || text.includes("fifteen hundred")) price = 1500;
      else if (text.includes("दोन हजार") || text.includes("दो हजार") || text.includes("two thousand")) price = 2000;
      else if (text.includes("चौदा हजार पाचशे") || text.includes("चौदह हजार पांच सौ") || text.includes("fourteen thousand five hundred")) price = 14500;
      else if (text.includes("हजार") || text.includes("thousand")) price = 1000;
    }

    // Default fallback price if non-empty text but no numeric value mentioned
    if (!price && transcript.trim().length > 5) {
      price = 1200;
    }

    // 2. Materials Detection
    const materialsDetected = [];
    if (text.includes("canvas") || text.includes("कॅनव्हास")) materialsDetected.push("canvas");
    if (text.includes("mud") || text.includes("माती") || text.includes("मिट्टी")) materialsDetected.push("mud");
    if (text.includes("dung") || text.includes("शेण") || text.includes("गोबर")) materialsDetected.push("cow dung");
    if (text.includes("rice") || text.includes("तांदूळ") || text.includes("चावल") || text.includes("पिठी")) materialsDetected.push("rice flour paste");
    if (text.includes("bamboo") || text.includes("बांबू") || text.includes("बांस") || text.includes("काड्या")) materialsDetected.push("bamboo twigs");
    if (text.includes("silk") || text.includes("रेशीम") || text.includes("रेशम")) materialsDetected.push("pure silk");
    if (text.includes("zari") || text.includes("जरी")) materialsDetected.push("golden zari");
    if (text.includes("leather") || text.includes("चामडे") || text.includes("चमड़ा")) materialsDetected.push("vegetable-tanned leather");

    // 3. Location Extraction
    let locationName = "Dahanu, Palghar";
    if (text.includes("dahanu") || text.includes("डहाणू")) locationName = "Dahanu, Palghar";
    else if (text.includes("yeola") || text.includes("येवला") || text.includes("nashik") || text.includes("नाशिक")) locationName = "Yeola, Nashik";
    else if (text.includes("kolhapur") || text.includes("कोल्हापूर") || text.includes("कोल्हापुर")) locationName = "Kagal, Kolhapur";
    else if (text.includes("paithan") || text.includes("पैठण")) locationName = "Paithan, Chhatrapati Sambhajinagar";
    else if (text.includes("satapura") || text.includes("nandurbar") || text.includes("नंदुरबार")) locationName = "Satpura, Nandurbar";
    else if (text.includes("palghar") || text.includes("पालघर")) locationName = "Manor, Palghar";

    // 4. Product Name & Category & Description Generation
    const extractedName = this.extractProductName(transcript, targetLang);
    const category = this.detectCategory(extractedName, transcript, targetLang);
    const description = this.generateProductDescription(extractedName, targetLang, transcript);

    return {
      name: extractedName || (targetLang === 'mr' ? 'हस्तनिर्मित कलाकृती' : targetLang === 'hi' ? 'हस्तनिर्मित उत्पाद' : 'Handcrafted Craft'),
      price: price || 1200,
      location: locationName,
      category,
      description,
      story: description,
      materials: materialsDetected
    };
  },

  // Dynamic AI Quality Score Engine
  calculateQualityScore(product = {}) {
    let score = 0;
    const checks = [];

    // 1. Title completeness (Max 20)
    const titleLen = (product.name || '').trim().length;
    if (titleLen >= 15) {
      score += 20;
      checks.push({ id: 'title', passed: true, title: "Product title complete and descriptive", note: `Good title length (${titleLen} chars)` });
    } else if (titleLen > 5) {
      score += 12;
      checks.push({ id: 'title', passed: false, title: "Product title could be more descriptive", note: "Add craft style, regional cluster, or material" });
    } else {
      checks.push({ id: 'title', passed: false, title: "Missing or brief title", note: "Needs clear title" });
    }

    // 2. Price available & fair (Max 20)
    const price = Number(product.price);
    if (price > 0 && price <= 50000) {
      score += 20;
      checks.push({ id: 'price', passed: true, title: "Fair marketplace pricing defined", note: `₹${price.toLocaleString('en-IN')}` });
    } else {
      checks.push({ id: 'price', passed: false, title: "Define a fair product price", note: "Set realistic price in INR" });
    }

    // 3. Craft description & story (Max 25)
    const descLen = (product.description || '').trim().length;
    const storyLen = (product.story || '').trim().length;
    if (descLen >= 50 && storyLen >= 30) {
      score += 25;
      checks.push({ id: 'story', passed: true, title: "Rich craft heritage story & description", note: "Artisan backstory present" });
    } else if (descLen >= 20) {
      score += 15;
      checks.push({ id: 'story', passed: false, title: "Enhance craft narrative & process story", note: "Tell buyers how it was made" });
    } else {
      checks.push({ id: 'story', passed: false, title: "Detailed craft description required", note: "Add dimensions, materials, and method" });
    }

    // 4. Photos and imagery (Max 20)
    const imgCount = (product.images && product.images.length) || (product.image ? 1 : 0);
    if (imgCount >= 2) {
      score += 20;
      checks.push({ id: 'images', passed: true, title: "Multiple high-resolution craft photos uploaded", note: `${imgCount} photos attached` });
    } else if (imgCount === 1) {
      score += 12;
      checks.push({ id: 'images', passed: false, title: "Upload additional angle or studio photos", note: "Products with 2+ photos sell 4x faster" });
    } else {
      checks.push({ id: 'images', passed: false, title: "Add product photograph", note: "High quality photo needed" });
    }

    // 5. Category & Cluster (Max 15)
    if (product.category && product.category !== 'all') {
      score += 15;
      checks.push({ id: 'category', passed: true, title: "Accurate craft category & SHG cluster linked", note: product.category });
    } else {
      checks.push({ id: 'category', passed: false, title: "Assign an authentic craft category", note: "Select appropriate category" });
    }

    // Suggestions based on score
    const suggestions = [];
    if (score < 90) {
      if (imgCount < 2) suggestions.push("Add a close-up photo showing the fine handwoven or carved details.");
      if (storyLen < 50) suggestions.push("Mention the artisan group, village, and traditional tools used.");
      if (titleLen < 20) suggestions.push("Include GI indicator or regional cluster name in title.");
    } else {
      suggestions.push("Ready for verified TrustTag QR generation and public marketplace listing!");
    }

    return {
      score,
      maxScore: 100,
      checks,
      suggestions,
      level: score >= 90 ? "Excellent" : score >= 75 ? "Good" : "Needs Improvement"
    };
  },

  // Generative AI Branding Suggestions
  generateBrandingSuggestions(product = {}) {
    const name = product.name || "Handmade Craft";
    const category = product.category || "Handicrafts";
    const village = product.artisan?.village || "Rural Maharashtra";

    return {
      titles: [
        `Masterwork ${name} • ${village} Heritage`,
        `Direct from Weaver: GI Certified ${name}`,
        `Authentic Handcrafted ${name} by Rural SHG Guild`,
        `Living Traditions: Pure ${name}`
      ],
      taglines: [
        "Crafted by hands. Empowered by technology.",
        "From sacred village looms straight to mindful urban sanctuaries.",
        "Zero middlemen. 100% verified grassroots provenance.",
        "Every thread tells an indigenous Sahyadri story."
      ],
      descriptions: [
        `Experience the sacred tactile warmth of authentic ${name}. Handcrafted with ancestral precision in ${village}, every curve and texture honors centuries of Maharashtrian cultural stewardship. Shipped directly from rural self-help artisan clusters with verified QR TrustTag traceability.`,
        `Bring living folk art into your home with this masterfully fashioned ${name}. Sustaining fair-trade livelihoods for women artisans in ${village}, while preserving non-industrial indigenous crafting techniques.`
      ],
      keywords: [
        "GI-Tagged", "Handloom Heritage", "Zero Middleman", "Warli Art",
        "Rural Maharashtra", "SHG Collective", "Direct from Artisan", "Sustainable Craft"
      ],
      socialCaption: `🌾 Direct from ${village}: Bringing timeless Maharashtrian craftsmanship into your home. Each ${name} is made by hand, tagged with our blockchain-verified QR TrustTag ensuring over 85% fair trade remittance back to village self-help groups. #Gramudyam #MakeInRuralIndia #VocalForLocal #ArtisanDirect`,
      packagingNote: `Thank you for choosing authentic rural craftsmanship. Your purchase directly supported our artisan collective in ${village}. Scan the QR TrustTag on the tag to meet the hands that created this masterpiece.`
    };
  }
};
