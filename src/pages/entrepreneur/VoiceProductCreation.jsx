import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { aiService } from '../../services/aiService';

export const VoiceProductCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [dialect, setDialect] = useState(() => {
    return lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  });
  const [speechSupported, setSpeechSupported] = useState(() => {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });

  // AI Processing pipeline status states: 'idle' | 'listening' | 'understanding' | 'extracting' | 'generating' | 'ready' | 'error'
  const [aiStatus, setAiStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Structured form state - initialized from existing draft if present
  const [formData, setFormData] = useState(() => {
    // If explicitly starting a brand new product, start fresh
    if (location.state?.isNew) {
      return {
        name: '',
        price: '',
        category: '',
        location: user?.village || 'Dahanu, Palghar',
        story: '',
        description: ''
      };
    }

    // If passed a specific draft in navigation (e.g. from ProductPreview "Edit with Voice")
    if (location.state?.draftProduct) {
      const p = location.state.draftProduct;
      return {
        name: p.name || '',
        price: p.price !== undefined ? p.price : 1200,
        category: p.category || 'Handicrafts & Tribal Art',
        location: p.artisan?.village || p.location || (user?.village || 'Dahanu, Palghar'),
        story: p.description || p.story || '',
        description: p.description || p.story || ''
      };
    }

    try {
      const draft = localStorage.getItem('gramudyam_draft_product');
      if (draft) {
        const parsed = JSON.parse(draft);
        // Only resume an uncommitted in-progress draft; ignore already-published items
        if (!parsed.isPublished && (parsed.name || parsed.price)) {
          return {
            name: parsed.name || '',
            price: parsed.price !== undefined ? parsed.price : 1200,
            category: parsed.category || 'Handicrafts & Tribal Art',
            location: parsed.artisan?.village || parsed.location || (user?.village || 'Dahanu, Palghar'),
            story: parsed.description || parsed.story || '',
            description: parsed.description || parsed.story || ''
          };
        }
      }
    } catch (e) {
      console.warn('Error reading initial product draft:', e);
    }
    return {
      name: '',
      price: '',
      category: '',
      location: user?.village || 'Dahanu, Palghar',
      story: '',
      description: ''
    };
  });

  // Track user manual edits so AI never overwrites human corrections
  const [userEdited, setUserEdited] = useState({
    name: false,
    price: false,
    category: false,
    location: false,
    story: false
  });

  // Refs to prevent stale closures and manage speech recognition across auto-restarts
  const recognitionRef = useRef(null);
  const startRecognitionRef = useRef(null);
  const timerRef = useRef(null);
  const isRecordingRef = useRef(false);
  const userEditedRef = useRef(userEdited);
  const transcriptRef = useRef(transcript);
  const dialectRef = useRef(dialect);
  const prevLangRef = useRef(lang);
  const debounceTimerRef = useRef(null);
  const extractionPipelineTimerRef = useRef(null);
  const accumulatedFinalTranscriptRef = useRef('');
  const currentSessionFinalRef = useRef('');
  const sessionCounterRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => {
    userEditedRef.current = userEdited;
  }, [userEdited]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    dialectRef.current = dialect;
  }, [dialect]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Sync dialect with site language when global language changes
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      const defaultDialect = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      setDialect(defaultDialect);
    }
  }, [lang]);

  // Helper to determine target NLP language code ('mr', 'hi', 'en') from dialect
  const getTargetLangFromDialect = useCallback((d) => {
    if (d && d.startsWith('mr')) return 'mr';
    if (d && d.startsWith('hi')) return 'hi';
    return 'en';
  }, []);

  // Process voice transcript through GraminNLP extraction pipeline
  const processVoiceTranscript = useCallback((spokenText) => {
    if (!spokenText || spokenText.trim().length < 2) return;

    if (extractionPipelineTimerRef.current) {
      clearTimeout(extractionPipelineTimerRef.current);
    }

    setAiStatus('understanding');

    extractionPipelineTimerRef.current = setTimeout(() => {
      setAiStatus('extracting');

      extractionPipelineTimerRef.current = setTimeout(() => {
        setAiStatus('generating');

        const currentDialect = dialectRef.current;
        const targetLang = getTargetLangFromDialect(currentDialect);
        const parsed = aiService.extractFromVoice(spokenText, targetLang);

        extractionPipelineTimerRef.current = setTimeout(() => {
          setFormData((prev) => ({
            name: parsed.name || prev.name,
            price: parsed.price !== undefined && parsed.price !== '' ? parsed.price : (prev.price || 1200),
            category: parsed.category || prev.category || 'Handicrafts & Tribal Art',
            location: parsed.location || prev.location,
            story: parsed.story || parsed.description || prev.story,
            description: parsed.description || parsed.story || prev.description
          }));
          setUserEdited({
            name: false,
            price: false,
            category: false,
            location: false,
            story: false
          });
          setAiStatus('ready');
        }, 200);
      }, 200);
    }, 200);
  }, [getTargetLangFromDialect]);

  // Debounced wrapper to prevent rapid consecutive NLP extractions while talking
  const scheduleTranscriptProcessing = useCallback((text) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      processVoiceTranscript(text);
    }, 400);
  }, [processVoiceTranscript]);

  // Stop active recognition instance cleanly
  const stopRecognitionInstance = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
  }, []);

  // Start new recognition instance with full lifecycle handling
  const startRecognition = useCallback(() => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setAiStatus('error');
      setErrorMessage(
        lang === 'mr'
          ? 'तुमच्या ब्राउझरमध्ये व्हॉइस रेकॉर्डिंग समर्थित नाही. कृपया Chrome किंवा Edge वापरा किंवा खाली माहिती टाइप करा.'
          : lang === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ रिकॉर्डिंग समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें या नीचे विवरण टाइप करें।'
          : 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or enter details manually.'
      );
      return;
    }

    stopRecognitionInstance();
    const sessionId = ++sessionCounterRef.current;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = dialectRef.current || 'en-IN';

      recognition.onstart = () => {
        if (sessionId !== sessionCounterRef.current) return;
        setAiStatus('listening');
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        if (sessionId !== sessionCounterRef.current) return;
        let currentSessionFinal = '';
        let currentSessionInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            currentSessionFinal += res[0].transcript + ' ';
          } else {
            currentSessionInterim += res[0].transcript + ' ';
          }
        }

        currentSessionFinalRef.current = currentSessionFinal;

        const combined = [
          accumulatedFinalTranscriptRef.current,
          currentSessionFinal,
          currentSessionInterim
        ]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (combined) {
          setTranscript(combined);
          scheduleTranscriptProcessing(combined);
        }
      };

      recognition.onerror = (event) => {
        if (sessionId !== sessionCounterRef.current) return;
        const err = event.error;

        // 'no-speech' happens when silence is detected.
        // If the artisan already spoke, cleanly stop and process what was recognized!
        // If nothing was spoken, stop cleanly and inform the user so they can retry.
        if (err === 'no-speech') {
          const capturedText = (transcriptRef.current || currentSessionFinalRef.current || accumulatedFinalTranscriptRef.current || '').trim();
          isRecordingRef.current = false;
          setIsRecording(false);
          clearInterval(timerRef.current);
          stopRecognitionInstance();

          if (capturedText) {
            processVoiceTranscript(capturedText);
            setAiStatus('ready');
          } else {
            setAiStatus('error');
            setErrorMessage(
              lang === 'mr'
                ? 'कोणताही आवाज ऐकू आला नाही. कृपया पुन्हा मायक्रोफोनवर क्लिक करा आणि स्पष्ट बोला.'
                : lang === 'hi'
                ? 'कोई आवाज़ सुनाई नहीं दी। कृपया पुनः माइक पर क्लिक करें और बोलें।'
                : 'No speech was detected. Please click the microphone to try again and speak clearly.'
            );
          }
          return;
        }

        if (err === 'not-allowed' || err === 'service-not-allowed') {
          isRecordingRef.current = false;
          setIsRecording(false);
          clearInterval(timerRef.current);
          stopRecognitionInstance();
          setAiStatus('error');
          setErrorMessage(
            lang === 'mr'
              ? 'मायक्रोफोन परवानगी नाकारली आहे. कृपया ब्राउझर सेटिंग्जमध्ये मायक्रोफोन सुरू करा किंवा माहिती स्वतः टाइप करा.'
              : lang === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र में माइक की अनुमति दें या नीचे विवरण टाइप करें।'
              : 'Microphone permission was denied. Please allow microphone access in your browser or enter details manually.'
          );
          return;
        }

        if (err === 'audio-capture') {
          isRecordingRef.current = false;
          setIsRecording(false);
          clearInterval(timerRef.current);
          stopRecognitionInstance();
          setAiStatus('error');
          setErrorMessage(
            lang === 'mr'
              ? 'मायक्रोफोन सापडला नाही. कृपया मायक्रोफोन जोडा किंवा माहिती खाली टाइप करा.'
              : lang === 'hi'
              ? 'माइक्रोफ़ोन नहीं मिला। कृपया माइक जोड़ें या नीचे विवरण टाइप करें।'
              : 'No microphone detected. Please plug in a microphone or type product details manually.'
          );
          return;
        }

        if (err === 'network') {
          isRecordingRef.current = false;
          setIsRecording(false);
          clearInterval(timerRef.current);
          stopRecognitionInstance();
          setAiStatus('error');
          setErrorMessage(
            lang === 'mr'
              ? 'आवाज सेवेसाठी नेटवर्क त्रुटी. कृपया इंटरनेट तपासा किंवा माहिती स्वतः टाइप करा.'
              : lang === 'hi'
              ? 'आवाज़ सेवा के लिए नेटवर्क समस्या। कृपया इंटरनेट जांचें या जानकारी स्वयं टाइप करें।'
              : 'Speech recognition network error. Please check your connection or enter details manually.'
          );
          return;
        }

        if (err === 'aborted') {
          return;
        }

        console.warn('Speech recognition notice:', err);
      };

      recognition.onend = () => {
        if (sessionId !== sessionCounterRef.current) return;

        // Commit finalized text from this session to the persistent accumulator
        if (currentSessionFinalRef.current) {
          accumulatedFinalTranscriptRef.current = [
            accumulatedFinalTranscriptRef.current,
            currentSessionFinalRef.current
          ]
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          currentSessionFinalRef.current = '';
        }

        // Cleanly end session
        clearInterval(timerRef.current);
        isRecordingRef.current = false;
        setIsRecording(false);
        const finalText = (transcriptRef.current || accumulatedFinalTranscriptRef.current || '').trim();
        if (finalText) {
          processVoiceTranscript(finalText);
          setAiStatus('ready');
        } else {
          setAiStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
      isRecordingRef.current = false;
      setIsRecording(false);
      clearInterval(timerRef.current);
      setAiStatus('error');
      setErrorMessage(
        lang === 'mr'
          ? 'मायक्रोफोन सुरू करता आला नाही. कृपया पुन्हा प्रयत्न करा.'
          : lang === 'hi'
          ? 'माइक शुरू नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Unable to start speech recognition. Please try again.'
      );
    }
  }, [lang, scheduleTranscriptProcessing, stopRecognitionInstance, processVoiceTranscript]);

  // Keep startRecognitionRef in sync
  useEffect(() => {
    startRecognitionRef.current = startRecognition;
  }, [startRecognition]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      stopRecognitionInstance();
      clearInterval(timerRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (extractionPipelineTimerRef.current) clearTimeout(extractionPipelineTimerRef.current);
    };
  }, [stopRecognitionInstance]);

  // Toggle microphone button handler
  const toggleRecording = () => {
    if (!speechSupported) {
      setErrorMessage(
        lang === 'mr'
          ? 'तुमच्या ब्राउझरमध्ये व्हॉइस रेकॉर्डिंग समर्थित नाही. कृपया खाली माहिती टाइप करा किंवा नमुने वापरा.'
          : lang === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ रिकॉर्डिंग समर्थित नहीं है। कृपया विवरण नीचे टाइप करें या नमूने चुनें।'
          : 'Web Speech API is not supported in this browser. Please type details manually or use sample phrases below.'
      );
      return;
    }

    if (isRecording) {
      // User clicked stop
      isRecordingRef.current = false;
      setIsRecording(false);
      clearInterval(timerRef.current);
      stopRecognitionInstance();

      const textToProcess = (transcriptRef.current || transcript || '').trim();
      if (textToProcess) {
        processVoiceTranscript(textToProcess);
        setAiStatus('ready');
      } else {
        setAiStatus('idle');
      }
    } else {
      // User clicked start
      isRecordingRef.current = true;
      setIsRecording(true);
      setRecordingSeconds(0);
      setAiStatus('listening');
      setErrorMessage('');

      // Fresh session - reset previous session buffers
      accumulatedFinalTranscriptRef.current = '';
      currentSessionFinalRef.current = '';
      setTranscript('');

      // Reset userEdited flags so newly recognized speech populates the fields
      setUserEdited({
        name: false,
        price: false,
        category: false,
        location: false,
        story: false
      });

      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      startRecognition();
    }
  };

  // Dialect change handler
  const handleDialectChange = (newDialect) => {
    setDialect(newDialect);
    dialectRef.current = newDialect;

    // If currently recording, restart in new dialect
    if (isRecordingRef.current) {
      startRecognition();
    }
  };

  // 1-Click Conversational Speech Samples
  const simulateDemoVoice = (demoText) => {
    isRecordingRef.current = false;
    setIsRecording(false);
    clearInterval(timerRef.current);
    stopRecognitionInstance();

    accumulatedFinalTranscriptRef.current = demoText;
    currentSessionFinalRef.current = '';
    setTranscript(demoText);
    setErrorMessage('');

    // Reset userEdited flags so demo speech populates fields cleanly
    setUserEdited({
      name: false,
      price: false,
      category: false,
      location: false,
      story: false
    });

    processVoiceTranscript(demoText);
  };

  // Manual input field change handler (preserves human edits from being overwritten by AI)
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'story' ? { description: value } : {}),
      ...(field === 'description' ? { story: value } : {})
    }));
    setUserEdited((prev) => ({
      ...prev,
      [field]: true,
      ...(field === 'story' ? { story: true } : {}),
      ...(field === 'description' ? { story: true } : {})
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Proceed to Product Preview with all entered / extracted product data
  const handleContinueToPreview = () => {
    const trimmedName = String(formData.name || '').trim();
    const rawPrice = Number(formData.price);

    if (!trimmedName) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया उत्पादनाचे नाव प्रविष्ट करा.'
          : lang === 'hi'
          ? 'कृपया उत्पाद का नाम दर्ज करें।'
          : 'Please enter a product title.'
      );
      return;
    }

    if (isNaN(rawPrice) || rawPrice <= 0) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया वैध किंमत प्रविष्ट करा.'
          : lang === 'hi'
          ? 'कृपया मान्य मूल्य दर्ज करें।'
          : 'Please enter a valid product price.'
      );
      return;
    }

    // Read any existing draft or navigation product
    let existingDraft = {};
    if (location.state?.draftProduct) {
      existingDraft = location.state.draftProduct;
    } else {
      try {
        const stored = localStorage.getItem('gramudyam_draft_product');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!parsed.isPublished) {
            existingDraft = parsed;
          }
        }
      } catch {}
    }

    const defaultImage =
      'https://lh3.googleusercontent.com/aida/AEtjO1X3LEEY6ALq7o8roki26KHrB7VZgQBBySHXkwLk9SDfdYFAxEOw5Sp1qsd5pxT-LLfTMYihu3k3YwHmAGRDKE61Zk5YQvucYVhf2XnzMMYpr1pb3o6VOqzL2PVFqIDp7GkrLYtnh_O-SyAO7SORHBtD37h_qo4t6TVyMk76q47EjuQ-C9Es5nPhUPXJkWyEZdkdbIztkyNSm1Zo5c8NUF84bBQe5O5--W07bvG3xWkXH5okp0nT6uDUMJ4F';

    // Distinguish explicit edit of an existing product vs creating a new product
    const isExplicitEdit = Boolean(location.state?.isEditing || existingDraft.isEditing);
    const productId = isExplicitEdit && existingDraft.id ? existingDraft.id : String(Date.now());
    const supabaseId = isExplicitEdit && existingDraft.supabaseId ? existingDraft.supabaseId : undefined;

    const draftProduct = {
      ...existingDraft,
      id: productId,
      supabaseId: supabaseId,
      isEditing: isExplicitEdit,
      isPublished: false,
      name: trimmedName,
      nameMr: trimmedName,
      category: formData.category || 'Handicrafts & Tribal Art',
      craft: existingDraft.craft || formData.category || 'Handicrafts',
      price: rawPrice,
      originalPrice: existingDraft.originalPrice || Math.round(rawPrice * 1.25),
      image: existingDraft.image || defaultImage,
      images:
        existingDraft.images && existingDraft.images.length > 0
          ? existingDraft.images
          : [existingDraft.image || defaultImage],
      image_url: existingDraft.image_url || undefined,
      description: formData.story || formData.description || existingDraft.description || '',
      story: formData.story || formData.description || existingDraft.story || '',
      location: formData.location || existingDraft.location || 'Dahanu, Palghar',
      artisan: {
        ...(existingDraft.artisan || {}),
        name: user?.name || existingDraft.artisan?.name || 'Savita Patil',
        nameMr: user?.name || existingDraft.artisan?.nameMr || 'सविता पाटील',
        role: 'Master Artisan',
        village: formData.location || user?.village || existingDraft.artisan?.village || 'Dahanu, Palghar',
        district: user?.district || existingDraft.artisan?.district || 'Palghar',
        cluster: user?.cluster || existingDraft.artisan?.cluster || 'Dahanu Tribal Collective',
        shgName: user?.shgName || existingDraft.artisan?.shgName || 'Adivasi Mahila Warli Kala Bachat Gat'
      },
      trustTagId: existingDraft.trustTagId || `GM-TRUST-000${Math.floor(10 + Math.random() * 90)}`,
      blockHash: existingDraft.blockHash || `0x${Math.random().toString(16).substr(2, 16)}`,
      qualityScore: existingDraft.qualityScore || 94,
      scansCount: existingDraft.scansCount || 1,
      remittancePercent: existingDraft.remittancePercent || 86.2
    };

    try {
      localStorage.setItem('gramudyam_draft_product', JSON.stringify(draftProduct));
    } catch (e) {
      console.warn('LocalStorage draft save error:', e);
    }

    navigate('/entrepreneur/product-preview', { state: { draftProduct } });
  };

  // Status message text generator
  const getStatusText = () => {
    switch (aiStatus) {
      case 'listening':
        return lang === 'mr'
          ? `🎤 ऐकत आहोत (${recordingSeconds}s)... तुमच्या उत्पादनाविषयी सांगा`
          : lang === 'hi'
          ? `🎤 सुन रहे हैं (${recordingSeconds}s)... अपने उत्पाद के बारे में बताएं`
          : `🎤 Listening (${recordingSeconds}s)... Speak naturally about your craft`;
      case 'understanding':
        return lang === 'mr'
          ? '✨ AI आवाज आणि भाषा समजून घेत आहे...'
          : lang === 'hi'
          ? '✨ AI आवाज़ और भाषा समझ रहा है...'
          : '✨ AI is understanding your product speech...';
      case 'extracting':
        return lang === 'mr'
          ? '✨ उत्पादनाची माहिती गोळा केली जात आहे...'
          : lang === 'hi'
          ? '✨ उत्पाद की जानकारी निकाली जा रही है...'
          : '✨ Extracting product details...';
      case 'generating':
        return lang === 'mr'
          ? '✨ अस्सल हस्तकला कथा तयार करत आहे...'
          : lang === 'hi'
          ? '✨ शिल्प की प्रामाणिक कहानी बनाई जा रही है...'
          : '✨ Creating your craft story & process...';
      case 'ready':
        return lang === 'mr'
          ? '✓ उत्पादन माहिती यशस्वीपणे तयार झाली'
          : lang === 'hi'
          ? '✓ उत्पाद की जानकारी सफलतापूर्वक तैयार है'
          : '✓ Product information ready';
      case 'error':
        return errorMessage || 'Error understanding speech';
      default:
        return lang === 'mr'
          ? 'मायक्रोफोन वर क्लिक करा किंवा खालील नमुना आवाज निवडा'
          : lang === 'hi'
          ? 'माइक पर क्लिक करें या नीचे नमूना आवाज़ चुनें'
          : 'Click microphone or select sample phrase below';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Dialect Engine */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge-pill badge-secondary">
              <span className="pulse-dot" />
              ग्रामीण AI व्हॉइस स्टुडिओ (VOICE STUDIO)
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>Step 1 of 5</span>
          </div>

          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('voiceCreation', 'Create Your Product')}{' '}
            <span style={{ fontWeight: '400', color: 'var(--secondary)', fontSize: '0.85em' }}>
              (बोलून उत्पादन जोडा)
            </span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', maxWidth: '650px' }}>
            {lang === 'mr'
              ? 'तुमच्या कलाकृतीबद्दल मराठी, हिंदी किंवा इंग्रजीत सांगा. आमचे AI तुमचे बोलणे समजून ई-कॉमर्स लिस्टिंग आपोआप तयार करते.'
              : lang === 'hi'
              ? 'अपनी कलाकृति के बारे में मराठी, हिंदी या अंग्रेजी में बताएं। हमारा AI आपकी बात समझकर ई-कॉमर्स लिस्टिंग खुद बना देता है।'
              : 'Tell us about your craft in Marathi, Hindi, or English. Our rural AI translates dialects and generates an authentic, verified e-commerce listing ready for national buyers.'}
          </p>
        </div>

        {/* Dialect Selector */}
        <div style={{ backgroundColor: 'var(--surface-container)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>translate</span>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
              Dialect Engine
            </div>
            <select
              value={dialect}
              onChange={(e) => handleDialectChange(e.target.value)}
              className="select-base"
              style={{ border: 'none', padding: '0', background: 'transparent', fontWeight: '700', color: 'var(--on-surface)', fontSize: '0.85rem' }}
            >
              <option value="mr-IN">Marathi (मराठी)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="en-IN">Indian English</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5-Step Visual Stepper */}
      <div className="card-base" style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--surface-container-lowest)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--primary-container)', color: 'white', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>1</span>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>Speak</div>
              <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>बोलून सांगा</div>
            </div>
          </div>

          <div style={{ backgroundColor: isRecording || aiStatus === 'understanding' ? 'var(--secondary-fixed)' : 'var(--surface-container-low)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--surface-container-high)', color: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>2</span>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>AI Interprets</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--outline)' }}>समजून घेत आहे</div>
            </div>
          </div>

          <div style={{ backgroundColor: aiStatus === 'extracting' || aiStatus === 'generating' || aiStatus === 'ready' ? 'var(--primary-fixed)' : 'var(--surface-container-low)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--surface-container-high)', color: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>3</span>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Extract Listing</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--outline)' }}>माहिती तयार</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--surface-container-high)', color: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>4</span>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Review</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--outline)' }}>तपासा</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--surface-container-high)', color: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px' }}>5</span>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Publish</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--outline)' }}>विक्री सुरू</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recording Interactive Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left: Giant Microphone Hero Centerpiece */}
        <div
          className="card-base"
          style={{
            padding: '2.5rem',
            backgroundColor: 'var(--surface-container-lowest)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem'
          }}
        >
          {/* Status badge */}
          <div
            className="badge-pill"
            style={{
              backgroundColor: isRecording
                ? 'var(--error-container)'
                : aiStatus === 'ready'
                ? 'var(--primary-container)'
                : aiStatus === 'error'
                ? 'var(--error-container)'
                : 'var(--surface-container)',
              color: isRecording
                ? 'var(--error)'
                : aiStatus === 'ready'
                ? 'white'
                : aiStatus === 'error'
                ? 'var(--error)'
                : 'var(--on-surface-variant)',
              padding: '0.4rem 1rem',
              transition: 'all 0.3s ease'
            }}
          >
            {isRecording ? (
              <span className="pulse-dot" style={{ backgroundColor: 'var(--error)' }} />
            ) : aiStatus === 'ready' ? (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mic</span>
            )}
            <span>{getStatusText()}</span>
          </div>

          <div>
            <h2 className="headline-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>
              {lang === 'mr' ? 'तुमच्या उत्पादनाची माहिती सांगा' : lang === 'hi' ? 'अपने उत्पाद की जानकारी बोलें' : 'Tell Us About Your Product'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', maxWidth: '420px' }}>
              {lang === 'mr'
                ? 'तुम्ही काय बनवले आहे, कच्चा माल आणि किंमत याबद्दल सहजपणे बोला.'
                : lang === 'hi'
                ? 'आपने क्या बनाया है, सामग्री और कीमत के बारे में आसानी से बताएं।'
                : 'Describe what you made, raw materials used, village location, and your price.'}
            </p>
          </div>

          {/* Interactive Mic Button with Audio Waveform */}
          <div style={{ position: 'relative', margin: '1rem 0' }}>
            {isRecording && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-15px',
                  borderRadius: '50%',
                  border: '2px solid var(--secondary)',
                  animation: 'pulse-ring 1.5s infinite'
                }}
              />
            )}

            <button
              onClick={toggleRecording}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                backgroundColor: isRecording ? 'var(--error)' : 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)',
                transform: isRecording ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              title={isRecording ? 'Stop Recording' : 'Start Speaking'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                {isRecording ? 'stop' : 'mic'}
              </span>
            </button>
          </div>

          {/* Waveform Visualization when recording */}
          {isRecording && (
            <div className="waveform-container">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="waveform-bar" />
              ))}
            </div>
          )}

          {/* Live Transcript Box */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-container-low)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>LIVE VOICE TRANSCRIPT (उच्चारित मजकूर):</span>
              {transcript && <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '600' }}>✓ Raw Audio Captured</span>}
            </div>
            <div style={{ fontSize: '0.9rem', color: transcript ? 'var(--on-surface)' : 'var(--outline)', fontStyle: transcript ? 'normal' : 'italic' }}>
              {transcript || (lang === 'mr'
                ? "तुमचे बोलणे ऐकण्याची वाट पाहत आहे... उदा. 'हे डहाणूचे हस्तनिर्मित वारली चित्र आहे, किंमत बाराशे रुपये'"
                : lang === 'hi'
                ? "आपकी आवाज़ सुनने की प्रतीक्षा है... उदा. 'यह डहाणू की हस्तनिर्मित वारली पेंटिंग है, कीमत 1200 रुपये'"
                : "Waiting for your speech... e.g. 'This is a handmade Warli painting from Dahanu costing 1200 rupees'")}
            </div>
          </div>

          {/* Optional inline error alert */}
          {errorMessage && (
            <div
              role="alert"
              style={{
                width: '100%',
                backgroundColor: 'var(--error-container)',
                color: 'var(--error)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                title="Dismiss"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
              </button>
            </div>
          )}

          {/* 1-Click Dialect Simulation Presets */}
          <div style={{ width: '100%', textAlign: 'left', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--outline)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Or Test with 1-Click Conversational Speech Samples:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => simulateDemoVoice("Warli painting on canvas")}
                className="btn-cream btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left', fontWeight: '600', borderColor: 'var(--primary)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>play_circle</span>
                <span>Voice Prompt Example: "Warli painting on canvas"</span>
              </button>

              <button
                type="button"
                onClick={() => simulateDemoVoice("हे डहाणूचे हस्तनिर्मित वारली चित्र आहे, माती आणि शेणाच्या कॅनव्हासवर तांदळाची पिठी आणि बांबूच्या काड्या वापरून बनवले आहे, किंमत बाराशे रुपये.")}
                className="btn-cream btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--secondary)' }}>play_circle</span>
                <span>मराठी: "हे डहाणूचे हस्तनिर्मित वारली चित्र आहे, किंमत बाराशे रुपये."</span>
              </button>

              <button
                type="button"
                onClick={() => simulateDemoVoice("This is a handmade Warli painting made on mud and cow dung primed canvas using natural rice flour paste and bamboo twigs. It costs 1200 rupees and is a traditional Warli tribal artwork from Dahanu.")}
                className="btn-cream btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--secondary)' }}>play_circle</span>
                <span>English: "This is a handmade Warli painting from Dahanu costing 1200 rupees."</span>
              </button>

              <button
                type="button"
                onClick={() => simulateDemoVoice("यह एक हाथ से बनाई गई वारली पेंटिंग है जो मिट्टी और गोबर के कैनवास पर चावल के पेस्ट से बनाई गई है। इसकी कीमत 1200 रुपये है और यह डहाणू की कला है।")}
                className="btn-cream btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--secondary)' }}>play_circle</span>
                <span>हिंदी: "यह एक हाथ से बनाई गई वारली पेंटिंग है, कीमत 1200 रुपये।"</span>
              </button>

              <button
                type="button"
                onClick={() => simulateDemoVoice("हा अस्सल पैठणी रेशीम साडीचा पदर आहे, येवला नाशिक येथील हस्तकला, किंमत चौदा हजार पाचशे रुपये.")}
                className="btn-cream btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--secondary)' }}>play_circle</span>
                <span>पैठणी साडी: "हा अस्सल पैठणी रेशीम साडीचा पदर आहे, किंमत १४,५०० रुपये."</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Extracted E-Commerce Listing */}
        <div
          className="card-base"
          style={{
            padding: '2rem',
            backgroundColor: 'var(--surface-container-lowest)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>auto_awesome</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)' }}>
                Extracted E-Commerce Listing
              </h3>
            </div>
            <span className="badge-pill badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {aiStatus === 'understanding' || aiStatus === 'extracting' || aiStatus === 'generating' ? (
                <>
                  <span className="pulse-dot" style={{ backgroundColor: 'white' }} />
                  Processing...
                </>
              ) : (
                'Auto-Parsed'
              )}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label-field">Product Title</label>
                {userEdited.name && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontStyle: 'italic' }}>
                    (Manually Edited)
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="input-base"
                placeholder="e.g. Traditional Warli Tribal Art"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label-field">Direct Price (₹)</label>
                  {userEdited.price && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontStyle: 'italic' }}>
                      (Edited)
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleFieldChange('price', e.target.value === '' ? '' : Number(e.target.value))}
                  className="input-base"
                  placeholder="e.g. 1200"
                  min="0"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label-field">Category</label>
                  {userEdited.category && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontStyle: 'italic' }}>
                      (Edited)
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="input-base"
                  placeholder="e.g. Handicrafts & Tribal Art"
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label-field">Village Cluster Location</label>
                {userEdited.location && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontStyle: 'italic' }}>
                    (Manually Edited)
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="input-base"
                placeholder="e.g. Dahanu, Palghar"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label-field">Product Description / Craft Story & Process</label>
                {userEdited.story && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontStyle: 'italic' }}>
                    (Manually Edited)
                  </span>
                )}
              </div>
              <textarea
                rows="4"
                value={formData.story}
                onChange={(e) => handleFieldChange('story', e.target.value)}
                className="input-base"
                placeholder="Product description will be generated automatically from voice or type here..."
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button
              onClick={handleContinueToPreview}
              className="btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Continue to Product Preview</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};