import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        requires: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);