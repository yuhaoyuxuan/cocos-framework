  /**
  * 对象id生成
  * @author slf
  */
 export default class ObjIdGeneraterUtils{
    static id = 0;
    static get getId():string{
        ObjIdGeneraterUtils.id++;
        return ObjIdGeneraterUtils.id+"Object";
    }
}