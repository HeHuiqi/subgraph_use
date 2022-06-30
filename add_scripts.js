const package = require("./package.json")
console.log(package);
package.scripts = {
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
}
const fs = require("fs")
fs.writeFileSync("package.json",JSON.stringify(package));