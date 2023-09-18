## 松散四叉树

使用方法

```typescript
//bound 和 rect 格式都是RectBean
//初始化四叉树
let qtree = new Qtree(bound,number,number);
let qObj = new QtreeObj(id,rect,node);
//插入
let qnode = qtree.insert(qnode);
//移除
qtree.remove(qnode);
//查找
qtree.findObjFromRect(rect);
//更新
qnode = qnode.refresh(qObj);
```

具体说明见 [四叉树空间管理](https://busyo.buzz/article/3357cf00d6c0/)