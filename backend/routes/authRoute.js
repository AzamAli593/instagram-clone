const router = require("express").Router();
const passport = require("passport");
require("../middleware/passport");

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `/api/v1/register/process/s1`,
    failureRedirect: `/login`,
  })
);

router.get("/google/authenticate", passport.authenticate("google", { scope: ["profile", "email"] }));

module.exports = router;
