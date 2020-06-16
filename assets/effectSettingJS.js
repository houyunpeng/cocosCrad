// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        musicProgressBar:{
            default:null,
            type:cc.ProgressBar
        },
        effectProgressBar:{
            default:null,
            type:cc.ProgressBar
        }
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

    onLoad () {
        this.addTouchEvent();
    },

    start () {

    },

    addTouchEvent:function(){
        cc.log("添加点击事件");

        
        this.node.on(cc.Node.EventType.TOUCH_START,function(touch,event){
            var touchLocation = touch.getLocation();
            var musicPosi = this.musicProgressBar.node.parent.convertToWorldSpaceAR(this.musicProgressBar.node.position);
            var effectPosi = this.musicProgressBar.node.parent.convertToWorldSpaceAR(this.effectProgressBar.node.position);

            if (Math.abs(touchLocation.y - musicPosi.y) <= this.musicProgressBar.node.height) {
                cc.log("music neibu");
                this.currentProgressBar = this.musicProgressBar;
            }
            if (Math.abs(touchLocation.y - effectPosi.y) <= this.effectProgressBar.node.height) {
                cc.log("effect neibu");
                this.currentProgressBar = this.effectProgressBar;
            }

            touch.stopPropagation();
            
        },this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(touch,event){
            if (this.currentProgressBar) {
                let prePoint = touch.getPreviousLocation();
                let curPoint = touch.getLocation();
                let deltX = (curPoint.x - prePoint.x) / this.currentProgressBar.node.width;
                var progress = this.currentProgressBar.progress;
                progress += deltX;
                progress = progress > 1 ? 1 : progress;
                progress = progress < 0 ? 0 : progress;
                this.currentProgressBar.progress = progress;
                

            }

            touch.stopPropagation();

        },this);
        this.node.on(cc.Node.EventType.TOUCH_END,function(touch,event){
            if(this.currentProgressBar){
                this.setProgress(this.currentProgressBar.progress);
            }
            
            touch.stopPropagation();
        },this);
    },

    setProgress:function (progress) {

        var node = cc.find("Canvas/bg");
        var mainJs = node.getComponent("mainScene");
        mainJs.setVolume(progress);
        cc.log(progress);
    },

    musicSetting:function (btn) {
        var node = cc.find("Canvas/bg");
        var mainJs = node.getComponent("mainScene");
        if(btn.isSelected){
            btn.isSelected = false;
            cc.audioEngine.setVolume(mainJs.bgmAudio_current,this.musicProgressBar.progress);
        }else{
            btn.isSelected = true;
            cc.audioEngine.setVolume(mainJs.bgmAudio_current,0);
        }
        cc.log("music");
    },
    effectSetting:function (btn) {
        var node = cc.find("Canvas/bg");
        var mainJs = node.getComponent("mainScene");
        if(btn.isSelected){
            btn.isSelected = false;
            cc.audioEngine.setVolume(mainJs.bgmAudio_current,this.musicProgressBar.progress);
        }else{
            btn.isSelected = true;
            cc.audioEngine.pauseMusic(mainJs.bgmAudio_current,0);
        }
        cc.log("effect");
    },
    verbriSetting:function () {
        cc.log("verbri");
    },

    // update (dt) {},
});
