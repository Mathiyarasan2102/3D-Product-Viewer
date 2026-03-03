import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Viewer3D from './components/Viewer3D';
import Sidebar from './components/Sidebar';
import { uploadModelAPI, saveSettingsAPI, getSettingsAPI } from './services/api';

function App() {
    const [modelUrl, setModelUrl] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#171717');
    const [wireframeMode, setWireframeMode] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        loadSettings(true);
    }, []);

    const loadSettings = async (initial = false) => {
        try {
            const settings = await getSettingsAPI();
            if (settings) {
                setBackgroundColor(settings.backgroundColor || '#171717');
                setWireframeMode(settings.wireframeMode || false);
                if (settings.modelUrl) {
                    setModelUrl(`http://localhost:5000${settings.modelUrl}`);
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
            if (modelUrl.includes('localhost:5000')) {
                relativeUrl = modelUrl.split('localhost:5000')[1];
            }

            await saveSettingsAPI({
                backgroundColor,
                wireframeMode,
                modelUrl: relativeUrl
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
            setModelUrl(`http://localhost:5000${data.url}`);
            toast.success('Model uploaded successfully', { id: toastId });
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload model', { id: toastId });
        } finally {
            setIsUploading(false);
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

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        <span className="text-xs text-white/80 font-medium tracking-wide">Connected</span>
                    </div>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                    </a>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex w-full relative p-4 md:p-6 gap-6 h-[calc(100vh-4rem)] overflow-hidden">

                {/* Soft Radial Glow behind Canvas Container */}
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

                {/* 3D Canvas Area (Left - 75%) */}
                <div className="flex-1 relative z-10 w-full h-full lg:w-3/4 transition-all duration-300">
                    <Viewer3D
                        modelUrl={modelUrl}
                        backgroundColor={backgroundColor}
                        wireframeMode={wireframeMode}
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
