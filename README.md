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

具体说明见 [四叉树空间管理](https://busyo.buzz/article/Laya/%E5%B7%A5%E5%85%B7/%E5%9B%9B%E5%8F%89%E6%A0%91%E7%A9%BA%E9%97%B4%E7%AE%A1%E7%90%86/#代码)