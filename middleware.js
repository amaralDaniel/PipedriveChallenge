var dbOperations = require("./db_operations");

var selectItemsFromDB = (searchWord, resolve, reject) => {
  let relations = [];

  dbOperations.getOrganizationByName(searchWord, (organization) => {
    if (organization == undefined) {
      throw new Error(404);
    } else {
      dbOperations.getDaughterByName(searchWord, (daughterOrganizations) => {
        daughterOrganizations.forEach((daughter, index) => {
          let parent_id = daughter.parent_id;
    
          dbOperations.getDaughterRowsByParentId(
            parent_id,
            searchWord,
            (sisterRows) => {
              sisterRows.forEach((sister) => {
                if (!checkIfOrgNameAlreadyExists(relations, sister)) {
                  relations.push({
                    relationship_type: "sister",
                    org_name: sister.org_name,
                  });
                }
              });
    
              dbOperations.getOrganizationByName(searchWord, (organization) => {
                dbOperations.getDaughterRowsByParentId(
                  organization.id,
                  searchWord,
                  (daughterRows) => {
                    daughterRows.forEach((daughter) => {
                      if (!checkIfOrgNameAlreadyExists(relations, daughter)) {
                        relations.push({
                          relationship_type: "daughter",
                          org_name: daughter.org_name,
                        });
                      }
                    });
    
                    dbOperations.getOrganizationByID(
                      parent_id,
                      (parentOrganization) => {
                        parentOrganization.forEach((parent) => {
                          if (!checkIfOrgNameAlreadyExists(relations, parent)) {
                            relations.push({
                              relationship_type: "parent",
                              org_name: parent.org_name,
                            });
                          }
                        });
    
                        if (index == daughterOrganizations.length - 1) {
                          orderArrayByName(relations);
                          resolve(relations);
                        }
                      }
                    );
                  }
                );
              });
            }
          );
        });
      });
    }
  })

  
};

var insertItemsIntoDB = (body, resolve, reject) => {
  var org_name = body.org_name;

  //insert the main organization name into the db
  dbOperations.insertOrganizationIntoDB(org_name);

  if (Object.prototype.hasOwnProperty.call(body, "daughters")) {
    var daughters = body.daughters;

    daughters.forEach((singleDaughter, index) => {
      var daughterName = singleDaughter.org_name;
      if (Object.prototype.hasOwnProperty.call(singleDaughter, "daughters")) {
        dbOperations.getOrganizationByName(org_name, (parent) => {
          dbOperations.insertDaughterIntoDB(singleDaughter.org_name, parent.id);
          insertItemsIntoDB(singleDaughter);
        });
      } else {
        dbOperations.insertOrganizationIntoDB(daughterName);
        dbOperations.getOrganizationByName(org_name, (parent) => {
          dbOperations.insertDaughterIntoDB(singleDaughter.org_name, parent.id);
        });
      }
      if(index == daughters.length -1){
        resolve("Items were inserted into the DB");
      }
    });
  }
};

var orderArrayByName = (array) => {
  array.sort((a, b) => {
    if (a.org_name < b.org_name) {
      return -1;
    } else {
      return 1;
    }
  });
};

var checkIfOrgNameAlreadyExists = (relations, possibleElement) => {
  return relations.some(
    (element) => element.org_name == possibleElement.org_name
  );
};

module.exports = {
  selectItemsFromDB: selectItemsFromDB,
  insertItemsIntoDB: insertItemsIntoDB,
};
