import express from "express"
import {create_note,getnotes,getonenote,updatenote,deletenote} from "../controllers/notes.js"
import { verify } from "../middlewares/verify.js";
const router=express.Router();

router.post("/create",verify,create_note);
router.get("/getnotes",verify,getnotes);
router.get("/getonenote/:id",verify,getonenote);
router.put("/updatenote/:id",verify,updatenote);
router.delete("/deletenote/:id",verify,deletenote);
export default router;