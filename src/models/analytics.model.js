import mongoose, { Schema } from "mongoose";


const AnalyticsSchema = new Schema({
    shortUrl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
        required: true
    },
    totalClicks: {
        type: Number,
        default: 0
    },
    uniqueUsers: {
        type: [String],
        default: []
    },
    clicksByDate: [{
        date: {
            type: Date,
            required: true
        },
        clickCount: {
            type: Number,
            default: 0
        }
    }],
    osType: [{
        osName: {
            type: String,
            required: true
        },
        uniqueClicks: {
            type: Number,
            default: 0
        },
        uniqueUsers: {
            type: Number,
            default: 0
        }
    }],
    deviceType: [{
        deviceName: {
            type: String,
            required: true
        },
        uniqueClicks: {
            type: Number,
            default: 0
        },
        uniqueUsers: {
            type: Number,
            default: 0
        }
    }],
    topic: {
        type: String,
        default: null
    },
    userAgentData: [{
        os: String,
        device: String,
        ipAddress: String,
        browser: String
    }]
}, { timestamps: true });


export const Analytics = mongoose.model("Analytics", AnalyticsSchema);