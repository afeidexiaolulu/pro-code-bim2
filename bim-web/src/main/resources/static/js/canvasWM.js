// canvas 实现 watermark
function __canvasWM({
                        container = document.body,
                        width = '330px',
                        height = '230px',
                        textAlign = 'center',
                        textBaseline = 'middle',
                        font = "16px Microsoft Yahei",
                        fillStyle = 'rgba(184, 184, 184, 0.6)',
                        content = '请勿外传',
                        rotate = '30',
                        zIndex = 1000
                    } = {}) {
    const args = arguments[0];
    const canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    const ctx = canvas.getContext("2d");

    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.rotate(Math.PI / 180 * rotate);
    ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

    const base64Url = canvas.toDataURL();
    const __wm = document.querySelector('.__wm');

    const watermarkDiv = __wm || document.createElement("div");
    const styleStr = `
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:${zIndex};
        pointer-events:none;
        background-repeat:repeat;
        background-image:url('${base64Url}')`;

    watermarkDiv.setAttribute('style', styleStr);
    watermarkDiv.classList.add('__wm');

    if (!__wm) {
        container.style.position = 'relative';
        container.insertBefore(watermarkDiv, container.firstChild);
    }

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
        let mo = new MutationObserver(function () {
            const __wm = document.querySelector('.__wm');
            // 只在__wm元素变动才重新调用 __canvasWM
            if ((__wm && __wm.getAttribute('style') !== styleStr) || !__wm) {
                // 避免一直触发
                mo.disconnect();
                mo = null;
                __canvasWM(JSON.parse(JSON.stringify(args)));
            }
        });

        mo.observe(container, {
            attributes: true,
            subtree: true,
            childList: true
        })
    }

}

if (typeof module != 'undefined' && module.exports) { //CMD
    module.exports = __canvasWM;
} else if (typeof define == 'function' && define.amd) { // AMD
    define(function () {
        return __canvasWM;
    });
} else {
    window.__canvasWM = __canvasWM;
}