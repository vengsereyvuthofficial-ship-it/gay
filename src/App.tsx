import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  RotateCcw, 
  Share2, 
  Volume2, 
  VolumeX, 
  Terminal, 
  Cpu, 
  HelpCircle, 
  Check, 
  ArrowRight,
  Shield,
  Activity,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { ScanResult, StatusLog } from "./types";
import { getDeterministicResult } from "./data/results";
import { playBlip, playScanTick, playRevealFanfare, unlockAudio } from "./utils/audio";

const LOG_TEMPLATES = [
  "Calibrating satellite orientation sensors...",
  "Decrypting local fashion databases...",
  "Parsing user browser history for iced coffee keywords...",
  "Analyzing exclamation mark density in recent text messages...",
  "Evaluating pupillary response to Charli XCX and Lady Gaga...",
  "Checking denim jeans for precise cuff folding metrics...",
  "Measuring walking speed velocity (Alert: speed exceeds human limits)...",
  "Assessing affinity toward lawnmower and power-tool manuals...",
  "Analyzing closet composition: counting flannel vs. black hoodies...",
  "Calibrating double finger-gun reflex trigger speed...",
  "Evaluating sitting posture (Alert: complete inability to sit straight)...",
  "Analyzing Spotify playlist transition speeds...",
  "Aesthetic database compilation completed successfully..."
];

