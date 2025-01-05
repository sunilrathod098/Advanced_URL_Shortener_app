import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//this are the middleware functions save before user run
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next()

    //this method is user for encrypt (into a hash code un-readable message type) the password
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//this method is user for decrypt (into a hash code readable password type) the password
userSchema.methods.isPasswordCorrect = async function (password) {

    if (!password || !this.password) {
        throw new Error("Password or hash is missing");
    }
    return await bcrypt.compare(password, this.password)
}

//GENERATE ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

//refreshToken
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

export const User = mongoose.model("User", userSchema);