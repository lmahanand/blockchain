pragma solidity ^0.4.18;

contract OnlineBazaar{

  struct Article{
    uint id;
    address seller;
    address buyer;
    string name;
    string desscription;
    uint256 price;// unsigned integer of 256 bits
  }

  //state variables
  mapping (uint => Article) public articles;
  uint articleCounter;


  // Events

  event LogSellArticle(
    uint indexed _id,
    // seller is indexed, it will be possible to filter sellers address
    address indexed _seller,
    string _name,
    uint256 _price
  );

  event LogBuyArticle(
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  // sell an article

  function sellArticle(string _name, string _description, uint256 _price) public {
    /*
    seller = msg.sender;// sender address is assigned to seller variable

    name = _name;
    desscription = _description;
    price = _price;
    */

    articleCounter++;

    //Store this article
    articles[articleCounter] = Article(
      articleCounter,
      msg.sender,
      0x0,
      _name,
      _description,
      _price
    );

    LogSellArticle(articleCounter, msg.sender, _name, _price);
  }

  //Fetch the no of article in a contracts

  function getNumberOfArticles() public view returns (uint){
    return articleCounter;
  }

  // Fetch all article IDs that are still on sale

  function getArticlesForSale() public view returns (uint[]){
    //create output array
    uint[] memory articleIds = new uint[](articleCounter);

    uint numberofArticlesForSale = 0;

    //iterate over articles
    for(uint i =1; i<=articleCounter; i++){
      if(articles[i].buyer == 0x0){
        articleIds[numberofArticlesForSale] = articles[i].id;
        numberofArticlesForSale++;
      }
    }

    //copy the artilcesIds array to smaller forSale array
    uint[] memory forSale = new uint[](numberofArticlesForSale);
    for(uint j=0;j<numberofArticlesForSale;j++){
      forSale[j] = articleIds[j];
    }

    return forSale;
  }
  /*
  function getArticle() public view returns (
    address _seller,
    address _buyer,
    string _name,
    string _description,
    uint256 _price){
    return (seller, buyer, name, desscription, price);
  }*/

  //buy an article
  // payable is usually to tag that this function may receive value (ether) from it's caller
  // if we dont declare payable then we can send value to this function
  function buyArticle(uint _id) payable public{
    //check if article is availble for sale
    //require(seller != 0x0); //seller is not nil
    require(articleCounter > 0);

    // check article is available
    require(_id > 0 && _id <= articleCounter);

    //retrieve the articles
    Article storage article = articles[_id];

    // check article is not soldl yet
    require(article.buyer == 0x0);

    // we dont allow the seller to buy it's own buyArticle
    require(msg.sender != article.seller);

    // buyer price is equal to seller _price
    require(msg.value == article.price);

    // keep track of buyers information

    article.buyer = msg.sender;

    // buyer pays the sellers
    //transfer atomic function and it can revert the transaction as well at exception
    article.seller.transfer(msg.value);

    //trigger the Events
    LogBuyArticle(_id, article.seller,article.buyer,article.name, article.price);

  }
}
