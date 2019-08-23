var user = function(userId, firstname, lastname, emailaddr,password, age, zipcode, country){
//Intialization of User Model
  userModel = {
    userId : userId,
    firstName : firstName,
    lastName : lastName,
    emailaddr : emailaddr,
    password:password,
    age: age,
    zipcode:zipcode,
    country:country
  }
  return userModel;
}

module.exports.user = user;
