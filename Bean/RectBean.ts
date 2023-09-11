export default class RectBean {
    constructor(x?, z?, w?, h?, maxX?, minX?, maxZ?, minZ?) {
        this.x = x;
        this.z = z;
        this.w = w;
        this.h = h;
        this.maxX = maxX;
        this.minX = minX;
        this.maxZ = maxZ;
        this.minZ = minZ;
    }
    public x;
    public z;
    public w;//宽 -- x方向
    public h;//高 -- z方向
    public maxX;
    public minX;
    public maxZ;
    public minZ;
}