//  https://eth-goerli.g.alchemy.com/v2/el3uIJ3JosZITyEEf1od4uiO5jRpFNtK
//https://eth-sepolia.g.alchemy.com/v2/5feB1eJWiS97q2PgP9m5zO_Q7j-bIAEj

require("@nomicfoundation/hardhat-toolbox")

module.exports = {
  solidity:'0.8.9',
  networks:{
    // goerli:{
    //   url:'https://eth-goerli.g.alchemy.com/v2/el3uIJ3JosZITyEEf1od4uiO5jRpFNtK',
    //   account:['0x5ef4a25f5669d24dd54cb5761767f4ac2f1298ccbd925ba2d0ae9eeb663f70ce']
    // }
    sepolia:{
      url:'https://eth-sepolia.g.alchemy.com/v2/5feB1eJWiS97q2PgP9m5zO_Q7j-bIAEj',
      accounts:['5ef4a25f5669d24dd54cb5761767f4ac2f1298ccbd925ba2d0ae9eeb663f70ce']
    }
  }
}