import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOTP: {type: String, default: null},
    verifyOTPExpire: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOTP: {type: String, default: null},
    resetOTPExpire: {type: Number, default: 0},
    totalTokensSaved: {type: Number, default: 0},
    totalConversions: {type: Number, default: 0},
    avatar: {type: String, default: 'rat_default'},
    ratRank: {type: String, default: 'Rookie Rat'},
    bio: {type: String, default: ''},
    github: {type: String, default: ''},
    linkedin: {type: String, default: ''}
})

const userModel = mongoose.model("user", userSchema);

export default userModel;
