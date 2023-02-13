import express from "express"
import {sign_up,activate_account,login,forgotPassword,changepassword} from "../controllers/user.js"

const router=express.Router();

router.post("/signup", sign_up);
router.get("/activate",activate_account);
router.post("/login",login);
router.post("/forgot",forgotPassword);
router.post("/changepassword",changepassword);


export default router;