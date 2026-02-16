import User from '../Users/user.model.js';

// LOGIN (Iniciar sesión)
export const login = async (req, res) => {
    try {
        const { UserEmail, password } = req.body;

        const user = await User.findOne({ UserEmail });

        if (!user || user.password !== password) {
            return res.status(404).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logueo con Exito.',
            userDetails: {
                id: user._id,
                name: user.UserName,
                email: user.UserEmail,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error',
            error: error.message
        });
    }
};