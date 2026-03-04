import Settings from '../models/Settings.js';
import path from 'path';

export const uploadModel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ url: fileUrl, message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const saveSettings = async (req, res) => {
    try {
        const { backgroundColor, wireframeMode, modelUrl, environment, materialColor, metalness, roughness, hotspots } = req.body;
        let settings = await Settings.findOne();
        if (settings) {
            if (backgroundColor !== undefined) settings.backgroundColor = backgroundColor;
            if (wireframeMode !== undefined) settings.wireframeMode = wireframeMode;
            if (modelUrl !== undefined) settings.modelUrl = modelUrl;
            if (environment !== undefined) settings.environment = environment;
            if (materialColor !== undefined) settings.materialColor = materialColor;
            if (metalness !== undefined) settings.metalness = metalness;
            if (roughness !== undefined) settings.roughness = roughness;
            if (hotspots !== undefined) settings.hotspots = hotspots;
            await settings.save();
        } else {
            settings = await Settings.create(req.body);
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (settings) {
            res.status(200).json(settings);
        } else {
            res.status(200).json({
                backgroundColor: '#171717',
                wireframeMode: false,
                modelUrl: '',
                environment: 'city',
                materialColor: '#ffffff',
                metalness: 0,
                roughness: 1,
                hotspots: []
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
