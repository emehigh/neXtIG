import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const PromptSchema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
    },
    prompt: {
        type: String,
        required: [true, "Prompt is required"],
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true,
    }],
    comments: [{
        userId: {
            type: String,
            ref: "User",
        },
        comment: {
            type: String,
            required: true,
        },
    }],
    referenceTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prompt",
        autopopulate: true,
    },
    creadtedAt: {
        type: Date,
        default: Date.now,
    },
    
});

PromptSchema.plugin(require('mongoose-autopopulate'));

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
