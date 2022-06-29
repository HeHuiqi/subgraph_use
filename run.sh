




if [ "$1" == "clean" ]; then
    echo "clean"
    
    npm run remove-local-subgraph-node
    npm run graph-local-node-stop
else
    echo "deploy"
    npm run deploy
    npm run graph-local-codegen && npm run graph-local-build
    npm run create-local-subgraph-node && npm run deploy-local-subgraph-node
fi


