import express from 'express';
import Hotel from '../models/hotel.js';

const router = express.Router();

//GET: 
//http://localhost:3000/api/hotels/
router.get('/', async(req, res) => {
    //selecting specific fields of our Hotel using .select()
    const hotels = await Hotel.find()//.select('name description');

    return res.status(200).json(hotels);
})

//BONUS
//GET  //req.query is used for query parameters 
//http://localhost:3000/api/hotels/rooms/search?bedSize=MEDIUM&sleeps=1
//QUERY PARAMETERS: ?paramName=paramValue&paramName=paramValue...
router.get('/rooms/search',async(req, res) => {
    console.log("query items", req.query)
  
                                    //conditions 
    const hotels = await Hotel.find({'rooms.bedSize':req.query.bedSize, 'rooms.sleeps':req.query.sleeps}).select('rooms.$') //select the rooms you found

    return res.status(200).json(hotels);
})

//GET: show the room by ID 
//http://localhost:3000/api/hotels/rooms/byid/63341a256c073fe2d6b41b8d (! example id)
router.get('/rooms/byid/:id', async(req, res) => {
    //find the room with that id inside the array.
    //select specific items within the document
    const room = await Hotel.find({'rooms._id':req.params.id}).select('rooms.$') //positional operator $, show only the room it found in the condition.

    if(!room){
        //we couldn't find a room with that id 
        return res.status(404).json({Message:'Room not found'});
    }
    //we found it! yay! let's return it.
    return res.status(200).json(room);
});

//POST: Create a new hotel
//http://localhost:3000/api/hotels/create
//BODY
// {
// 	"name":"Plaza Hotel",
// 	"description":"Hotel for leisure and business.",
// 	"location":{
// 		"address":"Plazaroad",
// 		"number":"6",
// 		"postalCode":"08016",
// 		"country":"Spain",
// 		"latitude":41.27780646738183,
// 		"longitude":2.0874023437500004
// 	},
// 	"isAvailable":true,
// 	"stars":3
// }
router.post('/create', async (req, res) => {

    try {
      const createdHotel = await Hotel.create({
        name:req.body.name,
        description:req.body.description,
        location:req.body.location,
        isAvailable:req.body.isAvailable,
        stars:req.body.stars
      })

      return res.status(200).json({message:'Hotel created', createdHotel})
        
    } catch (error) {
       return res.status(500).json({message:error.message})
    }
});
//PATCH: patch add a room to a hotel by updating the hotel document
//http://localhost:3000/api/hotels/create-room/633419c16c073fe2d6b41b83
//BODY
// {
// 	"name":"Family room",
// 	"description":"Amazing room with a view",
// 	"roomSize":50,
// 	"sleeps":4,
// 	"bedSize":"MEDIUM",
// 	"view":"CITY",
// 	"price":110,
// 	"rating":9
// }
router.patch('/create-room/:id', async(req, res) => {
     try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id,{
            //array.push, $push will add an object to the array 
            $push:{
                //we would like to push the following object into the rooms array.
                rooms:{
                    name:req.body.name, 
                    description:req.body.description,
                    roomSize:req.body.roomSize,
                    sleeps:req.body.sleeps,
                    bedSize:req.body.bedSize,
                    view:req.body.view,
                    price:req.body.price,
                    rating:req.body.rating
                }
            }
        },{new:true})//new means send the fully updated document

        return res.status(200).json({message:'Room created', updatedHotel})
     } catch (error) {
        return res.status(500).json({message:error.message})
     }
});

//PATCH, update a room by roomID (change the price of the room)
//http://localhost:3000/api/hotels/update-room/633416cf5fe021a951789c6c
//BODY
// {
// 	"price":120
// }
router.patch('/update-room/:id', async(req, res) => {
    try {
        const updatedHotel = await Hotel.findOneAndUpdate({'rooms._id':req.params.id},{
            //setting a specific field to a new value
            $set:{
                //rooms.$ is the room we found using findOne
                'rooms.$.price':req.body.price
            }
        },{new:true})
        //return the updated hotel with the updated room.
        return res.status(200).json({message:'Room updated', updatedHotel})
    } catch (error) {
        return res.status(500).json({message:error.message})
    } 
});


export default router;