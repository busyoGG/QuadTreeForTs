import ModelFactory from "../../Common/ModelFactory";
import QtreeObj from "./Bean/QtreeObj";
import RectBean from "./Bean/RectBean";
import Qtree from "./Qtree";

export default class Qnode {
    /** 包围盒 */
    public _bound: RectBean;
    /** 宽松包围盒 */
    public _looseBound: any = {};
    /** 父节点 */
    public _parent: Qnode;
    /** 所属四叉树 */
    public _belongTree: Qtree;
    /** 对象列表 */
    public _objList = [];
    /** 子节点字典 */
    public _childDic = {};
    /** 深度 */
    public _depth: number;
    /** 对象数量 */
    public _objCount = 0;

    private _debugColor: Laya.Color = new Laya.Color(1, 0, 0, 1);
    private _debugColor2: Laya.Color = new Laya.Color(0, 1, 1, 1);
    private _debugView: Laya.PixelLineSprite3D;

    constructor(bound, depth, parent, belongTree) {
        this._bound = bound;
        this._depth = depth;
        this._parent = parent;
        this._belongTree = belongTree;

        this._looseBound = {
            x: bound.x,
            z: bound.z,
            w: bound.w * 2,
            h: bound.h * 2,
            maxX: bound.x + bound.w,
            minX: bound.x - bound.w,
            maxZ: bound.z + bound.h,
            minZ: bound.z - bound.h
        }
        //绘制四叉树范围
        // this.showDebugMode();
    }

    /**
     * 绘制四叉树范围 Laya版本
     * @param loose 是否绘制松散范围
     */
    private showDebugMode(loose?) {
        Laya.timer.once(1000, this, () => {
            //场景中插入线段
            this._debugView = new Laya.PixelLineSprite3D(99999);
            ModelFactory.getScene().addChild(this._debugView);

            for (let t = this._debugView.lineCount - 1; t >= 0; t--) this._debugView.removeLine(t);
            //紧凑四叉树
            this._debugView.addLine(new Laya.Vector3(this._bound.maxX, 0.1, this._bound.maxZ),
                new Laya.Vector3(this._bound.maxX, 0.1, this._bound.minZ), this._debugColor, this._debugColor);

            this._debugView.addLine(new Laya.Vector3(this._bound.minX, 0.1, this._bound.maxZ),
                new Laya.Vector3(this._bound.minX, 0.1, this._bound.minZ), this._debugColor, this._debugColor);

            this._debugView.addLine(new Laya.Vector3(this._bound.maxX, 0.1, this._bound.maxZ),
                new Laya.Vector3(this._bound.minX, 0.1, this._bound.maxZ), this._debugColor, this._debugColor);

            this._debugView.addLine(new Laya.Vector3(this._bound.maxX, 0.1, this._bound.minZ),
                new Laya.Vector3(this._bound.minX, 0.1, this._bound.minZ), this._debugColor, this._debugColor);
            if (loose) {
                //松散四叉树
                this._debugView.addLine(new Laya.Vector3(this._looseBound.maxX, 0.1, this._looseBound.maxZ),
                    new Laya.Vector3(this._looseBound.maxX, 0.1, this._looseBound.minZ), this._debugColor2, this._debugColor2);

                this._debugView.addLine(new Laya.Vector3(this._looseBound.minX, 0.1, this._looseBound.maxZ),
                    new Laya.Vector3(this._looseBound.minX, 0.1, this._looseBound.minZ), this._debugColor2, this._debugColor2);

                this._debugView.addLine(new Laya.Vector3(this._looseBound.maxX, 0.1, this._looseBound.maxZ),
                    new Laya.Vector3(this._looseBound.minX, 0.1, this._looseBound.maxZ), this._debugColor2, this._debugColor2);

                this._debugView.addLine(new Laya.Vector3(this._looseBound.maxX, 0.1, this._looseBound.minZ),
                    new Laya.Vector3(this._looseBound.minX, 0.1, this._looseBound.minZ), this._debugColor2, this._debugColor2);
            }
        })
    }

    /**
     * 插入对象
     * @param obj 
     * @returns 
     */
    public insert(obj: QtreeObj) {
        //判断是否创建子节点
        if (!this._childDic["tl"] && (this._depth == 0 ||
            this._objCount >= this._belongTree._maxObjCount &&
            this._depth < this._belongTree._maxDepth)) {
            this.createChild();
            //填充对象到新创建的子节点中
            for (let i = this._objList.length - 1; i >= 0; i--) {
                //遍历子节点
                for (let prop in this._childDic) {
                    //对象满足子节点条件的，插入到子节点中
                    if (this.checkInAreaStrict(this._objList[i].rect, this._childDic[prop]._bound)) {
                        this._childDic[prop].insert(this._objList[i]);
                        this._objList.splice(i, 1);
                        break;
                    }
                }
            }
        }

        if (this._childDic["tl"]) {
            //尽可能地分到子节点
            for (let key in this._childDic) {
                if (this.checkInAreaStrict(obj.rect, this._childDic[key]._bound)) {
                    this._objCount++;
                    return this._childDic[key].insert(obj);
                }
            }
        }

        this._objList.push(obj);
        ++this._objCount;
        return this;
    }

