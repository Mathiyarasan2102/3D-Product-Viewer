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
        const { backgroundColor, wireframeMode, modelUrl } = req.body;
        let settings = await Settings.findOne();
        if (settings) {
            settings.backgroundColor = backgroundColor;
            settings.wireframeMode = wireframeMode;
            if (modelUrl !== undefined) settings.modelUrl = modelUrl;
            await settings.save();
        } else {
            settings = await Settings.create({ backgroundColor, wireframeMode, modelUrl });
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
            res.status(200).json({ backgroundColor: '#171717', wireframeMode: false, modelUrl: '' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
