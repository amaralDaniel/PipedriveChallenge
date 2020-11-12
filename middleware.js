var dbOperations = require("./db_operations");

var selectItemsFromDB = (searchWord, resolve, reject) => {
  let relations = [];

  //first we get the organization we are searching for
  dbOperations.getOrganizationByName(searchWord, (organization) => {
    //when the organization doesn't exist
    if (organization == undefined) {
      reject({error: true, code: 404, message: "Organization not found"});
    } else {
      //then we get the daughters
      dbOperations.getDaughterByName(searchWord, (daughterOrganizations) => {
        if (daughterOrganizations.length == 0) {
          resolve(relations);
        } else {
          daughterOrganizations.forEach((daughter, index) => {
            let parent_id = daughter.parent_id;
            //then we get the sisters
            dbOperations.getDaughterRowsByParentId(
              parent_id,
              searchWord,
              (sisterRows) => {
                sisterRows.forEach((sister) => {
                  //check if the sister already exists in the output 
                  if (!checkIfOrgNameAlreadyExists(relations, sister)) {
                    relations.push({
                      relationship_type: "sister",
                      org_name: sister.org_name,
                    });
                  }
                });

                //then we get the daughters of the organization
                dbOperations.getOrganizationByName(
                  searchWord,
                  (organization) => {
                    dbOperations.getDaughterRowsByParentId(
                      organization.id,
                      searchWord,
                      (daughterRows) => {
                        daughterRows.forEach((daughter) => {
                          //check if the daughter already exists in the output 
                          if (
                            !checkIfOrgNameAlreadyExists(relations, daughter)
                          ) {
                            relations.push({
                              relationship_type: "daughter",
                              org_name: daughter.org_name,
                            });
                          }
                        });

                        //get parents of the organization
                        dbOperations.getOrganizationByID(
                          parent_id,
                          (parentOrganization) => {
                            parentOrganization.forEach((parent) => {
                              if (
                                !checkIfOrgNameAlreadyExists(relations, parent)
                              ) {
                                relations.push({
                                  relationship_type: "parent",
                                  org_name: parent.org_name,
                                });
                              }
                            });

                            //end of the array
                            if (index == daughterOrganizations.length - 1) {
                              //order by organization name
                              orderArrayByName(relations);
                              resolve(relations);
                            }
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          });
        }
      });
    }
  });
};

var insertItemsIntoDB = (body, resolve, reject) => {
  var org_name = body.org_name;

  //insert the main organization name into the db
  dbOperations.insertOrganizationIntoDB(org_name);

  if (Object.prototype.hasOwnProperty.call(body, "daughters")) {
    var daughters = body.daughters;
    //going through each daughter if they exist
    daughters.forEach((singleDaughter, index) => {
      var daughterName = singleDaughter.org_name;
      if (Object.prototype.hasOwnProperty.call(singleDaughter, "daughters")) {
        //get the parent id and inserting the daughter into the daughters table and the organizations table
        dbOperations.getOrganizationByName(org_name, (parent) => {
          dbOperations.insertDaughterIntoDB(singleDaughter.org_name, parent.id);
          insertItemsIntoDB(singleDaughter);
        });
      } else {
        //insert into organization db and then insert daughter
        dbOperations.insertOrganizationIntoDB(daughterName);
        dbOperations.getOrganizationByName(org_name, (parent) => {
          dbOperations.insertDaughterIntoDB(singleDaughter.org_name, parent.id);
        });
      }
      //end of the array
      if (index == daughters.length - 1) {
        resolve("Items were inserted into the DB");
      }
    });
  } else {
    resolve("Items were inserted into the DB");
  }
};

//helper function to sort by name
var orderArrayByName = (array) => {
  array.sort((a, b) => {
    if (a.org_name < b.org_name) {
      return -1;
    } else {
      return 1;
    }
  });
  return array;
};

//helper function to check if the json array already has the element that we want to push
var checkIfOrgNameAlreadyExists = (relations, possibleElement) => {
  return relations.some(
    (element) => element.org_name == possibleElement.org_name
  );
};

module.exports = {
  selectItemsFromDB: selectItemsFromDB,
  insertItemsIntoDB: insertItemsIntoDB,
  orderArrayByName: orderArrayByName,
  checkIfOrgNameAlreadyExists: checkIfOrgNameAlreadyExists
};
