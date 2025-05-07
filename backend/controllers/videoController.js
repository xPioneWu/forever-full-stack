import { v2 as cloudinary } from "cloudinary";
import videoModel from "../models/videoModel.js";

// function for add video
const addVideo = async (req, res) => {
    try {
        const { title, description, category, trending, userId } = req.body;

        const videoFile = req.files.video && req.files.video[0];
        const thumbnailFile = req.files.thumbnail && req.files.thumbnail[0];

        if (!videoFile) {
            return res.json({ success: false, message: "Video file is required" });
        }

        // Upload video to cloudinary
        const videoResult = await cloudinary.uploader.upload(videoFile.path, {
            resource_type: 'video',
            folder: 'videos'
        });

        // Upload thumbnail if exists
        let thumbnailUrl = '';
        if (thumbnailFile) {
            const thumbnailResult = await cloudinary.uploader.upload(thumbnailFile.path, {
                resource_type: 'image',
                folder: 'video-thumbnails'
            });
            thumbnailUrl = thumbnailResult.secure_url;
        }

        const videoData = {
            title,
            description,
            category,
            videoUrl: videoResult.secure_url,
            thumbnailUrl,
            trending: trending === 'true',
            userId: userId || '',
            date: Date.now()
        };

        const video = new videoModel(videoData);
        await video.save();

        res.json({ success: true, message: "Video Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for list videos
const listVideos = async (req, res) => {
    try {
        const videos = await videoModel.find({}).sort({ date: -1 });
        
        if (!videos || videos.length === 0) {
            return res.json({ success: false, message: "Hiç video bulunamadı" });
        }
        
        res.json({ success: true, videos });
    } catch (error) {
        console.log('Video listeleme hatası:', error);
        res.json({ success: false, message: error.message });
    }
};

// function for list user videos
const listUserVideos = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.json({ success: false, message: "Kullanıcı ID'si gerekli" });
        }
        
        const videos = await videoModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, videos });
    } catch (error) {
        console.log('Kullanıcı videoları listeleme hatası:', error);
        res.json({ success: false, message: error.message });
    }
};

// function for removing video
const removeVideo = async (req, res) => {
    try {
        await videoModel.findByIdAndDelete(req.body.videoId);
        res.json({ success: true, message: "Video Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for single video info
const singleVideo = async (req, res) => {
    try {
        const { videoId } = req.body;
        const video = await videoModel.findById(videoId);
        res.json({ success: true, video });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for toggling trending status
const toggleTrending = async (req, res) => {
    try {
        const { videoId, trending } = req.body;
        
        const video = await videoModel.findByIdAndUpdate(
            videoId, 
            { trending }, 
            { new: true }
        );
        
        if (!video) {
            return res.json({ success: false, message: "Video bulunamadı" });
        }
        
        res.json({ 
            success: true, 
            message: trending ? "Video trend listesine eklendi" : "Video trend listesinden çıkarıldı" 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for list trending videos
const listTrendingVideos = async (req, res) => {
    try {
        const videos = await videoModel.find({ trending: true }).sort({ date: -1 });
        res.json({ success: true, videos });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for updating video
const updateVideo = async (req, res) => {
    try {
        const { videoId, title, description, category, trending } = req.body;
        
        if (!videoId) {
            return res.json({ success: false, message: "Video ID is required" });
        }
        
        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
            ...(category && { category }),
            ...(trending !== undefined && { trending: trending === 'true' || trending === true })
        };
        
        const video = await videoModel.findByIdAndUpdate(
            videoId,
            updateData,
            { new: true }
        );
        
        if (!video) {
            return res.json({ success: false, message: "Video bulunamadı" });
        }
        
        res.json({ success: true, message: "Video güncellendi", video });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    listVideos, 
    addVideo, 
    removeVideo, 
    singleVideo, 
    toggleTrending, 
    listTrendingVideos,
    listUserVideos,
    updateVideo
};