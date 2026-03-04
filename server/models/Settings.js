import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    backgroundColor: {
        type: String,
        default: '#171717',
    },
    wireframeMode: {
        type: Boolean,
        default: false,
    },
    modelUrl: {
        type: String,
        default: '',
    },
    environment: {
        type: String,
        default: 'city',
    },
    materialColor: {
        type: String,
        default: '#ffffff',
    },
    metalness: {
        type: Number,
        default: 0,
    },
    roughness: {
        type: Number,
        default: 1,
    },
    hotspots: [{
        position: {
            x: Number,
            y: Number,
            z: Number
        },
        text: String
    }],
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
