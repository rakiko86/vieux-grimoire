const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

const jwt = require('jsonwebtoken');
exports.signup = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

  exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, // Il est préférable d'utiliser une variable d'environnement pour la clé
            { expiresIn: '24h' }
        );
        res.status(200).json({
            userId: user._id,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};