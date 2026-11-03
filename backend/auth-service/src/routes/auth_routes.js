const express = require("express");
const passport = require("passport");
const env = require("../../config/env");

const router = express.Router();

/**
 * GET /google
 * Avvia il flusso OAuth con Google (scope: profilo ed email).
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * GET /google/callback
 * Callback di Google OAuth.
 * In caso di successo, codifica i dati utente in base64 e reindirizza alla home del gateway
 * passando il payload come query param ?session=<base64>.
 * In caso di errore, reindirizza alla pagina di login del gateway.
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: `${env.GATEWAY_URL}/api/v1/login` }),
    (req, res) => {
        const payload = Buffer.from(JSON.stringify({
            displayName: req.user.displayName,
            email: req.user.email
        })).toString("base64");

        res.redirect(`${env.GATEWAY_URL}/api/v1/?session=${payload}`);
    }
);

module.exports = router;
