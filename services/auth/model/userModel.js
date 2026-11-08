import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    totalTokensSaved: {type: Number, default: 0},
    totalConversions: {type: Number, default: 0},
    avatar: {type: String, default: 'rat_default'},
    ratRank: {type: String, default: 'Rookie Rat'},
    bio: {type: String, default: ''},
    github: {type: String, default: ''},
    linkedin: {type: String, default: ''},
    openRouterApiKey: {type: String, default: null}
})

const userModel = mongoose.model("user", userSchema);

export default userModel;
