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
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
