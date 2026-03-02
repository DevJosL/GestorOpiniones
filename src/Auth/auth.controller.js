import User from '../Users/user.model.js';
import jwt from 'jsonwebtoken';

// REGISTER (Crear cuenta)
export const register = async (req, res) => {
    try {
        const data = req.body;
        const user = new User(data);

        await user.save();

        // Generar token de acceso
        const token = await generateJWT(user._id, user.UserEmail, user.role);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente.',
            token  // Se manda el token directamente
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// LOGIN (Iniciar sesión)
export const login = async (req, res) => {
    try {
        let { UserEmail, password } = req.body;

        if (!UserEmail || !password) {
            return res.status(400).json({ success: false, message: 'Faltan credenciales' });
        }

        UserEmail = UserEmail.trim().toLowerCase();

        const user = await User.findOne({ UserEmail });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = generateJWT(user._id, user.UserEmail, user.role);

        return res.status(200).json({
            success: true,
            token,
            userDetails: user.toJSON()
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

export const generateJWT = (userId, userEmail, role) => {
    return jwt.sign(
        { userId, userEmail, role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' } // El token expirará en 1 hora
    );
};