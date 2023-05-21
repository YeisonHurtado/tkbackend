import exp from 'constants';
import {Schema, model} from 'mongoose'

const eventSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    }, 
    lineup: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    poster: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model('Event', eventSchema);