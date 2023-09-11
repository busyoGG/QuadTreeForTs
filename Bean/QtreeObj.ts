export default class QtreeObj {
    constructor(id?, rect?, node?) {
        this.id = id;
        this.rect = rect;
        this.node = node;
    }
    /** id 一般只需要这个就够了 必要属性 */
    public id: number;
    /** 范围 必要属性 */
    public rect;
    /** 节点 必要属性 可以是不同数据类型 */
    public node: Laya.Sprite3D;
}