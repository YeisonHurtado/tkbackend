import exp from 'constants';
import {Schema, model} from 'mongoose'
import config from '../config';

const eventSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    }, 
    lineup: {
        type: Array,
        required: false
    },
    date: {
        type: Date,
        required: false
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

// eventSchema.methods.setPoster = function (filename: String) {
//     const urlPoster = `${config.MONGO_HOST}:${config.MONGO_PORT}/images/${filename}`
//     this.poster = urlPoster
// }

export default model('Event', eventSchema);