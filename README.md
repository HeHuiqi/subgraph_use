

## 创建hardhat项目基础项目
```
npx hardhat
Chose: Create a basic sample project
```
基础项目依赖如下：
```
# package.json
{
  "name": "hardhat-project",
  "devDependencies": {
    "@nomiclabs/hardhat-ethers": "^2.0.6",
    "@nomiclabs/hardhat-waffle": "^2.0.3",
    "chai": "^4.3.6",
    "ethereum-waffle": "^3.4.4",
    "ethers": "^5.6.9",
    "hardhat": "^2.9.9"
  }
}

```
基础项目配置如下
```
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.4",
};
```


安装subgraph依赖
npm install --save-dev @graphprotocol/graph-cli @graphprotocol/graph-ts

npm install --save-dev git+https://github.com/graphprotocol/hardhat-graph/\#main

安装完成后修改`hardhat.config.js`文件，开始配置subgraph项目


```
require("@nomiclabs/hardhat-waffle");

// 这里一定要引入，是为了引入 hardhat-graph 定义的 hardhat 一些 task ，就是来创建和初始化subgraph项目的
require('hardhat-graph')

const {task} = require('hardhat/config')

module.exports = {

  defaultNetwork:"localhost",
  networks:{
    localhost:{
      url:"http://127.0.0.1:8545"
    }
  },
  //subgraph初始化相关配置，'hhq/MySubgraph' 表示 前缀/项目名称
  subgraph: {
    name: 'hhq/MySubgraph', // Defaults to the name of the root folder of the hardhat project
    product: 'subgraph-studio', // Defaults to 'subgraph-studio'
    indexEvents: true|false, // Defaults to false
    allowSimpleName: true|false // Defaults to `false` if product is `hosted-service` and `true` if product is `subgraph-studio`
  },
  //subgraph 项目目录
  paths: {
    subgraph: './subgraph' // Defaults to './subgraph'
  },
  solidity: "0.8.4",
};

```

## 修改示例合约为一个ERC20的标准合约 HqToken.sol
```

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract HqToken {

    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 private _totalSupply;
    address public owner;

    mapping(address=>uint256) private _balances;
    mapping(address=>mapping(address=>uint256)) _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint256 _decimals)  {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender;
    }
    function totalSupply() public view returns(uint256){
        return  _totalSupply;
    }
    function mint(address to, uint256 amount) public {
        require(to != address(0), "mint: mint to the zero address");
        _balances[to] += amount;
        _totalSupply += amount;
        emit Transfer(address(0),to,amount);

    }
    function balanceOf(address account) public view returns(uint256){
        return _balances[account];
    }
    function allowance(address account, address sender) public view returns(uint256){
        return _allowances[account][sender];
    }
    function approve(address spender, uint256 amount) public {
        require(spender != address(0), "approve: approve to the zero address");
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender,spender,amount);
    }

    function transfer(address to, uint256 amount) public returns(bool) {
        require(to != address(0), "transfer: transfer to the zero address");
        require(to != msg.sender, "transfer: can't transfer to yourself");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(msg.sender,to,amount);
        return true;
    }
    function transferFrom(address from,address to, uint256 amount) public returns(bool) {
        require(to != address(0), "transferFrom: from can't zero address");
        require(to != address(0), "transferFrom: transfer to the zero address");
        require(to != from, "transferFrom:can't transfer to yourself");
        uint256 allowAmount = allowance(from,msg.sender);
        require(allowAmount >= amount, "from allow tranfer amount not enough");
        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;
        emit Transfer(from,to,amount);
        return true;
    }
}

```

修改部署项目 scripts/sample-script.js 如下

```
async function main() {

  const HqToken = await hre.ethers.getContractFactory("HqToken");
  const contract = await HqToken.deploy("HqToken", "HQT", 18);
  await contract.deployed();
  console.log("HqToken deployed to:", contract.address);
    //这里返回合约的名称和地址作为subgraph项目的初始化参数
  return { contractName: "HqToken", address: contract.address }
}

// 部署完合约后初始化subgraph项目
main()
  .then((result) => hre.run('graph', result))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
## 配置脚本命令
package.json
```
{
    "name": "hardhat-project",
    "license": "GPL",
    "scripts": {
        "start": "npx hardhat node",
        "deploy": "npx hardhat run scripts/sample-script.js",
        "test": "npx hardhat test",
        "graph-local-node-start": "cd ./docker && docker-compose up",
        "graph-local-node-stop": "cd ./docker &&  docker-compose down -v && docker-compose rm -v && rm -rf data/ipfs data/postgres",
        "graph-local-codegen": "cd ./subgraph && npm run codegen",
        "graph-local-build": "cd ./subgraph && npm run build",
        "create-local-subgraph-node": "cd ./subgraph &&  npm run create-local",
        "deploy-local-subgraph-node": "cd ./subgraph && npm run deploy-local",
        "remove-local-subgraph-node": "cd ./subgraph && npm run remove-local",
    },
    "devDependencies": {
        "@graphprotocol/graph-cli": "^0.31.0",
        "@graphprotocol/graph-ts": "^0.27.0",
        "@nomiclabs/hardhat-ethers": "^2.0.6",
        "@nomiclabs/hardhat-waffle": "^2.0.3",
        "chai": "^4.3.6",
        "ethereum-waffle": "^3.4.4",
        "ethers": "^5.6.9",
        "hardhat": "^2.9.9",
        "hardhat-graph": "git+https://github.com/graphprotocol/hardhat-graph.git#main"
    }
}
```

## graph-node 节点相关环境的配置修改和启动

克隆graph-node到本地并进入docker目录
```
# 这里可省略，直接将graph-node项目的docker文目录复制到本地项目即可
git clone https://github.com/graphprotocol/graph-node

cd docker
```



修改graph-node节点类型
编辑`docker`目录下的 `docker-compose.yml` 文件，找到如下配置
```
services->graph-node->environment->ethereum: 'mainnet:http://host.docker.internal:8545'
``` 
修改如下，
```
services->graph-node->environment->ethereum: 'localhost:http://host.docker.internal:8545'
```

`mainnet`、`localhost` 代表着是哪个eth节点，还有`rinkeby`、`Ropsten`等，或者自定义节点
这个节点名称也是你要测试子图 `subgraph.yaml` 清单文件 `dataSources->network` 的节点名称，需要保持一致



## subgraph项目的编译和部署

* 先启动eth节点
```
sh start_eth_node.sh
```

* 在启动docker中graph相关环境，注意新建终端，首次会下载相关docker镜像，需要等服务启动起来后再执行下面的命令
```
sh start_graph_node.sh
```

* 创建和部署 subgraph node,注意新建终端
```
sh run.sh
```

* 清除
```
sh run.sh clean
```

## 测试
http://127.0.0.1:8000/subgraphs/name/hhq/MySubgraph

