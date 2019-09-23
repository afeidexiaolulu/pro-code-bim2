
/*
var EventUtil={
  /!*检测绑定事件
  <script type="text/javascript">
      var btn=document.getElementById("btn");
      var bangding=function(){
        alert("你好！")
      }
      EventUtil.addHandler(btn,"click",bangding);

      var btn1=document.getElementById("btn1");
      var yichu=function(){
        alert("你好已被移除！");
        EventUtil.removeHandler(btn,"click",bangding)
      }
      EventUtil.addHandler(btn1,"click",yichu)
    </script>
    *!/
  addHandler:function(element,type,handler){
    if(element.addEventListener){
      element.addEventListener(type,handler,false);
    }
    else if(element.attachEvent){
      element.attachEvent('on'+type,handler);
    }
    else{
      element["on"+type]=handler /!*直接赋给事件*!/
    }

  },
  /!*通过removeHandler*!/
  removeHandler:function(element,type,handler) {   /!*Chrome*!/
    if (element.removeEventListener)
      element.removeEventListener(type, handler, false);
    else if (element.deattachEvent) {               /!*IE*!/
      element.deattachEvent('on' + type, handler);
    }
    else {
      element["on" + type] = null;
      /!*直接赋给事件*!/
    }
  }

};*/