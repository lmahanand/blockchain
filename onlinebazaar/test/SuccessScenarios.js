var OnlineBazaar = artifacts.require("./OnlineBazaar.sol")

//test suite

contract('OnlineBazaar', function(accounts){

var onlineBazaarInstance;
var seller = accounts[1];
var buyer = accounts[2];
var articleName1 = "article 1";
var articleDesc1 = "descript for article 1"
var articlePrice1 = 10;

var articleName2 = "article 2";
var articleDesc2 = "descript for article 2"
var articlePrice2 = 20;

var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

  it("should be initilzed with empty values", function(){
    return OnlineBazaar.deployed().then(function(instance){
      onlineBazaarInstance = instance;
      return instance.getNumberOfArticles();
    }).then(function(data){
      //console.log("data[3]=",data[3]);
      assert.equal(data.toNumber(),0,"# of articles must be 0");
      return onlineBazaarInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length,0,"No article availble for sale");
    });
  });

  // Sell first article

  it("should let us sell a first article" , function(){
    return OnlineBazaar.deployed().then(function(instance){
      onlineBazaarInstance = instance;
      return onlineBazaarInstance.sellArticle(
        articleName1, articleDesc1, web3.toWei(articlePrice1,"ether"), {from: seller}
      );
    }).then(function(receipt){
      //check event
      assert.equal(receipt.logs.length,1,"one event is triggered");
      assert.equal(receipt.logs[0].event,"LogSellArticle","event is is LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(),1,"id must be 1");
      assert.equal(receipt.logs[0].args._seller,seller,"event seller must be "+seller);
      assert.equal(receipt.logs[0].args._name,articleName1,"event name must be "+articleName1);
      assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice1,"ether"),"article price must be " + web3.toWei(articlePrice1,"ether"));

      return onlineBazaarInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data,1,"number of articles must be one");

      return onlineBazaarInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length,1,"number of articles must be one for sale");
      assert.equal(data[0].toNumber(),1,"artilcle id must be 1");

      return onlineBazaarInstance.articles(data[0]);
    }).then(function(data){
      assert.equal(data[0].toNumber(),1,"artilcle id must be 1");
      assert.equal(data[1],seller,"seller must be "+ seller);
      assert.equal(data[2],0x0,"buyer must be empty");
      assert.equal(data[3],articleName1,"article name must be "+ articleName1);
      assert.equal(data[4],articleDesc1,"article name must be "+ articleDesc1);
      assert.equal(data[5].toNumber(),web3.toWei(articlePrice1,"ether"),"article rice must be "+ web3.toWei(articlePrice1,"ether"));
    });
  });

  // Sell second article

  it("should let us sell a second article" , function(){
    return OnlineBazaar.deployed().then(function(instance){
      onlineBazaarInstance = instance;
      return onlineBazaarInstance.sellArticle(
        articleName2, articleDesc2, web3.toWei(articlePrice2,"ether"), {from: seller}
      );
    }).then(function(receipt){
      //check event
      assert.equal(receipt.logs.length,1,"one event is triggered");
      assert.equal(receipt.logs[0].event,"LogSellArticle","event is is LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(),2,"id must be 2");
      assert.equal(receipt.logs[0].args._seller,seller,"event seller must be "+seller);
      assert.equal(receipt.logs[0].args._name,articleName2,"event name must be "+articleName2);
      assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice2,"ether"),"article price must be " + web3.toWei(articlePrice2,"ether"));

      return onlineBazaarInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data,2,"number of articles must be one");

      return onlineBazaarInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length,2,"number of articles must be one for sale");
      assert.equal(data[0].toNumber(),1,"artilcle id must be 1");

      return onlineBazaarInstance.articles(data[1]);
    }).then(function(data){
      assert.equal(data[0].toNumber(),2,"artilcle id must be 1");
      assert.equal(data[1],seller,"seller must be "+ seller);
      assert.equal(data[2],0x0,"buyer must be empty");
      assert.equal(data[3],articleName2,"article name must be "+ articleName2);
      assert.equal(data[4],articleDesc2,"article name must be "+ articleDesc2);
      assert.equal(data[5].toNumber(),web3.toWei(articlePrice2,"ether"),"article rice must be "+ web3.toWei(articlePrice2,"ether"));
    });
  });

  // buy the first article
  it("should buy an article", function(){
    return OnlineBazaar.deployed().then(function(instance){
      onlineBazaarInstance = instance;

      //store the balance of seller and buyer before buyer

      sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      //buy article number 1
      return onlineBazaarInstance.buyArticle(1, {
        from: buyer,
        value: web3.toWei(articlePrice1,"ether")
      });
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,"one event is triggered");
      assert.equal(receipt.logs[0].event,"LogBuyArticle","event is is LogBuyArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(),1,"artilcle id must be 1");
      assert.equal(receipt.logs[0].args._seller,seller,"event seller must be "+seller);
      assert.equal(receipt.logs[0].args._buyer,buyer,"event seller must be "+buyer);
      assert.equal(receipt.logs[0].args._name,articleName1,"event name must be "+articleName1);
      assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice1,"ether"),"article price must be " + web3.toWei(articlePrice1,"ether"));

      //record balance of buyer and seller after buy
      sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      //validate the balances of buyer and seller after buy, accounting for gas

      assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice1, "seller has earned "+ articlePrice1 + " ETH");
      assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice1, "buyer has earned "+ articlePrice1 + " ETH");

      return onlineBazaarInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length,1,"Only 1 article should be left");
      assert.equal(data[0].toNumber(), 2, "Article 2 should only be left for sale");

      return onlineBazaarInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data,2,"there should be 2 articles in total");
    });
  });

/*
  it("should trigger an even when a new article is sold", function() {
    return OnlineBazaar.deployed().then(function(instance){
      onlineBazaarInstance = instance;
      return onlineBazaarInstance.sellArticle(articleName,articleDesc,web3.toWei(articlePrice, "ether"), {from: seller});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,"one event is triggered");
      assert.equal(receipt.logs[0].event,"LogSellArticle","event is is LogSellArticle");
      assert.equal(receipt.logs[0].args._seller,seller,"event seller must be "+seller);
      assert.equal(receipt.logs[0].args._name,articleName,"event name must be "+articleName);
      assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice,"ether"),"article price must be " + web3.toWei(articlePrice,"ether"));
    });
  });
  */

});
