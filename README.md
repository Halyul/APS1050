## Setup
RUN `npm i` FIRST!!
## Added
1. update DApp from using `truffle contract` to using `@truffle/contract `
    - updated `index.html`, `bs-config.json`, 
    - deleted `src/js/truffle-contract.js`, `src/js/web3.min.js`
2. updated from using local bootstrap resources to using npm bootstrap resources 
    - updated `index.html`, `bs-config.json`
    - deleted `src/js/bootstrap.min.js`, `src/css/bootstrap.min.css`, `src/css/bootstrap.min.css.map`
3. added ability to show the owner of the pet (possibly none or 1)
    - updated `src/js/app.js` -> modified `markAdopted()`, `handleAdopt()`, `initContract()`
    - updated `contracts/Pets.sol` for new data struct to support new functions -> added `create()`, `idExists()`, `idFind()`; modified `adopt()`, `getPets()`
4. added ability to up/down vote a pet
    - updated `src/js/app.js` -> added `markVotes()`, `handleUpVote()`, `handleDownVote()`; modified `init()`, `bindEvents()`
    - updated `contracts/Pets.sol` -> added `upVote()`, `downVote()`
5. added ability to return a pet
    - updated `contracts/Pets.sol` to support pet return -> added `returnPet()`
    - updated `src/js/app.js` -> modified `init()`, `bindEvents()`, `markAdopted()` to support the behavior of "Return" button, added `handleReturnPet()` to return the pet for a fee
    - updated `index.html` to support "Return" button

## Project Requirements
1. **5** new functions in the `.sol contract` and **5** new functions in the `app.js`
    - You do NOT need to write 5 new .sol contracts (integrate all new functions within a single .sol contract).
    - The executive summary should explain the new features and which files were modified to implement them.
2. Testing: it should include test files for these 5 features that run with truffle test. Include the testing in the mp4.
    - `truffle test`
3. Run `modclean` before upload to Q

## The Deliverable
1. The DApp (=full Truffle Project Directory DO NOT PUBLISH YOUR DAPP ON GITHUB)
2. Detailed setup instructions for setting up and running the DApp, including version numbers of:
    - Node.js version: `19.7.0`
    - lite-server version: `2.6.1`
    - Solidity version: `0.5.16`
    - web3 version: `1.8.2`
    - Truffle version: `5.7.9`
    - Ganache version or ganache-cli version: `7.7.5`
    - Front End Framework: `JQuery`
    - `truffle --version`
3. A video (e.g. mp4) that shows your operation and testing of the DApp. The video can include the Metamask and Ganache setup, followed by testing run confirmation, followed by operation of the dApp
4. A one-fifth page 1.5 spaced executive summary. The executive summary should explain the new features and which files were modified to implement them.

## Ease of coding
8. a way of keeping track of which owner has which pet(s) (possibly none or many)
10. a way of keeping track of a user's adoption history
12. a way of keeping track of how many custumers have been served and how many pets adopted
13. a way of returning the pet, for a fee
11. a way of a way of keeping track of a pet's adoption history 
