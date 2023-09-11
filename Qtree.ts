import QtreeObj from "./Bean/QtreeObj";
import RectBean from "./Bean/RectBean";
import Qnode from "./Qnode";

export default class Qtree{
    public _maxDepth = 0;

    public _maxObjCount = 0;

    public _bound:RectBean;
    /** 子节点 */
    public _root: Qnode;

    constructor(bound,maxDepth,maxObjCount){
        this._bound = bound;
        this._maxDepth = maxDepth;
        this._maxObjCount = maxObjCount;
        this._root = new Qnode(bound, 0, this, this);
    }

    public insert(obj: QtreeObj): void {
        return this._root.insert(obj);
    }

    public remove(obj: QtreeObj){
        this._root.remove(obj);
    }

    public findObjFromRect(rect):QtreeObj[]{
        return this._root.findObjFromRect(rect);
    }
}