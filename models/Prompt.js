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
    tag: {
        type: String,
        required: [true, "Tag is required"],
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true, // Add autopopulate option to populate the 'likes' field automatically
    }],
});

// Apply the autopopulate plugin to automatically populate the 'likes' field
PromptSchema.plugin(require('mongoose-autopopulate'));

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;