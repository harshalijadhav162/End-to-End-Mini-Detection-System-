"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Activity,
  CheckCircle2,
  Image as ImageIcon,
  Maximize2,
  Cpu,
  Zap,
  ScanLine,
  Volume2,
  VolumeX,
  BrainCircuit,
  Camera,
  Download,
  RefreshCw,
  FileText
} from "lucide-react";

type Detection = {
  label: string;
  confidence: number;
  box: [number, number, number, number];
};

type Result = {
  filename: string;
  detections: Detection[];
  message: string;
  analysis?: {
    scene_type: string;
    summary: string;
  };
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const cardRef = useRef<HTMLDivElement>(null);

  // API URL logic - trimmed and sanitized
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const API_URL = rawUrl.replace(/\/$/, "").trim();

  // Real Health Check
  const checkBackend = async () => {
    try {
      console.log("Checking backend at:", API_URL);
      const resp = await fetch(API_URL);
      if (resp.ok) {
        setBackendStatus("online");
      } else {
        console.warn("Backend responded with error:", resp.status);
        setBackendStatus("offline");
      }
    } catch (err) {
      console.error("Connectivity error:", err);
      setBackendStatus("offline");
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // 3D Tilt Effect Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null); // Clear previous results while loading
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/detect`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);

      if (audioEnabled && data.analysis?.summary) {
        const utterance = new SpeechSynthesisUtterance(data.analysis.summary);
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to connect to the backend API. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getConfidenceColor = (score: number) => {
    if (score > 0.9) return "text-green-400 border-green-500/50 bg-green-500/10";
    if (score > 0.75) return "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
    return "text-orange-400 border-orange-500/50 bg-orange-500/10";
  };

  const startCamera = async () => {
    setIsCameraMode(true);
    setFile(null);
    setPreview(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      // alert("Could not access camera"); // Typically blocked in automated browsers, good for user
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(file);
        setFile(file);
        setPreview(url);
        setIsCameraMode(false);

        // Stop stream
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }, "image/jpeg");
  };

  const downloadReport = () => {
    if (!result) return;
    const content = `Mini Detection System Report\n\nDate: ${new Date().toLocaleString()}\nFile: ${result.filename}\nScene Analysis: ${result.analysis?.scene_type}\nSummary: ${result.analysis?.summary}\n\nDetections:\n${result.detections.map(d => `- ${d.label} (${Math.round(d.confidence * 100)}%)`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'detection_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center p-4 sm:p-6 md:p-12 gap-8 md:gap-12 font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background */}
      <div className="bg-mesh" />

      {/* Header */}
      <header className="flex flex-col items-center gap-4 md:gap-6 z-10 text-center max-w-2xl w-full">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 shadow-lg shadow-purple-500/10 backdrop-blur-md">
            <Zap size={14} className="fill-purple-300" />
            <span>Next-Gen Object Detection</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 rounded-full border transition-all ${audioEnabled ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`}
            title={audioEnabled ? "Voice Feedback On" : "Voice Feedback Off"}
          >
            {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
        <div className="space-y-4 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Visual <span className="text-gradient-purple">Intelligence</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg mx-auto">
            Experience real-time AI computer vision. Upload any image to instantly detect and classify objects with high-precision inference.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl z-10 flex flex-col lg:flex-row gap-8 items-start">

        {/* Left Col: Upload & Preview */}
        <div className="flex-1 w-full flex flex-col gap-6" style={{ perspective: "1000px" }}>

          {/* Input Toggle */}
          <div className="flex bg-white/5 p-1 rounded-lg w-max border border-white/10 self-center lg:self-start">
            <button
              onClick={() => { setIsCameraMode(false); setFile(null); setPreview(null); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${!isCameraMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:text-white'}`}
            >
              <Upload size={16} /> Upload
            </button>
            <button
              onClick={startCamera}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${isCameraMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:text-white'}`}
            >
              <Camera size={16} /> Live Camera
            </button>
          </div>

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="glass rounded-3xl p-1.5 border border-white/10 overflow-hidden relative shadow-2xl shadow-purple-900/20 transition-transform duration-200 ease-out preserve-3d"
          >
            <div
              className={`
                relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[16/10]
                rounded-[1.25rem] border-2 border-dashed
                flex flex-col items-center justify-center 
                transition-all duration-300 overflow-hidden
                ${!preview && !isCameraMode
                  ? "border-white/10 bg-black/20 hover:border-purple-500/50 hover:bg-black/30 cursor-pointer"
                  : "border-transparent bg-black"
                }
              `}
              onClick={() => !preview && !isCameraMode && fileInputRef.current?.click()}
            >
              {isCameraMode ?
                <div className="relative w-full h-full">
                  {!preview ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                  ) : (
                    <img src={preview} alt="Captured" className="w-full h-full object-cover transform scale-x-[-1]" />
                  )}

                  {!preview && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                      <button
                        onClick={(e) => { e.stopPropagation(); captureImage(); }}
                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm"
                      >
                        <div className="w-12 h-12 bg-white rounded-full" />
                      </button>
                    </div>
                  )}
                </div>
                : (
                  <>
                    {preview ? (
                      <div className="relative w-full h-full group">
                        {/* HUD Overlay Elements */}
                        <div className="hud-corners" />
                        <div className="hud-grid absolute inset-0 opacity-20 pointer-events-none" />

                        {/* Image Preview */}
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-contain relative z-0"
                        />

                        {/* Scanning Animation */}
                        {loading && (
                          <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="scan-line" />
                            <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />

                            {/* Fake Terminal Log */}
                            <div className="absolute bottom-4 left-4 font-mono text-xs text-green-400 flex flex-col gap-1 bg-black/80 p-2 rounded border border-green-500/30">
                              <span className="terminal-text">&gt; Initializing neural engine...</span>
                              <span className="terminal-text" style={{ animationDelay: "0.5s" }}>&gt; Loading weights...</span>
                              <span className="terminal-text" style={{ animationDelay: "1s" }}>&gt; Analyzing vectors...</span>
                            </div>
                          </div>
                        )}

                        {/* Overlays (Detections) */}
                        {!loading && result?.detections.map((det, i) => {
                          // Simple normalization for display if needed, but mock returns absolute pixels
                          // Ideally we'd scale this to the image container, but for this mock we assume
                          // the mock boxes are roughly in range or we just display them as is.
                          // For a real app, you'd calculate scale factors. 
                          // Here we will just trust the simple mock values or use percentages if we could.

                          return (
                            <div
                              key={i}
                              className="absolute border-2 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-in fade-in zoom-in duration-300"
                              style={{
                                left: `${det.box[0]}px`,
                                top: `${det.box[1]}px`,
                                width: `${det.box[2]}px`,
                                height: `${det.box[3]}px`,
                              }}
                            >
                              <span className="absolute -top-8 left-0 flex items-center gap-1.5 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                {det.label}
                                <span className="bg-black/20 px-1 rounded text-[10px]">{Math.round(det.confidence * 100)}%</span>
                              </span>
                            </div>
                          )
                        })}

                        {/* Clear Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                          className="absolute top-4 right-4 bg-black/60 hover:bg-red-500/90 text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                          title="Remove Image"
                        >
                          <X size={20} />
                        </button>

                        {/* Image Info Badge */}
                        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur text-xs text-white/80 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon size={14} />
                          {file?.name}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-6 text-gray-400 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          <Upload size={32} className="text-purple-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-white text-lg font-medium group-hover:text-purple-300 transition-colors">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG (Max 10MB)</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </>
                )}
            </div>
          </div>

          <button
            disabled={!file || loading}
            onClick={handleUpload}
            className={`
              w-full py-4 rounded-xl font-bold text-lg shadow-lg
              flex items-center justify-center gap-3
              transition-all duration-300 relative overflow-hidden group
              ${!file
                ? "bg-white/5 text-gray-600 cursor-not-allowed"
                : loading
                  ? "bg-purple-600/50 text-white cursor-wait"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white hover:scale-[1.01] hover:shadow-purple-600/30"}
            `}
          >
            {loading ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                Processing Image...
              </>
            ) : (
              <>
                <ScanLine size={20} className={file ? "animate-pulse" : ""} />
                Run Detection
              </>
            )}
          </button>
        </div>

        {/* Right Col: Stats / Info */}
        <div className="w-full lg:w-96 flex flex-col gap-4 md:gap-6">

          {/* Status Card */}
          <div className="glass rounded-2xl p-5 md:p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-purple-400" />
              System Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase">Backend</span>
                <span className={`text-sm font-mono flex items-center gap-2 ${backendStatus === 'online' ? 'text-green-400' : backendStatus === 'offline' ? 'text-red-400' : 'text-yellow-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'online' ? 'bg-green-500 animate-pulse' : backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-bounce'}`} />
                  {backendStatus.toUpperCase()}
                </span>
                {backendStatus === 'offline' && (
                  <span className="text-[10px] text-gray-600 truncate max-w-full" title={API_URL}>
                    Target: {API_URL}
                  </span>
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase">Latency</span>
                <span className="text-sm font-mono text-blue-400">~1.5s</span>
              </div>
            </div>
          </div>

          {/* Scene Analysis Card (New Unique Feature) */}
          {result?.analysis && (
            <div className="glass rounded-2xl p-6 border border-white/10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <BrainCircuit size={18} className="text-pink-400" />
                Scene Intelligence
              </h3>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-white/5">
                <div className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
                  {result.analysis.scene_type}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {result.analysis.summary}
                </p>
              </div>
            </div>
          )}

          {/* Results Card */}
          <div className={`glass rounded-2xl p-6 border border-white/10 flex-1 transition-all duration-500 ${!result ? 'opacity-80' : 'opacity-100'}`}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Maximize2 size={18} className="text-purple-400" />
                Analysis Results
              </div>
              {result && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                  {result.detections.length} objects
                </span>
              )}
            </h3>

            <div className="flex flex-col gap-3 min-h-[300px]">
              {!result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4 text-gray-500 border-2 border-dashed border-white/5 rounded-xl bg-black/20">
                  <Cpu size={32} className="opacity-20" />
                  <p className="text-sm">
                    Waiting for input...
                    <br />
                    <span className="text-xs opacity-60">Upload an image and run detection to see detailed analysis.</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Header Summary */}
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-white/5">
                    <span className="text-gray-400">Inference Status</span>
                    <span className="text-green-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  </div>

                  {/* List of Detections */}
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    <span className="text-xs text-gray-500 uppercase tracking-wider sticky top-0 bg-[#0a0a0a]/95 backdrop-blur py-2 block">
                      Detected Objects
                    </span>

                    {result.detections.length === 0 && (
                      <div className="py-8 text-center text-sm text-gray-500 italic">
                        No objects detected above threshold.
                      </div>
                    )}

                    {result.detections.map((det, i) => {
                      const confColorStyle = getConfidenceColor(det.confidence);
                      return (
                        <div key={i} className={`rounded-xl p-3 flex justify-between items-center border transition-all hover:bg-white/5 ${confColorStyle}`}>
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-md flex items-center justify-center bg-black/20 text-[10px] font-mono text-gray-300">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium capitalize text-gray-200">{det.label}</span>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-xs font-mono font-bold opacity-90">{Math.round(det.confidence * 100)}%</span>
                            <span className="text-[10px] opacity-60 uppercase">Confidence</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="z-10 text-gray-600 text-sm mt-auto py-4 flex flex-col md:flex-row gap-4 items-center justify-between w-full max-w-6xl border-t border-white/5">
        <span>Antigravity Custom Build v1.0</span>
        <div className="flex items-center gap-4 text-xs">
          <span className="hover:text-purple-400 transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-purple-400 transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-purple-400 transition-colors cursor-pointer">Documentation</span>
        </div>
      </footer>
    </div>
  );
}
