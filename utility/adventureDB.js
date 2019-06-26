var Adventure = require('../models/adventure');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/tripbase',{ useNewUrlParser: true },function(err){
  if(err) throw err;
  console.log("Connection to Tripbase established!!");
});


var myadventuresSchema = mongoose.Schema({
  adventureCode:{type:String, required:true, unique: true},
  adventureType:String,
  adventureName:String,
  catalogCategory:String,
  itemDescription:String,
  rating:Number,
  imgUrl:String,
  ownerId:String,
  triedit:Boolean
},{collection:'adventuresData'});

var adventures = mongoose.model('adventuresData', myadventuresSchema);


exports.getAdventure = async function(adventureCode){

  return await adventures.find({'adventureCode':adventureCode});

}

  exports.getAdventures = async function(){
    return await adventures.find();
  };

  exports.getCategories = async function(){
  var categorieslist = [];
  await adventures.find(function(err,data)
  {
    if(err)
    {
      throw err;
    }
    else
    {
      data.forEach(function(adventure)
      {
        if(!categorieslist.includes(adventure.catalogCategory)){
          categorieslist.push(adventure.catalogCategory);
        }
      });
    }
  });
  return categorieslist;
}
