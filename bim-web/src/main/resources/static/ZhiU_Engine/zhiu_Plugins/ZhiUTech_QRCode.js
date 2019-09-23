/**
 *  创建人 : LJason
 *  功能说明 : 二维码工具 (当前不可上传数据库,且字数限制为100个字,纯英文会出现意外情况)
 *  @function _Initialize_ZhiUTech_QRCode
 *  @param {object} zhiu 需要挂载的句柄
 */
function Initialize_ZhiUTech_QRCode(zhiu) {
    let mgr = {};
    mgr._folderId = "";
    mgr.L_GetQRCode = function (divid,name, qrstring) {
        let div;
        if(divid===undefined||divid===""){
            let div=document.createElement("div");
            div.id ="_Test_QRCode";
            div.style.cssText="width:300px;height:300px;border:1px solid #000;z-index:1000;position: absolute;";
            document.body.appendChild(div);
            divid=div.id;
        }
        div=$('#' + divid);

        div.qrcode({
            render: "canvas", //也可以替换为table
            width: 300,
            height: 300,
            text: _utf16to8(qrstring)
        });
        if (qrstring.indexOf("http://") !== -1) return;
        // let imgBase64 = div.find("canvas")[0].toDataURL("image/png");
        // _getStructureFolderID();
        // _addQRCode(name, imgBase64);
    };

    function _addQRCode(filename, fileurl) {
        $.post("/QRcode/AddQRCode",
            {
                filename: filename,
                fileurl: fileurl,
                folderId: mgr._folderId
            },
            function (data) {
                var ret = JSON.parse(data);
                if (ret.Code == 500) {
                    //layer.msg(ret.Message);
                } else {
                    ret = ret.Message;
                    //layer.msg("生成完成");
                }
            });
    }

    function _getStructureFolderID() {
        $.ajax({
            type: "get",
            url: "/QRcode/GetStructureFolder",
            async: false,
            success: function (data) {
                var ret = JSON.parse(data);
                ret = JSON.parse(ret.Message);
                mgr._folderId = ret;
            }
        });
    }

    function _utf16to8(str) {
        var out,
            i,
            len,
            c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    zhiu.ZhiUTech_QRCode = mgr;
}




