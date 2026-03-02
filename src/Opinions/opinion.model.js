'use strict';

import mongoose, { Schema } from "mongoose";

const opinionSchema = new mongoose.Schema({
    OpinionTitle: {
        type: String,
        required: [true, 'El titulo es requerido'],
        maxlength: [200, 'El titulo no puede tener más de 200 caracteres']
    },
    OpinionCategory: {
        type: String,
        required: [true, 'La categoria es requerida'],
        maxlength: [100, 'El categoria no puede tener más de 100 caracteres']
    },
    OpinionText: {
        type: String,
        required: [true, 'La el texto principal es requerido'],
        maxlength: [200, 'El texto principal no puede tener más de 200 caracteres']
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    OpinionStatus: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    OpinionCreatedAt: {
        type: Date,
        default: Date.now
    }
});

opinionSchema.index({ OpinionTitle: 1 });

export default mongoose.model("Opinion", opinionSchema);