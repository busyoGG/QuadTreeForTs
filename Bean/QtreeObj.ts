export default class QtreeObj {
    constructor(id?, objId?, rect?, node?) {
        this.id = id;
        this.objId = objId; 
        this.rect = rect;
        this.node = node;
    }
    /** id 一般只需要这个就够了 必要属性 */
    public id: number;
    /** 对象id 此处为项目需要而增加的id */
    public objId: number;
    /** 范围 必要属性 */
    public rect;
    /** 节点 必要属性 */
    public node: Laya.Sprite3D;
}