package com.zy.bim.controller;


import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zy.bim.bean.*;
import com.zy.bim.service.MessageService;
import com.zy.bim.service.ProblemService;
import com.zy.bim.util.Const;
import com.zy.bim.util.DocUtil;
import com.zy.bim.util.FileUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.util.Units;
import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author 王文强
 * @title: ProblemController
 * @emal 17600817572@163.com
 * @date 2019/7/5 000523:00
 */
@Controller
@RequestMapping("/bim/problem")
public class ProblemController extends  BaseController  {

    private  static Logger log= LoggerFactory.getLogger(ProblemController.class);

    @Value("${filePath.tempWorkBasePath}")
    public    String save;

    @Autowired
    MessageService messageService;
    @Autowired
    ProblemService problemService;

    //跳转到问题页面
    @RequestMapping("/questionsList")
    public String toProblemHome(){
        return "QuestionsList/QuestionsList";
    }

    //跳转到问题新增
    @RequestMapping("/addProblem")
    public String toNewProblem(){
        return "QuestionsList/addProblem";
    }

    //跳转到问题详情
    @RequestMapping("/detailsQuestion")
    public String toSeeDetails(){
        return "QuestionsList/DetailsQuestion";
    }

    //跳转到问题详情分享页面
    @RequestMapping("/detailsShare")
    public String toDetailsShare(){
        return "QuestionsList/DetailsShare";
    }

    /**
     * 1插入问题
     * 2判断是否有图片有的话插入
     * @param request
     * @param file   --->文件
     * @return
     * @throws Exception
     */
    @RequestMapping("/create")
    @ResponseBody
    public Object createProblem(HttpServletRequest request,@RequestParam(value= "file",required=false) MultipartFile  file) throws Exception{
        String problemName = request.getParameter("problemName");
        String parentId = (String) request.getSession().getAttribute(Const.PROJECT_ID);
        String grade = request.getParameter("grade");
        String describe=request.getParameter("describe");
        String problemDescribeRecording = request.getParameter("problemDescribeRecording");
        Problem problem=new Problem();
        String filename="";
        String uuid="";
        List<ProblemImgFile> list=new ArrayList<>();
        //判断 图片是否存在
        star();
        try {
            problem.setDescribes(describe);
            problem.setCreateTime(time());
            problem.setParentId(parentId);
            /*problem.setParentId("85");*/
            problem.setProblemName(problemName);
            problem.setGrade(grade);
            problem.setCreatePerson(getUserId(request));
            problem.setProblemDescribeRecording(problemDescribeRecording);
            /*problem.setCreatePerson("1");*/
        if (StringUtils.isNotBlank(file.getOriginalFilename())&&file.getOriginalFilename()!=null){
                 ProblemImgFile problemImgFile=new ProblemImgFile();
                 String fileNameS="";
                 //文件名
                 filename=file.getOriginalFilename();
                 if (filename.contains(".")){
                     int i = filename.lastIndexOf(".");
                     //生成文件名UUID，使文件名不会重复
                     uuid = UUID.randomUUID().toString();
                     problemImgFile.setExt(filename.substring(i,filename.length()));
                     filename=uuid+filename.substring(i,filename.length());
                 }
                 File fileDir = FileUtil.getImgDirFile(save+"/bimImg");
                 // 构建真实的文件路径
                 File newFile = new File(fileDir.getAbsolutePath() + File.separator + filename);
                 // 上传图片到 -》 “绝对路径”
                 file.transferTo(newFile);
                 fileNameS+="/bimImg/"+filename;
                 problemImgFile.setCreteBy(getUserId(request));
                 problemImgFile.setImg(fileNameS);
                 problemImgFile.setCreateTime(time());
                 problemImgFile.setStoreType("disk");
                 list.add(problemImgFile);
             }
                // Thread.sleep(500);
            Integer integer = problemService.create(problem, list); //创建完的问题id
            data(integer);
            success(true);

        } catch (IOException e) {
            log.error("项目所属问题创建失败{}"+e.getMessage());
            success(false);
            message("问题创建失败");
            e.printStackTrace();
        }
        return end();
    }

