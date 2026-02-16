import Opinion from './opinion.model.js';
import User from './opinion.model.js';

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

        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        const opinion = new Opinion({
            OpinionTitle,
            OpinionCategory,
            OpinionText,
            User: userId,
        });

        await opinion.save();

        res.status(201).json({
            success: true,
            message: 'Opinión creada exitosamente',
            data: opinion,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear la opinión',
            error: error.message,
        });
    }
};

export const updateOpinion = async (req, res) => {
    try {
        const { id } = req.params;

        const opinion = await Opinion.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).populate('User', 'UserName');

        if (!opinion) {
            return res.status(404).json({
                success: false,
                message: 'Opinión no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Opinión actualizada exitosamente',
            data: opinion,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la opinión',
            error: error.message,
        });
    }
};

export const changeOpinionStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const opinion = await Opinion.findById(id);

        if (!opinion) {
            return res.status(404).json({
                success: false,
                message: 'Opinión no encontrada',
            });
        }

        opinion.OpinionStatus =
            opinion.OpinionStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        await opinion.save();

        res.status(200).json({
            success: true,
            message: `Opinión ${opinion.OpinionStatus === 'ACTIVE' ? 'activada' : 'desactivada'} exitosamente`,
            data: opinion,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado de la opinión',
            error: error.message,
        });
    }
};

export const deleteOpinion = async (req, res) => {
    try {
        const { id } = req.params;

        const opinion = await Opinion.findByIdAndDelete(id);

        if (!opinion) {
            return res.status(404).json({
                success: false,
                message: 'Opinión no encontrada',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Opinión eliminada exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la opinión',
            error: error.message,
        });
    }
};
