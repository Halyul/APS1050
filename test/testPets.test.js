const Pets = artifacts.require("Pets");

contract("Pets", (accounts) => {
    let pets;
    let expectedPetId;

    before(async () => {
        pets = await Pets.deployed();
    });

    describe("check totoal addopted pets", async () => {
        it("can fetch the addopted pet list", async () => {
            const petnum = await pets.trackPet();
            assert.equal(petnum, 0, "Zero pets should have been addopted");
        });
    });

    describe("checking customer repeat detection", async () => {
        it("can fetch the served customer list", async () => {
            const custnum = await pets.trackCust();
            assert.equal(custnum, 0, "No customer served");
        });

    });

    describe("Up vote a pet with no adopter", async () => {
        before("up vote a pet using accounts[0]", async () => {
            await pets.upVote(8, { from: accounts[0] });
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(0);
            assert.equal(pet.adopter, "0x0000000000000000000000000000000000000000", "The adopter should be 0x0000000000000000000000000000000000000000");
        });
        it("can fetch the new upped vote", async () => {
            const pet = await pets.pets(0);
            assert.equal(pet.votes, "1", "The vote should be 1");
        });
    });

    describe("Down vote a pet with no adopter", async () => {
        before("down vote a pet using accounts[0]", async () => {
            await pets.downVote(8, { from: accounts[0] });
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(0);
            assert.equal(pet.adopter, "0x0000000000000000000000000000000000000000", "The adopter should be 0x0000000000000000000000000000000000000000");
        });
        it("can fetch the new downed vote", async () => {
            const pet = await pets.pets(0);
            assert.equal(pet.votes, "0", "The vote should be 0");
        });
    });

    describe("Adopt a pet with votes", async () => {
        before("up vote a pet using accounts[0]", async () => {
            await pets.upVote(8, { from: accounts[0] });
            await pets.adopt(8, { from: accounts[0] });
            expectedAdopter = accounts[0];
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(0);
            assert.equal(pet.adopter, expectedAdopter, `The adopter should be ${expectedAdopter}`);
        });
        it("can fetch the upped vote", async () => {
            const pet = await pets.pets(0);
            assert.equal(pet.votes, "1", "The vote should be 1");
        });
    });

    describe("Adopt a pet without votes", async () => {
        before("up vote a pet using accounts[0]", async () => {
            await pets.adopt(9, { from: accounts[0] });
            expectedAdopter = accounts[0];
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(1);
            assert.equal(pet.adopter, expectedAdopter, `The adopter should be ${expectedAdopter}`);
        });
        it("can fetch the upped vote", async () => {
            const pet = await pets.pets(1);
            assert.equal(pet.votes, "0", "The vote should be 0");
        });
    });

    describe("Up vote a pet with adopter", async () => {
        before("up vote a pet using accounts[0]", async () => {
            await pets.upVote(9, { from: accounts[0] });
            expectedAdopter = accounts[0];
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(1);
            assert.equal(pet.adopter, expectedAdopter, `The adopter should be ${expectedAdopter}`);
        });
        it("can fetch the new upped vote", async () => {
            const pet = await pets.pets(1);
            assert.equal(pet.votes, "1", "The vote should be 1");
        });
    });

    describe("Down vote a pet with adopter", async () => {
        before("down vote a pet using accounts[0]", async () => {
            await pets.downVote(9, { from: accounts[0] });
            expectedAdopter = accounts[0];
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(1);
            assert.equal(pet.adopter, expectedAdopter, `The adopter should be ${expectedAdopter}`);
        });
        it("can fetch the new downed vote", async () => {
            const pet = await pets.pets(1);
            assert.equal(pet.votes, "0", "The vote should be 0");
        });
    });

    describe("Up vote a pet with no adopter and no votes", async () => {
        before("up vote a pet using accounts[0]", async () => {
            await pets.upVote(0, { from: accounts[0] });
            expectedAdopter = accounts[0];
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(2);
            assert.equal(pet.adopter, "0x0000000000000000000000000000000000000000", "The adopter should be 0x0000000000000000000000000000000000000000");
        });
        it("can fetch the new upped vote", async () => {
            const pet = await pets.pets(2);
            assert.equal(pet.votes, "1", "The vote should be 1");
        });
    });





    // -------------------------------------------
    describe("Return a pet", async () => {
        before("Adopt a pet", async () => {
            await pets.adopt(1, { from: accounts[0] });
            expectedAdopter = accounts[0];
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(3);
            assert.equal(pet.adopter, expectedAdopter, `The adopter should be ${expectedAdopter}`);
        });
        before("Return an adopted pet", async () => {
	    await pets.returnPet(1, { from: accounts[0] });
            expectedAdopter = 0x0;
        });
        it("can fetch the owner", async () => {
            const pet = await pets.pets(3);
            assert.equal(pet.adopter, expectedAdopter, `The adopter should be ${expectedAdopter}`);
        });
    });

    describe("Get all pets", async () => {
        it("can fetch the pet ids", async () => {
            const pet = await pets.getPets();
            assert.equal(pet[0].id, "8", "The first pet in the array should be id:8");
            assert.equal(pet[1].id, "9", "The second pet in the array should be id:9");
            assert.equal(pet[2].id, "0", "The third pet in the array should be id:0");
            assert.equal(pet[3].id, "1", "The fourth pet in the array should be id:0");
	    
        });
        it("can fetch the pet votes", async () => {
            const pet = await pets.getPets();
            assert.equal(pet[0].votes, "1", "The first pet in the array should be votes:1");
            assert.equal(pet[1].votes, "0", "The second pet in the array should be votes:0");
            assert.equal(pet[2].votes, "1", "The third pet in the array should be votes:1");
            assert.equal(pet[3].votes, "0", "The third pet in the array should be votes:0");
        });
        it("can fetch the pet adopter", async () => {
            const pet = await pets.getPets();
            assert.equal(pet[0].adopter, accounts[0], `The first pet in the array should be adopter:${accounts[0]}`);
            assert.equal(pet[1].adopter, accounts[0], `The second pet in the array should be adopter:${accounts[0]}`);
            assert.equal(pet[2].adopter, "0x0000000000000000000000000000000000000000", `The third pet in the array should be adopter:0x0000000000000000000000000000000000000000`);
            assert.equal(pet[3].adopter, "0x0000000000000000000000000000000000000000", `The third pet in the array should be adopter:0x0000000000000000000000000000000000000000`);
        });
    });

    // describe("adopting a pet and retrieving account addresses", async () => {
    //     before("adopt a pet using accounts[0]", async () => {
    //         await pets.adopt(8, { from: accounts[0] });
    //         expectedAdopter = accounts[0];
    //     });

    //     it("can fetch the address of an owner by pet id", async () => {
    //         const adopter = await pets.adopters(8);
    //         assert.equal(adopter, expectedAdopter, "The owner of the adopted pet should be the first account.");
    //     });

    //     it("can fetch the collection of all pet owners' addresses", async () => {
    //         const adopters = await pets.getAdopters();
    //         assert.equal(adopters[8], expectedAdopter, "The owner of the adopted pet should be in the collection.");
    //     });
    // });
    describe("check totoal addopted pets", async () => {
        it("can fetch the addopted pet list", async () => {
            const petnum = await pets.trackPet();
            assert.equal(petnum, 2, "Two pets should have been addopted");
        });
    });

    describe("checking customer that have been served", async () => {
        it("can fetch the cust list", async () => {
            const custnum = await pets.trackCust();
            assert.equal(custnum, 1, "One customer served");
        });

    });

    describe("checking customer repeat detection", async () => {
        it("can detect repeated customer", async () => {
            const custnum = await pets.trackCust();
            assert.equal(custnum, 1, "One customer served");
        });

    });

    describe("manually adding new customer to the list", async () => {
        before("add cust using account[1]", async () => {
            await pets.addCust({ from: accounts[1] });
            expectedAdopter = accounts[1];
        });
        it("can fetch the correct cust list", async () => {
            const custnum = await pets.trackCust();
            assert.equal(custnum, 2, "Two customer served");
        });

    });
});
