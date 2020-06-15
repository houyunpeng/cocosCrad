// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        resumeBtn:{
            default:null,
            type:cc.Button
        },
        endNowBtn:{
            default:null,
            type:cc.Button
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },


    resumeBtnAction:function(){
        this.node.removeFromParent();

        var node = cc.find("Canvas/bg");
        node.getComponent("mainScene").pauseOrResume(false);

    },
    endNowBtnAction:function () {
        this.node.removeFromParent();

        var node = cc.find("Canvas/bg");
        var mainJs = node.getComponent("mainScene");
        var endGameNode = cc.instantiate(mainJs.endGamePrefab);
        endGameNode.parent = node;
        
    },

    addTouchEvent:function(){
        cc.log("添加点击事件");

        
        this.node.on(cc.Node.EventType.TOUCH_START,function(touch,event){
            
            touch.stopPropagation();
            
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(touch,event){
            touch.stopPropagation();

        },this);
        this.node.on(cc.Node.EventType.TOUCH_END,function(touch,event){
            touch.stopPropagation();
        },this);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
