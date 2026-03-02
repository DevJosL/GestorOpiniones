import Opinion from './opinion.model.js';
import User from '../Users/user.model.js';
import mongoose from "mongoose";

const isOwner = (opinionUserId, loggedUserId) =>
    String(opinionUserId) === String(loggedUserId);

export const getOpinions = async (req, res) => {
    try {
        const { page = 1, limit = 10, OpinionCategory, OpinionStatus } = req.query;

        const filter = {};
        if (OpinionCategory) {
            filter.OpinionCategory = OpinionCategory;
        }
        if (OpinionStatus) {
            filter.OpinionStatus = OpinionStatus;
        }

        const opinions = await Opinion.find(filter)
            .populate('User', 'UserName')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ OpinionCreatedAt: -1 });

        const total = await Opinion.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: opinions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las opiniones',
            error: error.message,
        });
    }
};

export const getOpinionById = async (req, res) => {
    try {
        const { id } = req.params;

        const opinion = await Opinion.findById(id).populate('User', 'UserName');

        if (!opinion) {
            return res.status(404).json({
                success: false,
                message: 'Opinión no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            data: opinion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la opinión',
            error: error.message,
        });
    }
};

export const createOpinion = async (req, res) => {
    try {
        const { OpinionTitle, OpinionCategory, OpinionText } = req.body;

        const userId = req.user.userId; // <- sale del token

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const opinion = new Opinion({
            OpinionTitle,
            OpinionCategory,
            OpinionText,
            User: userId,
        });

        await opinion.save();

        return res.status(201).json({
            success: true,
            message: 'Opinión creada exitosamente',
            data: opinion,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error al crear la opinión',
            error: error.message,
        });
    }
};

export const updateOpinion = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedUserId = req.user.userId;

        const opinion = await Opinion.findById(id);
        if (!opinion || opinion.deletedAt) {
            return res.status(404).json({ success: false, message: "Opinión no encontrada" });
        }

        if (!isOwner(opinion.User, loggedUserId)) {
            return res.status(403).json({ success: false, message: "No puedes editar opiniones de otros usuarios" });
        }

        // Evita que te cambien el User desde el body
        const { User, deletedAt, OpinionStatus, ...safeBody } = req.body;

        const updated = await Opinion.findByIdAndUpdate(id, safeBody, {
            new: true,
            runValidators: true,
        }).populate("User", "UserName");

        return res.status(200).json({
            success: true,
            message: "Opinión actualizada exitosamente",
            data: updated,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Error al actualizar la opinión", error: error.message });
    }
};

export const changeOpinionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUserId = req.user.userId;

    const opinion = await Opinion.findById(id);
    if (!opinion || opinion.deletedAt) {
      return res.status(404).json({ success: false, message: "Opinión no encontrada" });
    }

    if (!isOwner(opinion.User, loggedUserId)) {
      return res.status(403).json({ success: false, message: "No puedes cambiar el estado de opiniones de otros usuarios" });
    }

    opinion.OpinionStatus = opinion.OpinionStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await opinion.save();

    return res.status(200).json({
      success: true,
      message: `Opinión ${opinion.OpinionStatus === "ACTIVE" ? "activada" : "desactivada"} exitosamente`,
      data: opinion,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al cambiar el estado", error: error.message });
  }
};
