// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    submitBtnAction:function () {
        
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
    start () {
        this.addTouchEvent();

        var animation = this.node.getComponent(cc.Animation);
        animation.play();
    },

    // update (dt) {},
});
