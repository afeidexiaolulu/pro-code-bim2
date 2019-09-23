var answerArr =['undefind','undefind','undefind','undefind','undefind','undefind','undefind','undefind','undefind']
var filterWindow = {
  Init: function (keys,value,componentNum) {
    /*弹窗结构*/
    $(document.body).append(
        '<div class="filterWindowBG">' +
        '</div>'
    )
    filterWindow.refresh(keys,value,componentNum)

},
  refresh:function(keys,value,componentNum){
    $('.filterWindowBG').html('')
    $('.filterWindowBG').append('<div  class="filterWindow">' +
        '<div class="filtername"><span>检索</span><div class="search-box-icon"></div><div class="popup-close iconfont icon-cha2 myclosefilter "></div></div>'+
        /*确认取消按钮*/
        '<div class="componentNum">构建个数：<span>'+componentNum+'</span></div>'+
        '<div class="isSureBtn">'+
        '<div class="sureFilter">确认并选中</div>'+
        '<div class="cancelFilter">取消</div>'+
        '</div>'+
        '</div>')
    for (var i=0;i<keys.length;i++){
      $('.filterWindow').append(
          ' <div class="filter-box '+'filter-box'+i+'" >  ' +
          '   <div  class="filter-label">'+keys[i]+'</div>'+
          '   <div class="filter-text">  ' +
          '    <input class="filter-title" type="text" readonly placeholder="请选择" />  ' +
          '    <i class="icon icon-filter-arrow"></i>  ' +
          '   </div>  ' +

          ' </div>'
      )

      for (var j=0;j<value[i].length;j++) {
        $('.filter-box'+i).append( '  <select name="filter">  ' +
            '   <option value="'+value[i][j]+'">'+value[i][j]+'</option>  ' +
            '  </select>  ' )
        if(answerArr[i]==value[i][j]){
          $('.filter-box'+i+' select').append( '   <option selected value="'+value[i][j]+'">'+value[i][j]+'</option>  ')

        }
      }
      //这里是初始化筛选
      $('.filter-box'+i).selectFilter({
        callBack : function (val,num){

          //返回选择的值
          if(val==="请选择"){
            val=undefined;
          }

          answerArr[num]=val
          console.log(answerArr)
          filterWindow.refresh(keys,[
            ["KTJ02999"],
            ["02999","03"],
            ["飞机111"],
            [],
            [],
            [],
            ["halou"],
            [],
            []
          ],componentNum)
          $('.filter-box .filter-selected').remove()

        }
      });

    }
    /*
    select   --  name 可以接收选择的值【用于表单提交  名称自定义】
    option   --  1.  value    传给后台的参数
    1.  selected 设置默认选中
    2.  disabled 设置禁止选则
    */
    /*确认点击事件*/
    $('.sureFilter').click(function () {
      console.log(answerArr)
    })
    /*取消点击事件*/
    $('.cancelFilter').click(function () {
      filterWindow.hide()
    })
    /*关闭事件*/
    $('.myclosefilter').click(function () {
      filterWindow.hide()
    })
  },
  show: function (keys,value,componentNum) {

    filterWindow.refresh(keys,value,componentNum)
    $('.filterWindowBG').show()

  },

  hide: function () {
    answerArr =['undefind','undefind','undefind','undefind','undefind','undefind','undefind','undefind','undefind']
    $('.filterWindowBG').remove()
    $('.filter-title').val('')

  },

}