    /**
     * 根据主键修改问题
     * @param request
     * @return
     */
    @RequestMapping("/update")
    @ResponseBody
    public Object updateProblem(HttpServletRequest request){
        Problem problem=new Problem();
        star();
       try {
           String problemName = request.getParameter("problemName");
           String id = request.getParameter("id");
           String describe = request.getParameter("describe");
           String grade = request.getParameter("grade");
           String problemDescribeRecording = request.getParameter("problemDescribeRecording");  //问题描述录音
           problem.setGrade(grade);
           problem.setProblemName(problemName);
           problem.setId(Integer.valueOf(id));
           problem.setDescribes(describe);
           problem.setUpdatePerson(getUserId(request));
           problem.setUpdateTime(time());
           problem.setProblemDescribeRecording(problemDescribeRecording);
           problemService.update(problem);
           success(true);
       }catch (Exception e){
           e.printStackTrace();
           log.error("项目所属问题修改失败{}"+e.getMessage());
           success(false);
           message("问题修改失败");
       }
        return  end();
    }

    /**
     * 批量删除
     * 1.查询图纸删除
     * 2.删除问题
     * 3.删除图片
     */
    @RequestMapping("/delete")
    @ResponseBody
    public Object delete(Integer [] ids){
        star();
        try {
            Problem problem=new Problem();
            for(int i=0;i<ids.length;i++) {
                //查询图纸
                String list=problemService.findProblemImg(ids[i]);

                if (StringUtils.isNotBlank(list)&&null!=list){
                    problem.setProblemScreenshots(list);
                    deleteAll(problem);
                }

            }
            problemService.delete(ids);
            success(true);
        }catch (Exception e){
            log.error("批量删除失败"+e.getMessage());
            e.printStackTrace();
            success(false);
            message("问题删除异常");
        }
        return  end();
    }

    /**
     *     删除文件的接口
     */
    public void deleteAll(Problem problem){
        if(  problem.getProblemScreenshots().contains(",")){
            String [] del=problem.getProblemScreenshots().split(",");
            for ( int i = 0; i <del.length; i++){
                del[i] = save+ del[i];
                File file = new File(del[i]);
                if (file.exists()) {
                    file.delete();
                }
            }
        }else{
            File file = new File(save+problem.getProblemScreenshots());
            if (file.exists()) {
                file.delete();
            }
        }
    }


    /**
     * 查询问题列表
     */
    @RequestMapping("findAll")
    @ResponseBody
    public Object findAll(HttpServletRequest request,@RequestParam(value="pageNum",defaultValue="1")int pageNum,
                          @RequestParam(value="pageSize",defaultValue="10")int pageSize,@RequestParam(defaultValue="createTime")String sort,@RequestParam(defaultValue="desc")String rule){
       star();
       try {
           String project =(String) request.getSession().getAttribute(Const.PROJECT_ID);
           Map map=new HashMap(16);
            map.put("sort",null);

           map.put("parentId",project);
          // map.put("parentId","85");
           map.put("problemName",request.getParameter("problemName"));
           PageHelper.startPage(pageNum, pageSize);
           if (StringUtils.isNotBlank(sort)){
               if (sort.equals("problemName")){
                   PageHelper.orderBy("convert(list.problem_name USING gbk) "+rule);
               }
               if (sort.equals("createPerson")){
                   PageHelper.orderBy("convert(userto.user_name USING gbk) "+rule);
               }
               if (sort.equals("createTime")){
                   PageHelper.orderBy("list.create_time "+rule);
               }
               if (sort.equals("grade")){
                   PageHelper.orderBy("convert(list.grade USING gbk) "+rule);
               }
           }
           List<Problem> problems=problemService.findAll(map);
           PageInfo<Problem> pageInfo = new PageInfo<Problem>(problems);
           success(true);
           data(pageInfo);
       }catch (Exception e){
           log.error("查询项目所属问题失败"+e.getMessage());
            success(false);
            message("查询问题列表异常");
       }
        return  end();
    }


    /**
     * 修改回显
     * @param id
     * @return
     */
    @RequestMapping("/findOne")
    @ResponseBody
    public Object findOne(String id,HttpServletRequest request){
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        //详情入口(0:问题入口.1:个人中心-处理列表入口)
        String into=request.getParameter("into");
        Problem problem=new Problem();
        problem.setId(Integer.parseInt(id));
        star();
        try {
            Map map=new HashMap(16);
            Problem  problemOne=  problemService.findOne(problem);
            List<MessageVo> messageList=messageService.selectMessageListByProblem(Integer.parseInt(id));
            Message message = messageService.getMessageId(problem.getId());
            boolean buttonStatus = true;
            if(message != null){
                //按钮状态判断(true:追加-回复 false:回复-取消)
                if(message.getSendPerson() != user.getId()) buttonStatus = false;
                map.put("isEnd",message.getIsEnd());
                Integer sendPerson = message.getSendPerson();
                Map parame = new HashMap(16);
                parame.put("sendPerson",sendPerson);
                parame.put("messageId",message.getId());
                String problemSolverName = messageService.queryProblemSolverName(parame);
                problemOne.setProblemSolverName(problemSolverName);
            }
            List<ProblemImgFile> problemImgFile=problemService.findImgOne(problem.getId());
            if("1".equals(into)){
                //更新状态
                messageService.updateReadStatus(problem.getId(),request);
            }
            map.put("problemOne",problemOne);
            map.put("problemImg",problemImgFile);
            map.put("messageList",messageList);
            map.put("buttonStatus",buttonStatus);
            data(map);
            success(true);
        }catch (Exception e){
            log.error("问题回显失败");
            success(false);
            message("问题查询失败!");
            e.printStackTrace();
        }
        return  end();
    }

