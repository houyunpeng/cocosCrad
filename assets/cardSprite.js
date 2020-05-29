// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


cc.Class({
    extends: cc.Component,

    properties: {
        
        num:{
            default:null,
            type:cc.Node
        },
        smallColor:{
            default:null,
            type:cc.Node
        },
        bigColor:{
            default:null,
            type:cc.Node
        },
        bgColor:{
            default:null,
            type:cc.Node
        },
        rootNodeFrameFile:null,
        numFrameFile:null,
        smallFrameFile:null,
        bigFrameFile:null,

        rendered:false
        
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.addTouchEvent();
        this.node.pauseSystemEvents();
    },

    start () {
        
    },

    

    loadNodesSpriteFrame:function(file,sprite){
        cc.log(file,sprite);
        if (!file) {
            
            return;
        }

        cc.loader.loadRes(file,cc.SpriteFrame,function(err,spriteFrame){
            cc.log(err,spriteFrame);
            if(!err){
                sprite.spriteFrame = spriteFrame
            }
        });
    },
    setRootNodeFile:function (file) {
        
        this.rootNodeFrameFile = file;
        cc.log("文件资源frame"+this.rootNodeFrameFile);
    },
    setNumFile:function (file) {
        this.numFrameFile = file;
    },
    setSmallFile:function (file) {
        this.smallFrameFile = file;
        this.bigFrameFile = file;
    },

    flipVertor:function () {
        this.node.scaleY = 0;
        this.node.scaleX = -1;
        cc.tween(this.node).to(1,{scaleY:1,scaleX:1}).start();
    },
    
    
    

    addTouchEvent:function(){
        cc.log("添加点击事件");

        
        this.node.on(cc.Node.EventType.TOUCH_START,function(touch,event){
            
            // if (this.node.children.length > 3) {
                //停止冒泡阶段，事件将不会继续向父节点传递，当前节点的剩余监听器仍然会接收到事件
                touch.stopPropagation();
            // }
            

            var touchP = this.node.convertToNodeSpaceAR(touch.getLocation());
            cc.log("点击的点：",touchP.x,touchP.y);
            var anchor = cc.v2(0.5 + touchP.x*2/this.node.width,0.5 + touchP.y*2/this.node.height);
            // this.node.anchor = cc.v2(anchor.x,anchor.y);
            // this.node.position = this.node.parent.convertToNodeSpaceAR(touch.getLocation());

            // this.node.setSiblingIndex(-1);
            return;

            var touchPoint = this.node.parent.parent.convertToNodeSpaceAR(touch.getLocation());
            this.node.parent = this.node.parent.parent;
            this.node.setPosition(touchPoint.x,touchPoint.y);
            
            // var target = event.target;
            // var point = event.location;
            // cc.log(target);
            // if (!target.getComponent(cc.Graphics).rect.contains(point)){
            //     cc.log("点击了外面")
            //     return;
            // }
            // cc.log(target);
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(touch,event){
            touch.stopPropagation();
            var point = touch.getLocation();
            cc.log(point.x,point.y);
            // var touchPoint1 = this.parent.convertToNodeSpaceAR(touch.getLocation());
            // this.setPosition(touchPoint1.x,touchPoint1.y);

            //将纸牌移动到bg上
            var parent = cc.find("Canvas/bg");
            this.parent = parent;
            this.position = parent.convertToNodeSpaceAR(point);

        },this.node);
        this.node.on(cc.Node.EventType.TOUCH_END,function(touch,event){
            cc.log("点击结束");
            touch.stopPropagation();
            var touchPoint = this.node.parent.convertToNodeSpaceAR(touch.getLocation());

            // var controller = this.node.parent.getComponent("mainScene");
            // cc.log(controller);
            // controller.cardSpriteCallBack(this.node,touch);
            this.anchor = cc.v2(0.5,0.5);

            var parent = cc.find("Canvas/bg");
            var mainScene = parent.getComponent("mainScene");
            if (mainScene) {
                mainScene.findTerminalToFallDown(this.node,parent.convertToNodeSpaceAR(touch.getLocation()));
            }
            


        },this);
    },

    update (dt) {
        if(this.node.scaleX <= 0){
            // cc.log("scalex <= -1");
            // this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame("poker/poker_back.png")
            if (!this.rendered) {
                this.loadNodesSpriteFrame(this.rootNodeFrameFile,this.node.getComponent(cc.Sprite));
                this.loadNodesSpriteFrame(this.numFrameFile,this.num.getComponent(cc.Sprite));
                this.loadNodesSpriteFrame(this.smallFrameFile,this.smallColor.getComponent(cc.Sprite));
                this.loadNodesSpriteFrame(this.smallFrameFile,this.bigColor.getComponent(cc.Sprite));
                this.rendered = true;
                // this.num.opacity = 1;
                // this.smallColor.opacity = 1;
                // this.bigColor.opacity = 1;
                this.node.resumeSystemEvents();
            }
        }else{
            
            if(this.rendered){
                this.loadNodesSpriteFrame("poker/poker_back",this.node.getComponent(cc.Sprite));
                this.rendered = false;
                this.node.pauseSystemEvents();
            }
            // this.num.opacity = 0;
            // this.smallColor.opacity = 0;
            // this.bigColor.opacity = 0;
        }
    },
});


// module.exports.node = function () {
//   return this.node;
// };
