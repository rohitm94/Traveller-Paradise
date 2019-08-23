// Created a function and exported the same.
var adventure = function(adventureCode, adventureType,adventureName, catalogCategory,
  itemDescription, rating, imageURL,ownerId, Triedit){

  // Initialization of Adventure model
  AdventureModel ={
    adventureCode:adventureCode,
    adventureType:adventureType,
    adventureName:adventureName,
    catalogCategory:catalogCategory,
    itemDescription:itemDescription,
    rating:rating,
    imageURL:imageURL,
    ownerId: ownerId,
    Triedit:Triedit

  };
  return AdventureModel;
}

module.exports.adventure = adventure;
