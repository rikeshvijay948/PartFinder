import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (parsed: { make?: string; model?: string; partName: string; year?: string }) => void;
}

// Quick speech samples for testing when mic permission is unavailable or for 1-click simulation
const VOICE_DEMO_SAMPLES = [
  { label: 'Tata Ace Clutch Release Bearing', make: 'Tata', model: 'Ace', part: 'Clutch Release Bearing', year: '2019' },
  { label: 'Mahindra Bolero Front Brake Pads', make: 'Mahindra', model: 'Bolero', part: 'Front Brake Pads', year: '2021' },
  { label: 'Toyota Innova Crysta Alternator 12V', make: 'Toyota', model: 'Innova Crysta', part: 'Alternator 12V 75A', year: '2022' },
  { label: 'Maruti Suzuki Swift Engine Oil Filter', make: 'Maruti Suzuki', model: 'Swift', part: 'Engine Oil Filter', year: '2020' },
];

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onResult,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<{
    make?: string;
    model?: string;
    partName: string;
    year?: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setErrorMessage(null);
      setParsedResult(null);
      return;
    }

    startListening();
  }, [isOpen]);

  const parseSpokenText = (text: string) => {
    const clean = text.trim();
    const lower = clean.toLowerCase();

    let make = '';
    let model = '';
    let year = '2019';
    let partName = clean;

    if (lower.includes('tata')) make = 'Tata';
    else if (lower.includes('mahindra')) make = 'Mahindra';
    else if (lower.includes('toyota')) make = 'Toyota';
    else if (lower.includes('maruti')) make = 'Maruti Suzuki';
    else if (lower.includes('ashok') || lower.includes('leyland')) make = 'Ashok Leyland';
    else if (lower.includes('hyundai')) make = 'Hyundai';

    if (lower.includes('ace')) model = 'Ace';
    else if (lower.includes('bolero')) model = 'Bolero';
    else if (lower.includes('innova')) model = 'Innova Crysta';
    else if (lower.includes('swift')) model = 'Swift';
    else if (lower.includes('dost')) model = 'Dost+';

    // Year detection
    const yearMatch = text.match(/\b(201\d|202\d)\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }

    // Part detection
    if (lower.includes('clutch') || lower.includes('bearing')) {
      partName = 'Clutch Release Bearing';
    } else if (lower.includes('brake') || lower.includes('pad')) {
      partName = 'Front Brake Pad Kit';
    } else if (lower.includes('alternator') || lower.includes('dynamo')) {
      partName = 'Alternator 12V 75A';
    } else if (lower.includes('filter') || lower.includes('oil')) {
      partName = 'Engine Oil Filter';
    } else if (lower.includes('starter') || lower.includes('motor')) {
      partName = 'Starter Motor Assembly';
    } else if (lower.includes('water pump') || lower.includes('pump')) {
      partName = 'Water Pump Assembly';
    }

    return {
      make: make || undefined,
      model: model || undefined,
      partName,
      year,
    };
  };

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setParsedResult(null);

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        'Browser speech recognition is not supported in this browser. You can click any voice sample below to simulate mechanic voice input.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English tailored for local accent & parts

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const speechText = event.results[current][0].transcript;
        setTranscript(speechText);
        const parsed = parseSpokenText(speechText);
        setParsedResult(parsed);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. You can select a quick voice sample below.');
        } else {
          setErrorMessage(`Voice recognition note (${event.error}). Try speaking again or pick a voice preset.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage('Unable to activate microphone. Please try clicking a quick voice sample below.');
    }
  };

  const handleSelectSample = (sample: (typeof VOICE_DEMO_SAMPLES)[0]) => {
    setTranscript(sample.label);
    const parsed = {
      make: sample.make,
      model: sample.model,
      partName: sample.part,
      year: sample.year,
    };
    setParsedResult(parsed);
    setIsListening(false);
  };

  const handleApply = () => {
    if (parsedResult) {
      onResult(parsedResult);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 border border-slate-700/80 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Mic className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-[10px] font-bold uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Hands-Free Workshop Mode</span>
              </div>
              <h3 className="text-lg font-bold text-white">Mechanic Voice Search</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Visualizer Area */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-navy-950 border border-slate-800 text-center relative space-y-4">
          <button
            onClick={isListening ? () => setIsListening(false) : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border-2 border-rose-500 shadow-lg shadow-rose-500/30 animate-pulse'
                : 'bg-brand-600/20 text-brand-400 border-2 border-brand-500 hover:scale-105'
            }`}
          >
            {isListening ? <Mic className="w-9 h-9" /> : <MicOff className="w-9 h-9" />}
          </button>

          <div>
            <div className="text-sm font-bold text-white">
              {isListening ? 'Listening... Speak clearly' : 'Tap mic to speak'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Say e.g. <span className="text-brand-300">"Tata Ace clutch release bearing"</span> or <span className="text-brand-300">"Brake pads for Bolero"</span>
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="w-full p-3 rounded-xl bg-navy-900 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="italic truncate">"{transcript}"</span>
            </div>
          )}

          {errorMessage && (
            <div className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Parsed Recognition Result */}
        {parsedResult && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              <span>Recognized Parameters:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="p-2 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Part Name</span>
                <span className="font-bold text-white truncate block">{parsedResult.partName}</span>
              </div>
              <div className="p-2 rounded-lg bg-navy-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Vehicle</span>
                <span className="font-bold text-white truncate block">
                  {parsedResult.make ? `${parsedResult.make} ${parsedResult.model || ''}` : 'Any Compatible'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 1-Click Voice Test Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Or Test 1-Click Voice Presets:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {VOICE_DEMO_SAMPLES.map((sample, i) => (
              <button
                key={i}
                onClick={() => handleSelectSample(sample)}
                className="p-2 rounded-xl bg-navy-950 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/50 text-left text-[11px] text-slate-300 hover:text-white transition-all truncate"
              >
                🎙️ {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="secondary"
            size="md"
            className="flex-1 text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            disabled={!parsedResult}
            className="flex-1 text-xs font-bold"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={handleApply}
          >
            Apply to Search
          </Button>
        </div>
      </div>
    </div>
  );
};
