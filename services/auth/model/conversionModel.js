import mongoose from "mongoose";

const conversionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalTokens: {
        type: Number,
        required: true
    },
    optimizedTokens: {
        type: Number,
        required: true
    },
    savingsPercent: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const conversionModel = mongoose.model("Conversion", conversionSchema);

export default conversionModel;
