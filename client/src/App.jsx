import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Viewer3D from './components/Viewer3D';
import Sidebar from './components/Sidebar';
import { uploadModelAPI, saveSettingsAPI, getSettingsAPI, API_BASE_URL } from './services/api';

function App() {
    const [modelUrl, setModelUrl] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#171717');
    const [wireframeMode, setWireframeMode] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    // Enhancements state
    const [environment, setEnvironment] = useState('city');
    const [materialColor, setMaterialColor] = useState('#ffffff');
    const [metalness, setMetalness] = useState(0);
    const [roughness, setRoughness] = useState(1);
    const [hotspots, setHotspots] = useState([]);
    const [isAddingHotspot, setIsAddingHotspot] = useState(false);

    useEffect(() => {
        loadSettings(true);
    }, []);

    const loadSettings = async (initial = false) => {
        try {
            const settings = await getSettingsAPI();
            if (settings) {
                setBackgroundColor(settings.backgroundColor || '#171717');
                setWireframeMode(settings.wireframeMode || false);
                setEnvironment(settings.environment || 'city');
                setMaterialColor(settings.materialColor || '#ffffff');
                setMetalness(settings.metalness !== undefined ? settings.metalness : 0);
                setRoughness(settings.roughness !== undefined ? settings.roughness : 1);
                setHotspots(settings.hotspots || []);
                if (settings.modelUrl) {
                    setModelUrl(`${API_BASE_URL}${settings.modelUrl}`);
                }
                if (!initial) toast.success('Settings loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            if (!initial) toast.error('Failed to load settings');
        }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            let relativeUrl = modelUrl;
            if (API_BASE_URL && modelUrl.includes(API_BASE_URL)) {
                relativeUrl = modelUrl.split(API_BASE_URL)[1];
            } else if (modelUrl.startsWith('http')) {
                try {
                    const urlObj = new URL(modelUrl);
                    relativeUrl = urlObj.pathname;
                } catch (e) { }
            }

            await saveSettingsAPI({
                backgroundColor,
                wireframeMode,
                modelUrl: relativeUrl,
                environment,
                materialColor,
                metalness,
                roughness,
                hotspots
            });
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (file) => {
        setIsUploading(true);
        const toastId = toast.loading('Uploading model...');
        try {
            const data = await uploadModelAPI(file);
            setModelUrl(`${API_BASE_URL}${data.url}`);
            toast.success('Model uploaded successfully', { id: toastId });
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload model', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingFile(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-900 flex flex-col text-white font-sans">

            {/* Premium Top Navbar */}
            <nav className="h-16 flex items-center justify-between px-6 bg-gradient-to-r from-slate-900 via-slate-950 to-black border-b border-white/10 backdrop-blur-md shadow-md shrink-0 z-50">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold tracking-wide leading-tight text-slate-100">3D Product Viewer</h1>
                        <span className="text-xs text-white/60 font-medium">Interactive GLB Configurator</span>
                    </div>
                </div>


            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex w-full relative p-4 md:p-6 gap-6 h-[calc(100vh-4rem)] overflow-hidden">

                {/* Soft Radial Glow behind Canvas Container */}
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

                {/* 3D Canvas Area (Left - 75%) */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex-1 relative z-10 w-full h-full lg:w-3/4 transition-all duration-300 rounded-2xl ${isDraggingFile ? 'ring-2 ring-blue-500 scale-[1.01]' : ''
                        }`}
                >
                    {isDraggingFile && (
                        <div className="absolute inset-0 z-50 rounded-2xl bg-blue-500/10 border-2 border-blue-500 border-dashed flex items-center justify-center backdrop-blur-sm pointer-events-none">
                            <div className="bg-black/80 px-6 py-4 rounded-xl flex items-center space-x-3 shadow-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 16 4-4 4 4"></path></svg>
                                <span className="font-medium text-blue-100">Drop 3D Model here to load</span>
                            </div>
                        </div>
                    )}
                    <Viewer3D
                        modelUrl={modelUrl}
                        backgroundColor={backgroundColor}
                        wireframeMode={wireframeMode}
                        environment={environment}
                        materialProps={{ materialColor, metalness, roughness }}
                        hotspots={hotspots}
                        isAddingHotspot={isAddingHotspot}
                        onAddHotspot={(point) => {
                            const noteText = prompt("Enter hotspot description:");
                            if (noteText) {
                                setHotspots(prev => [...prev, { position: point, text: noteText }]);
                                setIsAddingHotspot(false);
                            } else {
                                toast.error('Hotspot creation cancelled.');
                                setIsAddingHotspot(false);
                            }
                        }}
                    />

                    {/* Mobile menu button */}
                    <button
                        className="absolute top-4 left-4 z-50 p-2 bg-black/60 backdrop-blur-md rounded-xl text-white border border-white/10 shadow-lg lg:hidden hover:bg-white/10 transition-colors"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>

                {/* Sidebar Container (Right - 25%) */}
                <div className={`absolute lg:relative z-40 right-4 lg:right-0 top-4 bottom-4 lg:top-0 lg:bottom-0 transition-transform duration-300 ease-out transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[150%] lg:translate-x-0'} lg:w-1/4 min-w-[320px] max-w-[400px]`}>
                    <Sidebar
                        backgroundColor={backgroundColor}
                        setBackgroundColor={setBackgroundColor}
                        wireframeMode={wireframeMode}
                        setWireframeMode={setWireframeMode}
                        handleFileUpload={handleFileUpload}
                        saveSettings={saveSettings}
                        loadSettings={() => loadSettings(false)}
                        isUploading={isUploading}
                        isSaving={isSaving}
                        environment={environment}
                        setEnvironment={setEnvironment}
                        materialColor={materialColor}
                        setMaterialColor={setMaterialColor}
                        metalness={metalness}
                        setMetalness={setMetalness}
                        roughness={roughness}
                        setRoughness={setRoughness}
                        hotspots={hotspots}
                        setHotspots={setHotspots}
                        isAddingHotspot={isAddingHotspot}
                        setIsAddingHotspot={setIsAddingHotspot}
                    />
                </div>
            </div>

            <Toaster position="bottom-right" toastOptions={{
                className: 'border border-white/10 bg-surface/90 backdrop-blur-md text-white shadow-2xl',
                style: {
                    background: '#171717',
                    color: '#fff',
                    borderRadius: '12px'
                }
            }} />
        </div>
    );
}

export default App;
