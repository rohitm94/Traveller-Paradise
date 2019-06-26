var user = function(userId, firstname, lastname, emailaddr,password, age, zipcode, country){

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
