const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    meeting_code: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;


