两个相同的Token合约,事件名称相同时subgraph会修改其中一个事件名称
需要手动修改subgraph/abis目录中对应合约的事件名称，同时 修改 subgraph.yaml 文件中名称

修改 subgraph/package.json，不指定网络，重新部署合约subgraph.yaml中的合约地址不会更新
```
"build":"graph build --network localhost"
```