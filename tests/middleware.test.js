var {orderArrayByName} = require("../middleware");
var {checkIfOrgNameAlreadyExists} = require("../middleware");

let arrayToOrderByName = [ { relationship_type: 'sister', org_name: 'Yellow Banana' },
{ relationship_type: 'sister', org_name: 'Brown Banana' },
{ relationship_type: 'daughter', org_name: 'Phoneutria Spider' },
{ relationship_type: 'daughter', org_name: 'Tiger' },
{ relationship_type: 'parent', org_name: 'Banana tree' },
{ relationship_type: 'sister', org_name: 'Green Banana' },
{ relationship_type: 'parent', org_name: 'Big banana tree' } ];

let expectedOrderedArray = [ { relationship_type: 'parent', org_name: 'Banana tree' },
{ relationship_type: 'parent', org_name: 'Big banana tree' },
{ relationship_type: 'sister', org_name: 'Brown Banana' },
{ relationship_type: 'sister', org_name: 'Green Banana' },
{ relationship_type: 'daughter', org_name: 'Phoneutria Spider' },
{ relationship_type: 'daughter', org_name: 'Tiger' },
{ relationship_type: 'sister', org_name: 'Yellow Banana' } ];

test("orderArrayByName test", () => {
    orderArrayByName(arrayToOrderByName);
    expect(arrayToOrderByName).toEqual(expectedOrderedArray);
});

let relations = [ { relationship_type: 'sister', org_name: 'Yellow Banana' },
{ relationship_type: 'sister', org_name: 'Brown Banana' },
{ relationship_type: 'daughter', org_name: 'Phoneutria Spider' },
{ relationship_type: 'daughter', org_name: 'Tiger' },
{ relationship_type: 'parent', org_name: 'Banana tree' },
{ relationship_type: 'sister', org_name: 'Green Banana' } ];
let daughter = { id: 46, parent_id: 131, org_name: 'Tiger' };
let daughterFalse = { id: 46, parent_id: 131, org_name: 'Dog' };

test("checkIfOrgNameAlreadyExists test true", () => {
    expect(checkIfOrgNameAlreadyExists(relations, daughter)).toBe(true);
});

test("checkIfOrgNameAlreadyExists test false", () => {
    expect(checkIfOrgNameAlreadyExists(relations, daughterFalse)).toBe(false);
});