    /**
     * 移除对象
     * @param obj 
     * @returns 
     */
    public remove(obj: QtreeObj) {
        //父节点坍缩
        if (this._parent._objCount <= 0) {
            this._parent._childDic = {};
        }
        //遍历移除
        for (let i = this._objList.length - 1; i >= 0; i--) {
            //比较对象id是否相等，该条件可根据需要自行修改
            if (this._objList[i].id == obj.id) {
                this._objList.splice(i, 1);
                this._objCount--;
                return;
            }
        }

        //如果当前节点没有匹配对象，则遍历子节点寻找需要移除的对象
        if (this._childDic["tl"]) {
            for (let key in this._childDic) {
                if (this.checkInAreaStrict(obj.rect, this._childDic[key]._bound)) {
                    this._childDic[key].remove(obj);
                    this._objCount--;
                    return;
                }
            }
        }
    }

    /**
     * 查找范围内所有节点
     * @param rect 
     */
    public findObjFromRect(rect: RectBean): QtreeObj[] {
        let objs = [];
        //查找匹配对象
        for (let key in this._objList) {
            if (this.checkIntractive(rect, this._objList[key].rect)) {
                objs.push(this._objList[key]);
            }
        }
        //遍历子节点
        for (let key in this._childDic) {
            if (this._childDic[key].checkIntractive(rect, this._childDic[key]._looseBound)) {
                objs = objs.concat(this._childDic[key].findObjFromRect(rect));
            }
        }
        return objs;
    }

    /**
     * 刷新对象在四叉树中的位置
     * @param obj 
     * @returns 
     */
    public refresh(obj: QtreeObj) {
        if (this.checkInAreaStrict(obj.rect, this._bound)) {
            return this;
        } else {
            this.remove(obj);
            return this._belongTree.insert(obj);
        }
    }

    /**
     * 创建子节点
     */
    private createChild() {

        let bound1 = {
            x: this._bound.x + this._bound.w * 0.25,
            z: this._bound.z + this._bound.h * 0.25,
            w: this._bound.w * 0.5,
            h: this._bound.h * 0.5,
            maxX: this._bound.x + this._bound.w * 0.25 + this._bound.w * 0.25,
            minX: this._bound.x + this._bound.w * 0.25 - this._bound.w * 0.25,
            maxZ: this._bound.z + this._bound.h * 0.25 + this._bound.h * 0.25,
            minZ: this._bound.z + this._bound.h * 0.25 - this._bound.h * 0.25
        };
        this._childDic["tl"] = new Qnode(bound1, this._depth + 1, this._parent, this._belongTree);

        let bound2 = {
            x: this._bound.x - this._bound.w * 0.25,
            z: this._bound.z + this._bound.h * 0.25,
            w: this._bound.w * 0.5,
            h: this._bound.h * 0.5,
            maxX: this._bound.x - this._bound.w * 0.25 + this._bound.w * 0.25,
            minX: this._bound.x - this._bound.w * 0.25 - this._bound.w * 0.25,
            maxZ: this._bound.z + this._bound.h * 0.25 + this._bound.h * 0.25,
            minZ: this._bound.z + this._bound.h * 0.25 - this._bound.h * 0.25
        };
        this._childDic["tr"] = new Qnode(bound2, this._depth + 1, this._parent, this._belongTree);

        let bound3 = {
            x: this._bound.x + this._bound.w * 0.25,
            z: this._bound.z - this._bound.h * 0.25,
            w: this._bound.w * 0.5,
            h: this._bound.h * 0.5,
            maxX: this._bound.x + this._bound.w * 0.25 + this._bound.w * 0.25,
            minX: this._bound.x + this._bound.w * 0.25 - this._bound.w * 0.25,
            maxZ: this._bound.z - this._bound.h * 0.25 + this._bound.h * 0.25,
            minZ: this._bound.z - this._bound.h * 0.25 - this._bound.h * 0.25
        };
        this._childDic["bl"] = new Qnode(bound3, this._depth + 1, this._parent, this._belongTree);

        let bound4 = {
            x: this._bound.x - this._bound.w * 0.25,
            z: this._bound.z - this._bound.h * 0.25,
            w: this._bound.w * 0.5,
            h: this._bound.h * 0.5,
            maxX: this._bound.x - this._bound.w * 0.25 + this._bound.w * 0.25,
            minX: this._bound.x - this._bound.w * 0.25 - this._bound.w * 0.25,
            maxZ: this._bound.z - this._bound.h * 0.25 + this._bound.h * 0.25,
            minZ: this._bound.z - this._bound.h * 0.25 - this._bound.h * 0.25
        };
        this._childDic["br"] = new Qnode(bound4, this._depth + 1, this._parent, this._belongTree);
    }

    /**
     * 检测是否在包围盒内
     * @param rect 
     * @returns 
     */
    private checkInAreaStrict(rect: RectBean, child: RectBean) {
        if (rect.minX > child.minX && rect.maxX < child.maxX &&
            rect.minZ > child.minZ && rect.maxZ < child.maxZ) {
            return true;
        }
        return false;
    }

    /**
     * 检测是否相交
     * @param rect 
     * @param child 
     * @returns 
     */
    private checkIntractive(rect: RectBean, child: RectBean) {
        if (rect.maxX < child.minX ||
            rect.minX > child.maxX ||
            rect.maxZ < child.minZ ||
            rect.minZ > child.maxZ) {
            return false;
        }
        return true;
    }
}