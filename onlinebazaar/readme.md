## Steps to deploy the smart contract to in memory Ethereum Network Ganache

1. After checking out the code, go to project folder and run the below command
    
    truffle migrate --compile-all --reset --network ganache

2. It will open the truffle command prompt
3. Create an object of the smart contract by running the below command.
    
    OnlineBazaar.deployed().then(function(instance){app = instance;})

4. Run truffle test to make sure all test casess are passing.
