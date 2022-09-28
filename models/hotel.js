import mongoose from 'mongoose';
import { roomSchema } from './room.js';

const {Schema, model} = mongoose;

const hotelSchema = new Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    location:{
        address:String,
        number:String,
        postalCode:String,
        country:String, 
        latitude:Number, //coordinates on the map 
        longitude:Number
    },
    isAvailable:{type:Boolean, required:true},
    stars:{type:Number, min:1, max:5, default:1 },
    //array of rooms inside the hotel
    rooms:[roomSchema]
})

const Hotel = model('Hotel', hotelSchema);

export default Hotel;