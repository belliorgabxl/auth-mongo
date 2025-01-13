import mongoose, { Schema } from "mongoose";

const wifiSchema = new Schema(
  {
    deviceId:String,
    userId:String,
    name:String,
    topic:String,
    type:String,
    password:String,
    status:String,
    wifiId:String,
    wifiConnect:String
  },
  {
    timestamps: true,
  }
);

const Wifi = mongoose.models.Wifi || mongoose.model("Wifi", wifiSchema);

export default Wifi;