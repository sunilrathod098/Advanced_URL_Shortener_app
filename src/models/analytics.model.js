import mongoose, { Schema } from "mongoose";

const AnalyticsSchema = new Schema({
    shortUrl: {
        type: String,
        required: true
    },
    clickCount: {
        type: Number,
        default: 0
    },
    userAgentData: [{
        os: String,
        device: String,
        ipAddress: String,
        browser: String,
    }]
}, {timestamps: true});


export const Analytics = mongoose.model("Analytics", AnalyticsSchema);