var userProfile = function(userId, listadventures){

    this.userid = userId;
    this.listadventures = listadventures;


    this.addItem= function(userItem){
      this.listadventures.push(userItem);
    };

    this.removeUserItem=function(adventureCode){
       for( var i=0;i<this.listadventures.length;i++){
          if(this.listadventures[i].adventure.adventureCode == adventureCode){
            this.listadventures.splice(i,1);
            break;
          }
       }
    };


    this.updateRating=function(rating,adventureCode){
       for (var i=0;i<this.listadventures.length;i++){
         if(this.listadventures[i].adventure.adventureCode == adventureCode){
           this.listadventures[i].rating = rating;
           this.listadventures[i].adventure._rating = rating;
         }
       }
    }

    this.updateMadeIt=function(triedit,adventureCode){
       for (var i=0;i<this.listadventures.length;i++){
         if(this.listadventures[i].adventure.adventureCode == adventureCode){
           this.listadventures[i].triedit = triedit;
         }
       }
    }



    this.getItems=function(){
      return this.listadventures;
    }

    this.emptyProfile=function(){
       delete this.userId;
       delete this.listadventures;
     }
   };


  module.exports = userProfile;
