import mongoose from 'mongoose';

const {Schema, model} = mongoose;


export const roomSchema = new Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    roomSize:{type:Number, required:true}, //always in m²
    sleeps:{type:Number, min:1, required:true},
    bedSize:{type:String, enum:['SMALL','MEDIUM','LARGE'], default:'SMALL' },
    view: {type: String, enum: ["SEA", "MOUNTAIN", "CITY", "GARDEN"], default: "SEA"},
    price:{type:Number, required:true},
    rating:{type:Number, min:1, max:10}
});