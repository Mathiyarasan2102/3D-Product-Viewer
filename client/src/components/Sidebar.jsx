import React, { useRef, useState } from 'react';
import { UploadCloud, Save, DownloadCloud, Settings2, Box as BoxIcon, Palette, Layers, Sun, Droplets, MapPin, Trash2, Plus } from 'lucide-react';

export default function Sidebar({
    backgroundColor,
    setBackgroundColor,
    wireframeMode,
    setWireframeMode,
    handleFileUpload,
    saveSettings,
    loadSettings,
    isUploading,
    isSaving,
    environment,
    setEnvironment,
    materialColor,
    setMaterialColor,
    metalness,
    setMetalness,
    roughness,
    setRoughness,
    hotspots,
    setHotspots,
    isAddingHotspot,
    setIsAddingHotspot
}) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const onFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 space-y-6 flex flex-col overflow-y-auto custom-scrollbar transition-all duration-300 hover:shadow-2xl hover:bg-white/[0.07]">
            {/* Header */}
            <div className="flex items-center space-x-3 pb-4 border-b border-white/5 shrink-0">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    <Settings2 size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white/90">Parameters</h2>
                    <p className="text-xs text-white/50 font-medium">Configure active scene</p>
                </div>
            </div>

            <div className="space-y-6 flex-1 pt-2">

                {/* File Upload Section */}
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 ml-1">Source File</p>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                        className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
                            ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-white/20 bg-black/20 hover:border-blue-500/50 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]'}
                        `}
                    >
                        <div className={`p-3 rounded-full mb-3 transition-colors duration-300 ${isDragging ? 'bg-blue-500/20' : 'bg-white/5 group-hover:bg-blue-500/10'}`}>
                            <UploadCloud size={24} className={`transition-colors duration-300 ${isDragging ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'}`} />
                        </div>
                        <span className="text-sm font-medium text-white/80 mb-1">
                            {isUploading ? 'Uploading...' : 'Click or drag file'}
                        </span>
                        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                            GLB or GLTF format
                        </span>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        accept=".glb,.gltf"
                        className="hidden"
                    />
                </div>

                {/* Appearance Settings */}
                <div className="space-y-2 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 ml-1">Appearance</p>

                    <div className="space-y-3">
                        {/* Background Color Picker */}
                        <div className="flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-300 group">
                            <div className="flex items-center space-x-3">
                                <Palette size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                                <span className="text-sm font-medium text-gray-300">Background</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-mono text-gray-500 uppercase">{backgroundColor}</span>
                                <div className="relative w-7 h-7 rounded-md overflow-hidden border border-white/20 shadow-inner cursor-pointer hover:scale-110 transition-transform flex-shrink-0">
                                    <input
                                        type="color"
                                        value={backgroundColor}
                                        onChange={(e) => setBackgroundColor(e.target.value)}
                                        className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer border-none outline-none p-0 bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Wireframe Toggle */}
                        <div className="flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-300 group">
                            <div className="flex items-center space-x-3">
                                <Layers size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                                <span className="text-sm font-medium text-gray-300">Wireframe</span>
                            </div>
                            <button
                                onClick={() => setWireframeMode(!wireframeMode)}
                                className={`relative w-10 h-[22px] rounded-full transition-colors duration-300 ease-in-out border border-white/10 outline-none ${wireframeMode ? 'bg-blue-600' : 'bg-gray-800'}`}
                            >
                                <div className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-out ${wireframeMode ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Environment Settings */}
                <div className="space-y-2 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 ml-1">Environment</p>
                    <div className="flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-300 group">
                        <div className="flex items-center space-x-3">
                            <Sun size={16} className="text-orange-500 group-hover:text-orange-400 transition-colors" />
                            <span className="text-sm font-medium text-gray-300">HDRI Preset</span>
                        </div>
                        <select
                            value={environment}
                            onChange={(e) => setEnvironment(e.target.value)}
                            className="bg-black/50 border border-white/10 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-1.5 outline-none"
                        >
                            <option value="city">City</option>
                            <option value="sunset">Sunset</option>
                            <option value="dawn">Dawn</option>
                            <option value="night">Night</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="forest">Forest</option>
                            <option value="apartment">Apartment</option>
                            <option value="studio">Studio</option>
                        </select>
                    </div>
                </div>

                {/* Material Settings */}
                <div className="space-y-2 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 ml-1">Materials Overlay</p>
                    <div className="space-y-3 bg-black/40 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                        {/* Material Color */}
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center space-x-3">
                                <Droplets size={16} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                                <span className="text-sm font-medium text-gray-300">Color</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-mono text-gray-500 uppercase">{materialColor}</span>
                                <div className="relative w-7 h-7 rounded-md overflow-hidden border border-white/20 shadow-inner cursor-pointer hover:scale-110 transition-transform flex-shrink-0">
                                    <input
                                        type="color"
                                        value={materialColor}
                                        onChange={(e) => setMaterialColor(e.target.value)}
                                        className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer border-none outline-none p-0 bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Metalness */}
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span className="text-xs font-medium text-gray-400">Metalness</span>
                                <span className="text-xs text-gray-500">{metalness}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={metalness}
                                onChange={(e) => setMetalness(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Roughness */}
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span className="text-xs font-medium text-gray-400">Roughness</span>
                                <span className="text-xs text-gray-500">{roughness}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={roughness}
                                onChange={(e) => setRoughness(parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Hotspots Settings */}
                <div className="space-y-2 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 ml-1">Annotations</p>
                    <div className="space-y-3 bg-black/40 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                        <button
                            onClick={() => setIsAddingHotspot(!isAddingHotspot)}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-all duration-300 border ${isAddingHotspot
                                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <Plus size={14} />
                            <span>{isAddingHotspot ? 'Click on model to add...' : 'Add Hotspot'}</span>
                        </button>

                        {hotspots.length > 0 && (
                            <div className="space-y-2 mt-3 block max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                {hotspots.map((spot, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                                        <div className="flex items-center space-x-2 overflow-hidden">
                                            <MapPin size={12} className="text-emerald-400 shrink-0" />
                                            <span className="text-xs text-gray-300 truncate">{spot.text}</span>
                                        </div>
                                        <button
                                            onClick={() => setHotspots(hotspots.filter((_, i) => i !== index))}
                                            className="text-red-400/70 hover:text-red-400 p-1 hover:bg-red-400/10 rounded transition-colors"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/5 shrink-0 mt-2">
                <button
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-50 disabled:hover:scale-100 text-white font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25"
                >
                    <Save size={18} />
                    <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                </button>
                <button
                    onClick={loadSettings}
                    className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-sm"
                >
                    <DownloadCloud size={18} className="text-white/70" />
                    <span>Load Saved</span>
                </button>
            </div>
        </div>
    );
}