export default function App() {
  const [name, setName] = useState("");
  const [scanStage, setScanStage] = useState<"idle" | "scanning" | "revealed">("idle");
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [downloadRate, setDownloadRate] = useState("0.0 MB/s");
  const [logs, setLogs] = useState<StatusLog[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom when new logs appear
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Sound toggling helper
  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      unlockAudio();
      playBlip(1000, 0.08);
    }
  };

  // Run mock scanner sequence
  const startScanning = () => {
    unlockAudio();
    if (soundEnabled) {
      playBlip(600, 0.15);
    }

    setScanStage("scanning");
    setProgress(0);
    setResult(null);
    setLogs([]);

    // Initialize with first logs
    const initialLogs: StatusLog[] = [
      {
        timestamp: new Date().toLocaleTimeString(),
        message: `SYSTEM DETECTED: Initiating deep cognitive scan${name ? ` on [${name}]` : ""}`,
        type: "scan"
      },
      {
        timestamp: new Date().toLocaleTimeString(),
        message: "Establishing secure connection to the orientation grid...",
        type: "info"
      }
    ];
    setLogs(initialLogs);

    // Simulate downloading/scanning process (0 to 100%)
    let currentProgress = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      // Randomize download rate
      const rateNum = (Math.random() * 15 + 5).toFixed(1);
      setDownloadRate(`${rateNum} MB/s`);

      // Progress increments: random, slowing down at 99% for comedic effect
      let increment = 0;
      if (currentProgress < 40) {
        increment = Math.floor(Math.random() * 12) + 4;
      } else if (currentProgress < 85) {
        increment = Math.floor(Math.random() * 8) + 2;
      } else if (currentProgress < 98) {
        increment = Math.floor(Math.random() * 3) + 1;
      } else {
        // Stick at 99% for a brief dramatic pause!
        increment = Math.random() > 0.7 ? 1 : 0;
      }

      currentProgress = Math.min(99, currentProgress + increment);
      setProgress(currentProgress);

      if (soundEnabled && currentProgress < 99 && increment > 0) {
        playScanTick(currentProgress);
      }

      // Periodically inject funny status logs
      if (Math.random() > 0.4 && currentProgress < 99) {
        const logIndex = Math.floor((currentProgress / 100) * LOG_TEMPLATES.length);
        const logMsg = LOG_TEMPLATES[logIndex % LOG_TEMPLATES.length];
        
        setLogs(prev => {
          // Prevent duplicates
          if (prev.some(p => p.message === logMsg)) return prev;
          return [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              message: logMsg,
              type: Math.random() > 0.8 ? "warning" : "info"
            }
          ];
        });
      }

      // Finish condition
      const elapsed = Date.now() - startTime;
      if (currentProgress >= 99 && elapsed > 4500) {
        clearInterval(interval);
        
        // Finalize
        setProgress(100);
        setDownloadRate("0.0 MB/s");
        
        const scanResult = getDeterministicResult(name);
        setResult(scanResult);

        setLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            message: "MAPPING COMPLETE: All personality datasets downloaded.",
            type: "success"
          },
          {
            timestamp: new Date().toLocaleTimeString(),
            message: `Result determined: ${scanResult.title}`,
            type: "success"
          }
        ]);

        if (soundEnabled) {
          playRevealFanfare(scanResult.category === "gay" || scanResult.category === "fabulous" || scanResult.category === "bi");
        }

        // Short timeout before showing results
        setTimeout(() => {
          setScanStage("revealed");
        }, 800);
      }
    }, 150);
  };

  // Reset the scanner
  const handleReset = () => {
    if (soundEnabled) {
      playBlip(800, 0.05);
    }
    setScanStage("idle");
    setProgress(0);
    setResult(null);
    setLogs([]);
  };

  // Copy shareable diagnostics link to clipboard
  const handleShare = () => {
    if (soundEnabled) {
      playBlip(1100, 0.05);
    }
    const shareText = `🔬 QUANTUM ORIENTATION ANALYSIS REPORT:\n\n👤 Target: ${name ? name.trim() : "Self-Scan"}\n🏆 Result: ${result?.title || "Fabulous"}\n📊 Breakdown: ${result?.percentageGay}% Gay / ${result?.percentageStraight}% Straight\n\nRun your own diagnostic test at: ${window.location.href}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback alert
      alert("Unable to copy. Here is your result:\n" + shareText);
    });
  };

  return (
    <div id="orientation-app" className="min-h-screen w-full flex flex-col justify-between p-4 md:p-12 bg-indigo-600 font-sans text-white selection:bg-pink-500 selection:text-white">
      
      {/* Top Navigation & Sound Toggle matching the Vibrant Palette Header */}
      <header id="header" className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            <span className="text-2xl font-black text-black italic">!</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            MemeScan 3000
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block bg-black text-yellow-400 px-6 py-2 rounded-full font-bold uppercase tracking-widest border-2 border-yellow-400 text-xs">
            Live Beta v1.0.4
          </div>
          
          <button 
            id="sound-toggle"
            onClick={handleSoundToggle}
            className="p-3 bg-white hover:bg-zinc-100 border-4 border-black rounded-xl transition-all text-black hover:scale-105 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            title={soundEnabled ? "Mute Retro Sounds" : "Unmute Retro Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-black" /> : <VolumeX className="w-5 h-5 text-black" />}
          </button>
        </div>
      </header>

      {/* Main Sandbox Interactive Stage */}
      <main id="main-content" className="flex-grow flex items-center justify-center py-4 w-full">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: IDLE / ENTRY SCREEN */}
            {scanStage === "idle" && (
              <motion.div 
                key="idle-stage"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white p-8 md:p-12 rounded-[40px] border-[8px] border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] w-full text-center text-black relative overflow-hidden"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-4 py-1.5 rounded-lg font-black border-2 border-black rotate-3 text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-4">
                    <Sparkles className="w-3.5 h-3.5" /> 100% Scientific Meme Technology
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase leading-none italic drop-shadow-[2px_2px_0px_rgba(251,191,36,0.3)]">
                    The Ultimate <br/> Orientation Analyzer
                  </h2>
                  <p className="text-base md:text-lg text-zinc-600 font-bold max-w-sm mx-auto leading-snug">
                    Our patented Hyper-Meme Algorithm™ uses 0% of your data to provide 100% questionable results.
                  </p>
                </div>

                {/* Form Controls */}
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="text-left">
                    <label htmlFor="target-name" className="block text-xs uppercase tracking-widest font-black text-black mb-2">
                      Scan Target Name <span className="text-zinc-500 font-bold">(leave blank for self-scan)</span>
                    </label>
                    <div className="relative">
                      <input 
                        id="target-name"
                        type="text"
                        maxLength={30}
                        placeholder="Enter friend's name, crush's name, or self..."
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (soundEnabled && e.target.value.length % 3 === 0) {
                            playBlip(900, 0.02);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            startScanning();
                          }
                        }}
                        className="w-full bg-white border-[4px] border-black rounded-2xl px-4 py-3.5 text-sm font-bold text-black placeholder-zinc-400 outline-none transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      />
                      {name && (
                        <button
                          onClick={() => setName("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-500 hover:text-black uppercase"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Single Big Click Trigger */}
                  <div className="relative group inline-block w-full pt-4">
                    <button
                      id="initiate-scan-btn"
                      onClick={startScanning}
                      className="w-full bg-pink-500 text-white text-xl md:text-2xl font-black px-8 py-5 rounded-full border-[6px] border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-pink-600 transition-all uppercase tracking-tight cursor-pointer"
                    >
                      {name.trim() ? `Analyze "${name.trim()}"` : "Analyze My Vibe"}
                    </button>
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-black px-3 py-1 rounded-lg font-black border-2 border-black rotate-12 text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      SINGLE CLICK!
                    </div>
                  </div>
                </div>

                {/* Quick Info Disclaimer */}
                <div className="mt-10 pt-6 border-t-[4px] border-dashed border-zinc-200 flex items-start gap-3 text-zinc-500 text-left">
                  <Shield className="w-5 h-5 shrink-0 mt-0.5 text-black" />
                  <p className="text-[11px] font-bold leading-normal">
                    Disclaimer: This is a 100% satirical meme tool. This does not perform any actual biometric, physical, or behavioral tracking. Use it to laugh with friends and share funny stereotype breakdowns!
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: DOWNLOADING & SCANNING SEQUENCE */}
            {scanStage === "scanning" && (
              <motion.div 
                key="scanning-stage"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="bg-white p-8 md:p-12 rounded-[40px] border-[8px] border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] w-full text-center text-black overflow-hidden"
              >
                {/* Scanning Radar Ripple Visualizer */}
                <div className="flex flex-col items-center justify-center py-4 mb-6">
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                    <span className="absolute inset-0 rounded-full border-4 border-pink-500 animate-ping" />
                    <span className="absolute inset-3 rounded-full border-4 border-indigo-600 animate-pulse" />
                    <span className="absolute inset-6 rounded-full border-4 border-yellow-400" />
                    <div className="w-10 h-10 bg-black rounded-full border-2 border-white flex items-center justify-center relative">
                      <Activity className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-black mb-1 uppercase tracking-tight">
                    {name ? `Analyzing Vibe of "${name}"` : "Downloading Personality Profile"}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono font-black text-zinc-600 uppercase">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                    <span>Rate: {downloadRate}</span>
                  </div>
                </div>

                {/* Progress Indicators (Up to 100%) */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2 px-1">
                    <span className="text-black font-black uppercase text-xs tracking-widest italic">DOWNLOADING CLOSET DATASETS...</span>
                    <span className="text-pink-600 font-black text-sm">{progress}%</span>
                  </div>
                  
                  {/* Glowing Track Bar */}
                  <div className="w-full h-12 bg-zinc-200 rounded-2xl border-4 border-black overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-400 border-r-4 border-black"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-black font-black text-xs uppercase animate-pulse">
                        Extracting Essence...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terminal Logging logs */}
                <div className="bg-black border-4 border-black rounded-2xl p-4 h-44 flex flex-col justify-between text-left shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-2 mb-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                      <span>CONSOLE LOGS</span>
                    </div>
                    <span className="text-green-400 font-bold uppercase text-[10px]">Processing...</span>
                  </div>

                  <div 
                    ref={logsContainerRef}
                    className="flex-grow overflow-y-auto space-y-1.5 pr-2 font-mono text-[11px] leading-relaxed"
                  >
                    {logs.map((log, index) => (
                      <div 
                        key={index}
                        className={`${
                          log.type === "success" ? "text-emerald-400 font-bold" :
                          log.type === "warning" ? "text-amber-400" :
                          log.type === "error" ? "text-red-400" :
                          log.type === "scan" ? "text-pink-400 font-bold" : "text-zinc-300"
                        }`}
                      >
                        <span className="text-zinc-500 mr-1.5">[{log.timestamp}]</span>
                        {log.message}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: THE DRAMATIC REVEAL SCREEN */}
            {scanStage === "revealed" && result && (
              <motion.div 
                key="revealed-stage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 md:p-12 rounded-[40px] border-[8px] border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] w-full text-center text-black relative overflow-hidden"
              >
                {/* Header & Target Identity */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest border-2 border-yellow-400 text-xs mb-4">
                    <UserCheck className="w-4 h-4 text-yellow-400" />
                    <span>Subject: <strong className="text-white underline">{name ? name.trim() : "Self"}</strong></span>
                  </div>
                  
                  <h2 className="text-xs uppercase tracking-widest font-black text-zinc-500 mb-1 leading-none">
                    Scanner Diagnosis Complete
                  </h2>
                  
                  {/* Spectacular Big Result Badge */}
                  <div className="relative inline-block mt-4 mb-2">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className={`text-2xl md:text-3xl font-black uppercase tracking-wider px-8 py-4 rounded-3xl border ${result.glowColor}`}
                    >
                      {result.title}
                    </motion.div>
                  </div>
                </div>

                {/* Custom Percentage Breakdown Sliders */}
                <div className="space-y-4 bg-zinc-100 border-4 border-black p-5 rounded-2xl mb-8 text-left shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-3">
                    Orientation Composition Index
                  </h3>

                  {/* Gayness scale */}
                  <div>
                    <div className="flex justify-between text-xs font-black mb-1 text-black">
                      <span className="flex items-center gap-1">✨ Fabulous Index (Gay)</span>
                      <span className="font-bold text-pink-600">{result.percentageGay}%</span>
                    </div>
                    <div className="w-full h-8 bg-zinc-200 rounded-xl border-2 border-black overflow-hidden relative">
                      <motion.div 
                        className="h-full bg-pink-500 border-r-2 border-black"
                        initial={{ width: "0%" }}
                        animate={{ width: `${result.percentageGay}%` }}
                        transition={{ delay: 0.2, duration: 1 }}
                      />
                    </div>
                  </div>

                  {/* Straightness scale */}
                  <div>
                    <div className="flex justify-between text-xs font-black mb-1 text-black">
                      <span className="flex items-center gap-1">📐 Geometric Index (Straight)</span>
                      <span className="font-bold text-cyan-600">{result.percentageStraight}%</span>
                    </div>
                    <div className="w-full h-8 bg-zinc-200 rounded-xl border-2 border-black overflow-hidden relative">
                      <motion.div 
                        className="h-full bg-cyan-400 border-r-2 border-black"
                        initial={{ width: "0%" }}
                        animate={{ width: `${result.percentageStraight}%` }}
                        transition={{ delay: 0.3, duration: 1 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Verdict Paragraph */}
                <div className="mb-8 space-y-4 text-left">
                  <div className="bg-yellow-100 border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black">
                    <h4 className="text-xs uppercase tracking-wider font-black text-black mb-1 border-b border-black pb-1 inline-block">Scientific Verdict</h4>
                    <p className="text-sm font-bold leading-relaxed italic mt-2">
                      "{result.verdict}"
                    </p>
                  </div>

                  {/* Detected Stereotypes Bullet points */}
                  <div className="bg-white border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black">
                    <h4 className="text-xs uppercase tracking-wider font-black text-red-500 mb-3 flex items-center gap-1.5">
                      💥 Highly Suspicious Indicators Detected
                    </h4>
                    <ul className="space-y-2 text-xs font-bold">
                      {result.stereotypes.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-pink-500 font-black">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional diagnostic parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-100 rounded-xl border-2 border-black text-xs text-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                      <div className="text-zinc-600 font-black uppercase text-[10px] mb-1">Patron Meme Relic</div>
                      <div className="font-black text-black">{result.patronMeme}</div>
                    </div>
                    <div className="p-4 bg-green-100 rounded-xl border-2 border-black text-xs text-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                      <div className="text-zinc-600 font-black uppercase text-[10px] mb-1">Scientific Advice</div>
                      <div className="font-bold text-black italic">"{result.advice}"</div>
                    </div>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Share button */}
                  <button
                    id="share-results-btn"
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-black font-black py-4 px-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs md:text-sm uppercase"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div 
                          key="copied" 
                          initial={{ scale: 0.8, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }} 
                          className="flex items-center gap-1 text-black font-black"
                        >
                          <Check className="w-4 h-4 text-black" />
                          <span>Copied!</span>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="share" 
                          initial={{ scale: 0.8, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }} 
                          className="flex items-center gap-1.5 text-black font-black"
                        >
                          <Share2 className="w-4.5 h-4.5 text-black" />
                          <span>Share Report</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Reset button */}
                  <button
                    id="scan-again-btn"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-1.5 bg-emerald-400 hover:bg-emerald-500 text-black font-black py-4 px-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs md:text-sm uppercase"
                  >
                    <RotateCcw className="w-4 h-4 text-black" />
                    <span>Scan Someone Else</span>
                  </button>
                </div>

                {/* Satirical fine print disclaimer */}
                <div className="mt-8 pt-4 border-t-[4px] border-dashed border-zinc-200 flex items-start gap-1.5 text-zinc-400 text-[10px] leading-normal text-left font-bold">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-black" />
                  <span>
                    Report cert. ID #{Math.floor(Math.random() * 899999 + 100000)}. This output is scientifically randomized via funny deterministic character hash sums. Absolutely zero physical orientations were harmed or quantified during execution. Share to spread some smiles!
                  </span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Decorative Page Footer matching the Vibrant Palette hashtags */}
      <footer id="footer" className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-4 border-t border-indigo-500/30 pt-6 mt-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex gap-3 justify-center md:justify-start">
            <span className="bg-cyan-400 text-black font-black px-4 py-1 rounded-md border-2 border-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">#MEME</span>
            <span className="bg-green-400 text-black font-black px-4 py-1 rounded-md border-2 border-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">#SINGLE_CLICK</span>
            <span className="bg-orange-400 text-black font-black px-4 py-1 rounded-md border-2 border-black text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">#SCIENCE</span>
          </div>
          <p className="text-indigo-200 font-medium text-xs mt-2">
            * Results are generated by a chaotic quantum system that thrives on drama.
          </p>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-4xl font-black text-yellow-400 italic drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            100% SATISFACTION*
          </div>
          <div className="text-[10px] text-indigo-200 uppercase tracking-widest mt-1 font-bold">
            Certified by the Internet Institute of Pranks
          </div>
        </div>
      </footer>
    </div>
  );
}
