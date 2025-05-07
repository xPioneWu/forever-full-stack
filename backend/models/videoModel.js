import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: { type: String, required: true },
    trending: { type: Boolean, default: false },
    userId: { type: String, default: '' },
    date: { type: Number, required: true }
})

const videoModel = mongoose.models.video || mongoose.model("video", videoSchema);

export default videoModel;