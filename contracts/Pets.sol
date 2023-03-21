pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Pets {
    struct Pet {
        uint256 id;
        address adopter;
        address[] voters; // to prevent multiple votes
        uint256 votes;
        address[] adopterHistory;
    }
    Pet[] public pets;

    function create(uint petId, address adopter) public returns (bool) {
        pets.push(Pet({
            id: petId,
            adopter: adopter,
            voters: new address[](0),
            votes: 0,
            adopterHistory: new address[](0)
        }));
        return true;
    }

    function adopt(uint petId) public returns (bool) {
        uint256 i = idFind(petId);
        if (pets[i].adopter != address(0x0)) {
            revert('Pet has already been adopted');
        }
        pets[i].adopter = msg.sender;
        pets[i].adopterHistory.push(msg.sender);
        return true;
    }

    function getPets() public view returns (Pet[] memory) {
        return pets;
    }

    function idExists(uint256 id) public view returns (bool) {
        for (uint256 i = 0; i < pets.length; i++) {
            if (pets[i].id == id) {
                return true;
            }
        }
        return false;
    }

    function idFind(uint256 id) public returns (uint256) {
        if (!idExists(id)) {
            create(id, address(0x0));
        }
        uint256 i = 0;
        for (; i < pets.length; i++) {
            if (pets[i].id == id) {
                return i;
            }
        }
        return i;
    }

    function upVote(uint256 petId) public returns (Pet memory) {
        uint256 i = idFind(petId);

        pets[i].votes += 1;
        pets[i].voters.push(msg.sender);

        return pets[i];
    }

    function downVote(uint256 petId) public returns (Pet memory) {
        uint256 i = idFind(petId);
        if (pets[i].votes == 0) {
            revert('The vote cannot be decreased');
        }

        pets[i].votes -= 1;
        pets[i].voters.push(msg.sender);

        return pets[i];
    }

    function returnPet(uint petId) public returns (bool) {
        uint256 i = idFind(petId);
        if (pets[i].adopter == address(0x0)) {
            revert('Pet has not been adopted');
        }
        pets[i].adopter = address(0x0);
        return true;
    }
}
