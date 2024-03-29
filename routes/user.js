import express from "express"
import {sign_up,activate_account,login,forgotPassword,changepassword,verify,changepassword_verify} from "../controllers/user.js"

const router=express.Router();

router.post("/signup", sign_up);
router.post("/activate",activate_account);
router.post("/login",login);
router.post("/forgot",forgotPassword);
router.post("/changepassword",changepassword);
router.get("/verify",verify);
router.get("/changepasswordverify",changepassword_verify);

export default router;