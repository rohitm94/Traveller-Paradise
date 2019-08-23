var UserAdventure = function(adventure,rating,triedit){
//Intialization of UserAdventure Model
  userAdventureModel = {
    adventure : adventure,
    rating : rating,
    triedit: triedit
  }
  return userAdventureModel;
}

//Setters for user adventure
UserAdventure.prototype.setAdventure = function(adventure){
  this.adventure = adventure;
}
UserAdventure.prototype.setRating = function(rating){
  this.rating = rating;
}
UserAdventure.prototype.setstatus = function(triedit){
  this.triedit = triedit;
}

//Getters for user adventure
UserAdventure.prototype.getAdventure = function(){
  return this.adventure;
}
UserAdventure.prototype.getRating = function(){
  return this.rating;
}
UserAdventure.prototype.getstatus = function(){
  return this.triedit;
}


module.exports.UserAdventure = UserAdventure;
