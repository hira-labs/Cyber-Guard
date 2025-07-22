import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Email of the user to uniquely identify accounts
  accountName: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
