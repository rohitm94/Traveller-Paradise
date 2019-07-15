var userProfileModel = require('../models/userProfile');
var mongoose = require('mongoose');

mongoose.connect('<Enter Mongodb connection link>',{ useNewUrlParser: true },function(err){
  if(err) throw err;
});

var myuserSchema = mongoose.Schema({
  userId : {type:String, required:true, unique: true},
  firstName : String,
  lastName : String,
  emailaddr : String,
  password: String,
  age: Number,
  zipcode: Number,
  country: String
},{collection:'userData'});

var user = mongoose.model('userData',myuserSchema);

var myuseradventureSchema = mongoose.Schema({
  userId:{type:String, required:true},
  adventure : {
    adventureCode:{type:String, required:true},
    adventureType:String,
    adventureName:String,
    catalogCategory:String,
    itemDescription:String,
    rating:Number,
    imgUrl:String,
    ownerId:String,
    triedit:Boolean
  },
  rating : Number,
  triedit : Boolean
},{collection:'userAdventureData'});

var userAdventure = mongoose.model('userAdventureData',myuseradventureSchema);


exports.getUsers = async function(){
  var usr=null;
  await user.find(function(err, data){
    if(err) {
      throw err;
    }
    else{
      usr = data[0];
    }
  });
  return usr;
}


exports.getUser = async function(id){
  var usr=null;
  await user.find({'userId':id},function(err, data){
    if(err) {
      throw err;
    }
    else{
      usr = data;
    }
  });
  return usr;
}

exports.getUserbyUsername = async function(id, pword){
  var msg =null;
  await user.find({'userId':id,'password':pword},function(err,data){
    if(err){
      msg = 0;
    }
    else{
      if(data.length != 0 && data.length != null ){
        console.log(data.length);
        msg = 1;
      }
      else{
        msg = 0;
      }
    }
  });
  return msg;
}

exports.getUserProfile =async function(userId){

  if(userAdventure){
      return new userProfileModel(userId, await userAdventure.find({"userId": userId}));

  }
}

exports.addAdventure = async function(userId, newadventure){
  if(userAdventure){
    var item = new userAdventure({
      'userId' : userId,
      'adventure' : {
        'adventureCode':newadventure.adventure[0].adventureCode,
        'adventureType':newadventure.adventure[0].adventureType,
        'adventureName':newadventure.adventure[0].adventureName,
        'catalogCategory':newadventure.adventure[0].catalogCategory,
        'itemDescription':newadventure.adventure[0].itemDescription,
        'rating':newadventure.adventure[0].rating,
        'imgUrl':newadventure.adventure[0].imgUrl,
        'ownerId':newadventure.adventure[0].ownerId,
        'triedit':newadventure.adventure[0].triedit
      },
      'rating' : newadventure.adventure[0].rating,
      'triedit' : newadventure.adventure[0].triedit
    });
    await item.save(function(err){
      if(err) console.log(err);
    });
  }
}

exports.updateAdventurerating = async function(userId, newadventure){
  if(userAdventure){
    await userAdventure.update({'userId':userId, 'adventure.adventureCode':newadventure.adventure[0].adventureCode},{'rating' :newadventure.rating},function(err,data){
      if(err) console.log(err);
    });
  }
}

exports.updateAdventuretriedflag = async function(userId, newadventure){
  if(userAdventure){
    await userAdventure.update({'userId':userId, 'adventure.adventureCode':newadventure.adventure[0].adventureCode},{'triedit' :newadventure.triedit},function(err,data){
      if(err) console.log(err);
    });
  }
}


exports.removeAdventure = async function(userId,adventureCode){
  if(userAdventure){
    var item =await userAdventure.find({'userId':userId, 'adventure.adventureCode':adventureCode}).remove();
  }
}
