'use strict';

import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    Opinion: {
        type: Schema.Types.ObjectId,
        ref: 'Opinion',
        required: [true, 'La opinion es requerida']
    },
    commentText: {
        type: String,
        required: [true, 'La el texto principal es requerido'],
        maxlength: [200, 'El texto principal no puede tener más de 200 caracteres']
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        requiered: [true, 'El usuario es obligatorio']
    },
    commentStatus: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    commentCreatedAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model("Comment", commentSchema);