    /**
     * 根据id删除图片
     * @param id 数据库id
     * @return
     */
    @RequestMapping("/deleteOneImg")
    @ResponseBody
    public Object deleteOneImg(String id){
        star();
        try {
            String img= problemService.findImgOneImg(id);
            problemService.deleteOneImg(id);
            Problem problem=new Problem();
            if (StringUtils.isNotBlank(img)&&null!=img){
                problem.setProblemScreenshots(save+img);
                deleteAll(problem);
            }
            success(true);
        }catch (Exception e){
            success(false);
            message("删除图片失败!");
            e.printStackTrace();
            log.error("删除图片地址{}"+e.getMessage());
        }
        return  end();
    }

    /**
     *
     * @param iad
     * @param files
     * @return
     */
    @RequestMapping("/createImg")
    @ResponseBody
    public Object createImg(String iad,@RequestParam(value= "file",required=false) MultipartFile [] files,HttpServletRequest request){
        star();
        try{
            //判断 图片是否存在
            if (files != null && files.length != 0){
                List<ProblemImgFile> list=new ArrayList<>();
                for (MultipartFile file:files){
                    ProblemImgFile problemImgFile=new ProblemImgFile();
                    if (StringUtils.isNotBlank(file.getOriginalFilename())&&file.getOriginalFilename()!=null){
                        String uuid="";
                        String filename = file.getOriginalFilename();
                        if (filename.contains(".")){
                            int i = filename.lastIndexOf(".");
                            //生成文件名UUID，使文件名不会重复
                            uuid = UUID.randomUUID().toString();
                            problemImgFile.setExt(filename.substring(i,filename.length()));
                            filename=uuid+filename.substring(i,filename.length());
                            problemImgFile.setStoreType("disk");
                             problemImgFile.setCreteBy(getUserId(request));
                            //problemImgFile.setCreteBy("1");
                        }
                        File fileDir = FileUtil.getImgDirFile(save+"/bimImg");
                        // 构建真实的文件路径
                        File newFile = new File(fileDir.getAbsolutePath() + File.separator + filename);
                        System.out.println(newFile.getAbsolutePath());
                        // 上传图片到 -》 “绝对路径”
                        file.transferTo(newFile);
                        problemImgFile.setImg("/bimImg/"+filename);
                        problemImgFile.setCreateTime(time());
                        problemImgFile.setId(iad);
                        list.add(problemImgFile);
                    }
                }
                problemService.createImg(list);
            }
            success(true);
        }catch (Exception e){
            log.error("根据问题创建图片{}"+e.getMessage());
            e.printStackTrace();
            success(false);
            message("问题图片上传失败!");
        }
        return end();
    }

