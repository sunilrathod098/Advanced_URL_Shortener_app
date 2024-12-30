import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    customAlias: {
        type: String,
        unique: true
    },
    topic: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const Url = mongoose.model("Url", urlSchema);