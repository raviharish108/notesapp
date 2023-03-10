import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    owner_id: {
        type: String,
        required: true
    },
    owner_name:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

export default mongoose.model("notes",noteSchema)