const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Check le mot de passe //
exports.signup = (req, res, next) => {
  const password = req.body.password;

  // Vérification de la longueur du mot de passe
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Le mot de passe doit contenir au moins 8 caractères." });
  }

  // Hachage du mot de passe avec un salt de 12 pour plus de sécurité
  bcrypt
    .hash(password, 12)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Sauvegarde de l'utilisateur
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) =>
          res
            .status(400)
            .json({
              error: "Erreur lors de la création de l'utilisateur",
              details: error,
            })
        );
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", details: error })
    );
};

// Check l'identifiant de l'utilisateur //
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }

      // Comparaison du mot de passe
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }

          // Création du token JWT avec un secret depuis les variables d'environnement
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, // Utilisation du secret stocké dans le fichier .env
            { expiresIn: "24h" }
          );

          // Réponse avec le token
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) =>
          res
            .status(500)
            .json({
              error: "Erreur lors de la vérification du mot de passe",
              details: error,
            })
        );
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", details: error })
    );
};
