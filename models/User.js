import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({ 
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        match: [/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/, 'Invalid username']
    },
    image: {
        type: String,
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    friend_requests: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const User = models.User || model('User', UserSchema);

export default User;
