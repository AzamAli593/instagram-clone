const { mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema({
  content: { type: String, required: true },
  reference: { type: String, required: true },
  timeStamp: { type: Number },
});

module.exports = mongoose.model("Notifications", notificationSchema);
