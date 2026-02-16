import Comment from '../Comments/comment.model.js';
import Opinion from '../Opinions/opinion.model.js';
import User from '../Users/user.model.js';

export const getComments = async (req, res) => {
    try {
        const { page = 1, limit = 10, commentStatus } = req.query;

        const filter = {};
        if (commentStatus) {
            filter.commentStatus = commentStatus;
        }

        const comments = await Comment.find(filter)
            .populate('User', 'UserName')
            .populate('Opinion', 'OpinionTitle')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ commentCreatedAt: -1 });

        const total = await Comment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: comments,
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
            message: 'Error al obtener los comentarios',
            error: error.message,
        });
    }
};


export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id)
            .populate('User', 'UserName')
            .populate('Opinion', 'OpinionTitle');

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el comentario',
            error: error.message,
        });
    }
};

export const createComment = async (req, res) => {
    try {
        const { commentText, opinionId } = req.body;

        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        const opinion = await Opinion.findById(opinionId);
        if (!opinion) {
            return res.status(404).json({
                success: false,
                message: 'Opinión no encontrada',
            });
        }

        const comment = new Comment({
            commentText,
            Opinion: opinionId,
            User: userId,
        });

        await comment.save();

        res.status(201).json({
            success: true,
            message: 'Comentario creado exitosamente',
            data: comment,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el comentario',
            error: error.message,
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('User', 'UserName')
            .populate('Opinion', 'OpinionTitle');

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado exitosamente',
            data: comment,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el comentario',
            error: error.message,
        });
    }
};

export const changeCommentStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado',
            });
        }

        comment.commentStatus =
            comment.commentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        await comment.save();

        res.status(200).json({
            success: true,
            message: `Comentario ${comment.commentStatus === 'ACTIVE' ? 'activado' : 'desactivado'} exitosamente`,
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado del comentario',
            error: error.message,
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el comentario',
            error: error.message,
        });
    }
};
