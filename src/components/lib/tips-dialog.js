/**
 * @Author      ChenFaxiang
 * @DateTime    2017-08-14
 * @description js消息提示框
 */
require('./tips-dialog.css')
require('../../assets/lib/jquery.min.js')

function TipsDialog (opts) {
    this.dialogStyle = opts.style || 'warn';                // warn error info log 4种类型，可扩展
    this.dialogWidth = opts.width || 300;                   // 自定义弹窗宽度
    this.dialogTitle = opts.title || '提示框';               // 弹框title
    this.isShowTitle = opts.isShowTitle || false;           // 是否显示title, 默认显示
    this.dialogContent = opts.content || '默认提示内容';      // 弹框内容
    this.dialogComfirmBtn = opts.comfirmBtnText || '确定';   // 弹框确定按钮文案
    this.dialogCancelBtn = opts.cancelBtnText || '取消';     // 弹框取消按钮文案
    this.dialogThemeClass = opts.themeClass || 'cfx-dialog'; // 自定义类名，利于自定义样式
    this.dialogComfirmCallback = opts.onConfirm || '';       // 确定回调
    this.dialogCancelCallback = opts.onCancel || '';         // 取消回调
}

TipsDialog.prototype = {
    flag : true,
    show() {
        let me = this;

        me.renderDialog();
        me.sureClick();
        me.cancelClick();
        me.closeDialog();
    },
    /**
     * 渲染当前弹窗的dom结构
     */
    renderDialog() {
        let me = this;
        let dialogHtml = '';
        let diaClassStyle = me.isShowTitle ? me.dialogStyle : '';
        let diaShowTitle = me.isShowTitle ? me.dialogTitle : '';

        // 由于没使用模板，则此提示框dom结构直接字符串拼接
        dialogHtml = '<div class="cfx-dialog '+ me.dialogThemeClass +'" style="width:'+ parseInt(me.dialogWidth+28) +'px;">' +
                     '<div class="cfx-dialog-mark"></div>' +
                     '<div class="cfx-dialog-main" style="width:'+ me.dialogWidth +'px;">' +
                     '<h4 class="dialog-title '+ diaClassStyle +'">' +
                     ''+ diaShowTitle +'<i class="cfx-dialog-close"></i>' +
                     '</h4>' +
                     '<div class="dialog-content '+ me.dialogThemeClass +'-content">'+ me.dialogContent +'</div>' +
                     '<div class="dialog-bottom '+ me.dialogThemeClass +'-bottom">' +
                     '<a class="dialog-sure '+ me.dialogThemeClass +'-sure" href="javascript:;">'+ me.dialogComfirmBtn +'</a>' +
                     '<a class="dialog-cancel '+ me.dialogThemeClass +'-cancel" href="javascript:;">'+ me.dialogCancelBtn +'</a>' +
                     '</div>' +
                     '</div>' +
                     '</div>';

        $(dialogHtml).appendTo('body');
    },
    /**
     * 确定按钮事件及回调处理
     */
    sureClick() {
        let me = this;
        $('body').on('click','.dialog-sure',function () {
            if (me.flag && me.dialogComfirmCallback) {
                me.dialogComfirmCallback();
                me.destoryDialog();
                me.flag = false;
            } else {
                // 没定义onComfirm回调时
                me.destoryDialog();
                me.flag = false;
            }
        });
    },
    /**
     * 取消按钮事件及回调处理
     */
    cancelClick() {
        let me = this;
        $('body').on('click','.dialog-cancel',function () {
            if (me.flag && me.dialogCancelCallback) {
                me.dialogCancelCallback();
                me.destoryDialog();
                me.flag = false;
            } else {
                // 没定义onCancel回调时
                me.destoryDialog();
                me.flag = false;
            }
        });
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
        let me = this;
        $('body').on('click','.cfx-dialog-close',function () {
            me.destoryDialog();
            me.flag = false;
        })
    },
    destoryDialog() {
        $('.cfx-dialog').remove();
    }
    // Todo ... 其他功能扩展区
}

module.exports = TipsDialog;
