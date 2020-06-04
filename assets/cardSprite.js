// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const flipStatusInit = 0;
const flipStatusHolder = 1;
const flipStatusPlaying = 2;
const flipStatusScoring = 3;

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

        rendered:false,
        flipStatus:flipStatusInit,
        
        numValue:0,
        colorValue:0,
        bgValue:0,

        isDraging:false,//正在拖动


        line:-1,//
        row:-1,//
        preParent:null,
        prePosition:null,

        dragingCards:[]
        
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
            // this.node.zOrder = -1;
            this.isDraging = true;

            this.node.setSiblingIndex = -1;
            if(this.flipStatus === flipStatusPlaying){
                
                var parent = this.node.parent;
                var children = parent.children;
                for (let i = 0; i < children.length; i++) {
                    
                    const subNode = children[i];

                    subNode.getComponent("cardSprite").prePoint = subNode.position;
                    subNode.getComponent("cardSprite").preParent = subNode.parent;

                    cc.log(subNode.name);
                    if (subNode.row >= this.node.row && subNode.line === this.node.line) {
                        
                        this.dragingCards.push(subNode);

                    }
                    
                }

            }else if(this.flipStatus === flipStatusHolder){
                this.dragingCards.push(this.node);
                this.prePoint = this.node.position;
                this.preParent = this.node.parent;
            }
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
            if (this.flipStatus === flipStatusHolder) {
                var parent = cc.find("Canvas/bg");
                this.node.parent = parent;
                this.node.position = parent.convertToNodeSpaceAR(point);
            } else if(this.flipStatus === flipStatusPlaying){
                
                var parent = this.node.parent;
                var children = parent.children;
                for (let i = 0; i < this.dragingCards.length; i++) {
                    const subNode = this.dragingCards[i];

                    let prePoint = touch.getPreviousLocation();
                    let curPoint = touch.getLocation();

                    var position = subNode.position;
                    position.y = position.y + (curPoint.y - prePoint.y);
                    position.x = position.x + (curPoint.x - prePoint.x);
                    subNode.position = position;
                    
                }

            }

        },this);
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
                mainScene.findTerminalToFallDown(this.dragingCards,parent.convertToNodeSpaceAR(touch.getLocation()));
            }

            this.dragingCards = [];

            this.isDraging = false;


        },this);
    },

    backToPrePosition:function(){
        // this.node.parent = this.preParent;
        cc.tween(this.node).to(0.2,{position:cc.v2(this.prePoint.x,this.prePoint.y)}).start();
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
                this.num.scaleX = -1;
                this.smallColor.scaleX = -1;
                this.bigColor.scaleX = -1;
                
            }
        }else{
            
            if(this.rendered){
                this.loadNodesSpriteFrame("poker/poker_back",this.node.getComponent(cc.Sprite));
                this.rendered = false;
                this.node.pauseSystemEvents();
                this.num.scaleX = 0;
                this.smallColor.scaleX = 0;
                this.bigColor.scaleX = 0;
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
