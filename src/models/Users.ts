import { Schema, model } from "mongoose";

const userSchema = new Schema({
    names: {
        type: String,
        required: true,
        trim: true
    },
    surnames: {
        type: String,
        required: true,
        trim: true
    },
    birth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: false
    },
    code: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        required: false,
        default: false
    },
    roles: [{
        ref: "Role",
        type: Schema.Types.ObjectId
    }],
    events: [{
        ref: "Event",
        type: Schema.Types.ObjectId,
        required: false
    }],

    profile: {
        type: String,
        required: false,
        default: ""
    },
}, {
    versionKey: false,
    timestamps: true
})
export default model('User', userSchema)