    /**
     * 导出
     * @param ids 问题表中的主键
     *            根据主键id查询问题列表
     *            然后查询 问题相对应的图片
     * @param request
     * @param response
     */
    @RequestMapping("PoiWord")
    public void poiWord(Integer [] ids, HttpServletRequest request,HttpServletResponse response){
        String  projectId=(String) request.getSession().getAttribute(Const.PROJECT_ID);
        Project project=problemService.findOneProject(projectId);
        XWPFDocument document= new XWPFDocument();
        try {
            //添加标题
            XWPFParagraph titleParagraph = document.createParagraph();
            //设置段落居中
            titleParagraph.setAlignment(ParagraphAlignment.CENTER);
            // 标题
            XWPFRun titleParagraphRun = titleParagraph.createRun();
            if (null!=project.getProjectName()&&StringUtils.isNotBlank(project.getProjectName())){
                // 项目名称
                titleParagraphRun.setText(project.getProjectName());
            }
            // 设置字体颜色 黑色
            titleParagraphRun.setColor("000000");
            // 设置字体大小 最大75好像
            titleParagraphRun.setFontSize(40);
            //获取数据
            List<Problem> oralHisStructureTexts=problemService.findProblem(ids);
            //创建表格
            XWPFTable table1 = document.createTable(oralHisStructureTexts.size()+1, 4);
            table1.setWidthType(TableWidthType.NIL);

            // 获取到刚刚插入的行
            XWPFTableRow row1 = table1.getRow(0);
            // 设置单元格内容
            row1.getCell(0).setText("问题描述");
            row1.getCell(1).setText("问题等级");
            row1.getCell(2).setText("问题描述");
            row1.getCell(3).setText("问题图片");
            table1.setWidth("8000");
            document.setTable(0, table1);
            // 这里写你在数据库中查出的数据
            String img="";
            //然后循环你的数据
            for (int i=0;i<oralHisStructureTexts.size();i++){
                row1 = table1.getRow(i+1);
                row1.getCell(0).setText(oralHisStructureTexts.get(i).getProblemName());
                row1.getCell(1).setText(oralHisStructureTexts.get(i).getGrade());
                row1.getCell(2).setText(oralHisStructureTexts.get(i).getDescribes());
                if(oralHisStructureTexts.get(i).getId()!=null){
                    XWPFTableCell cell = row1.getCell(3);
                    List<XWPFParagraph> paragraphs = cell.getParagraphs();
                    List<ProblemImgFile> problemImgFile=problemService.findImgOne(oralHisStructureTexts.get(i).getId());
                    for ( Iterator<ProblemImgFile> it=problemImgFile.iterator();it.hasNext();){
                        img=  it.next().getImg();
                        XWPFParagraph newPara = paragraphs.get(0);
                        XWPFRun imageCellRunn = newPara.createRun();
                        if (StringUtils.isNotBlank(img)&&null!=img){
                            imageCellRunn.addPicture(new FileInputStream(save+img), XWPFDocument.PICTURE_TYPE_PNG, "1.png", Units.toEMU(100), Units.toEMU(50));
                        }
                    }
                }
            }
            SimpleDateFormat sdf = new SimpleDateFormat("MMddHHmmss");
            String fileName = new String("word导出".getBytes("UTF-8"), "iso-8859-1");
            new DocUtil().exportWord(document,response,fileName+sdf.format(new Date()));
        } catch (Exception e1) {
            // TODO Auto-generated catch block
            log.error("导出异常{}"+ e1.getMessage());
            e1.printStackTrace();
        }

    }

    /**
     * 时间戳
     * @return
     */
    public String getTime(){
        //设置日期格式
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        // new Date()为获取当前系统时间，也可使用当前时间戳
        return  df.format(new Date());
    }

    /**
     * 获取系统当前时间
     */
    public Date time() throws ParseException {
        //设置日期格式
        SimpleDateFormat dfCreate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // new Date()为获取当前系统时间，也可使用当前时间戳
        String dateCreate = dfCreate.format(new Date());
        return dfCreate.parse(dateCreate);
    }

    /**
     * 获取当前登陆人id
     */
    public String getUserId(HttpServletRequest request){
        User user = (User)request.getSession().getAttribute(Const.LOGIN_USER);
        return user.getId().toString();
    }


  /*  @RequestMapping("/test")
    public void test(){
        // 文档生成方法
        XWPFDocument doc = new XWPFDocument();
        FileOutputStream out = null; // 创建输出流
        try {

            XWPFParagraph p2 = doc.createParagraph(); // 创建段落
            XWPFRun r2 = p2.createRun(); // 创建段落文本
            // 设置文本
            r2.setText("表名");
            r2.setFontSize(45);
            r2.setBold(true);
            XWPFTable table1 = doc.createTable(2, 3);
            table1.setWidthType(TableWidthType.NIL);

            // 获取到刚刚插入的行
            XWPFTableRow row1 = table1.getRow(0);
            // 设置单元格内容
            row1.getCell(0).setText("问题描述");
            row1.getCell(1).setText("问题等级");


            table1.setWidth("8000");
            doc.setTable(0, table1);

            String filePath = "D:\\simple.docx";
            row1=  table1.getRow(1);
            XWPFTableCell cell = row1.getCell(2);
            List<XWPFParagraph> paragraphs = cell.getParagraphs();
            XWPFParagraph newPara = paragraphs.get(0);
            XWPFRun imageCellRunn = newPara.createRun();
            imageCellRunn.addPicture(new FileInputStream("d:/git  修改的文件.jpg"), XWPFDocument.PICTURE_TYPE_PNG, "1.png", Units.toEMU(100), Units.toEMU(50));

            out = new FileOutputStream(new File(filePath));
            doc.write(out);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }

    }*/
}
