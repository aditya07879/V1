const express = require("express");
const router = express.Router();

const { updateProfile } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/me", authMiddleware, updateProfile);
router.put("/me", authMiddleware, updateProfile);


module.exports = router;
