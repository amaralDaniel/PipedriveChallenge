var dbOperations = require("./db_operations");

var selectItemsFromDB = () => {
  return "selectItemsFromDB";
};

var insertItemsIntoDB = (body) => {
  var org_name = body.org_name;

  //insert the main organization name into the db
  dbOperations.insertOrganizationIntoDB(org_name);

  if (Object.prototype.hasOwnProperty.call(body, "daughters")) {
    var daughters = body.daughters;

    daughters.forEach((singleDaughter) => {
      var daughterName = singleDaughter.org_name;
      if (Object.prototype.hasOwnProperty.call(singleDaughter, "daughters")) {
        dbOperations.getOrganizationByName(org_name, (parent) => {
          
          dbOperations.insertDaughterIntoDB(
            singleDaughter.org_name,
            parent.id
          );
          insertItemsIntoDB(singleDaughter);
        });
      } else {
        dbOperations.insertOrganizationIntoDB(daughterName);
        dbOperations.getOrganizationByName(org_name, (parent) => {
          
            dbOperations.insertDaughterIntoDB(
              singleDaughter.org_name,
              parent.id
            );
          });
      }
    });
  }

  return "InsertItemsIntoDB";
};

module.exports = {
  selectItemsFromDB: selectItemsFromDB,
  insertItemsIntoDB: insertItemsIntoDB,
};
