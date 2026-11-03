/**
 * navbar.js
 *
 * Responsabilità:
 * 1. Intercetta il token di sessione nell'URL (presente solo subito dopo il redirect OAuth).
 *    Lo salva nel sessionStorage e ripulisce l'URL.
 * 2. Carica il componente navbar.html nel contenitore #navbar della pagina corrente.
 * 3. Se esiste un utente in sessionStorage, mostra il messaggio di benvenuto e il
 *    pulsante di logout; nasconde i link Login e Signup.
 * 4. Il logout svuota il sessionStorage e reindirizza alla pagina di login.
 */

(function () {

    // --- 1. Legge il token di sessione dall'URL (solo dopo il redirect OAuth) ---
    var params = new URLSearchParams(window.location.search);
    var sessionParam = params.get("session");
    if (sessionParam) {
        sessionStorage.setItem("authUser", sessionParam);
        // Rimuove il parametro dall'URL senza ricaricare la pagina
        window.history.replaceState({}, "", window.location.pathname);
    }

    // --- 2. Carica il componente navbar ---
    fetch("/api/v1/components/navbar.html")
        .then(function (res) { return res.text(); })
        .then(function (html) {
            var container = document.getElementById("navbar");
            if (container) container.innerHTML = html;

            // --- 3. Aggiorna la navbar in base allo stato di autenticazione ---
            var stored = sessionStorage.getItem("authUser");
            if (!stored) return;

            try {
                var user = JSON.parse(atob(stored));

                var navUser    = document.getElementById("nav-user");
                var navWelcome = document.getElementById("nav-welcome");
                var navLogin   = document.getElementById("nav-login");
                var navSignup  = document.getElementById("nav-signup");
                var logoutBtn  = document.getElementById("btn-logout");

                if (navWelcome) navWelcome.textContent = "Benvenuto, " + user.displayName + "!";
                if (navUser)   navUser.classList.add("nav-user--visible");
                if (navLogin)  navLogin.style.display = "none";
                if (navSignup) navSignup.style.display = "none";

                // --- 4. Gestione logout ---
                if (logoutBtn) {
                    logoutBtn.addEventListener("click", function () {
                        sessionStorage.removeItem("authUser");
                        window.location.href = "/api/v1/login";
                    });
                }

            } catch (e) {
                // Token corrotto: lo rimuove silenziosamente
                sessionStorage.removeItem("authUser");
            }
        })
        .catch(function (err) {
            console.error("[navbar.js] Errore durante il caricamento della navbar:", err);
        });

})();
