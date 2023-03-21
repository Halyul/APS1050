App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pet.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.btn-up-vote').attr('data-id', data[i].id);
        petTemplate.find('.btn-down-vote').attr('data-id', data[i].id);
        petTemplate.find('.btn-return-pet').attr('data-id', data[i].id);
        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Pets.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var PetsArtifact = data;
      App.contracts.Pets = TruffleContract(PetsArtifact);

      // Set the provider for our contract
      App.contracts.Pets.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      App.markAdopted();
      App.markVotes();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-return-pet', App.handleReturnPet);
    $(document).on('click', '.btn-up-vote', App.handleUpVote);
    $(document).on('click', '.btn-down-vote', App.handleDownVote);
  },

  markAdopted: function() {
    var petsInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pets.deployed().then(function (instance) {
        petsInstance = instance;

        return petsInstance.getPets.call();
      }).then(function (pets) {
        for (const pet of pets) {
          const el = $('.panel-pet').eq(pet.id);
          const button = el.find('#adopt-button');
          const dropdown = el.find('#adopt-button-dropdown')
          const returnPet = el.find('#return-pet-button')
	  // console.log(pet.adopter)
	  // You are the adopter
          if (account === pet.adopter) {
            button.text('Success').attr('disabled', true)
            el.find('#pet-owner').text('Lovely You')
	    returnPet.attr("disabled",false)
            dropdown.attr('disabled', false)
          }
	  // Other user is the adopter
	  else if (pet.adopter !== "0x0000000000000000000000000000000000000000") {
            button.text('Adopted').attr('disabled', true)
            el.find('#pet-owner').text(pet.adopter)
            dropdown.attr('disabled', false)
          }
	  // No one has adopted the pet
	  else {
            button.text('Adopted').attr('disabled', false)
            el.find('#pet-owner').attr('disabled',true)
	    returnPet.attr('disabled',true)
            dropdown.attr('disabled', true)
          }
        }
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    console.log(event.target);

    var petsInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pets.deployed().then(function (instance) {
        petsInstance = instance;

        // Execute adopt as a transaction by sending account
        return petsInstance.adopt(petId, { from: account });
      }).then(function (result) {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handleReturnPet: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    console.log(event.target);

    var petsInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pets.deployed().then(function (instance) {
        petsInstance = instance;
	// console.log(account)
        // Execute return pet as a transaction by sending account
        return petsInstance.returnPet(petId, { from: account });
      })
        .then(function (result) {
          return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },


  markVotes: e => {
    let petsInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pets.deployed().then(function (instance) {
        petsInstance = instance;
        return petsInstance.getPets.call();
      }).then(function (pets) {
        for (const pet of pets) {
          const el = $('.panel-pet').eq(pet.id);
          const voteNumber = el.find('#vote-number');
          const upButton = el.find('#up-vote-button');
          const downButton = el.find('#down-vote-button');
          voteNumber.text(pet.votes)
          downButton.attr('disabled', parseInt(pet.votes) === 0)
          if (pet.voters.includes(account)) {
            upButton.attr('disabled', true)
            downButton.attr('disabled', true)
          }
      }
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handleUpVote: e => {
    e.preventDefault();
    var petId = parseInt($(e.target).data('id'));

    let petsInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pets.deployed().then(function (instance) {
        petsInstance = instance;
        return petsInstance.upVote(petId, { from: account });
      }).then(function (result) {
        return App.markVotes();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  handleDownVote: e => {
    e.preventDefault();
    var petId = parseInt($(e.target).data('id'));

    let petsInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      if (account) {
        App.contracts.Pets.deployed().then(function (instance) {
          petsInstance = instance;
          return petsInstance.downVote(petId, { from: account });
        }).then(function (result) {
          return App.markVotes();
        }).catch(function (err) {
          console.log(err.message);
        });
      }
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
