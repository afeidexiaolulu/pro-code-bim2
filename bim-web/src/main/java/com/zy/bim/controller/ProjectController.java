package com.zy.bim.controller;

import com.zy.bim.service.ModelService;
import org.apache.commons.lang3.StringUtils;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zy.bim.bean.Problem;
import com.zy.bim.bean.Project;
import com.zy.bim.bean.User;
import com.zy.bim.service.ProjectService;
import com.zy.bim.util.Const;
import com.zy.bim.util.FileUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Encoder;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author 王文强
 * 项目控制层
 * @title: permissionController
 * @emal 17600817572@163.com
 * @date 2019/7/3 000316:14
 */
@Controller
@RequestMapping("/bim/project")
public class ProjectController extends BaseController {

    private  static Logger log= LoggerFactory.getLogger(ProjectController.class);

    private final  static  String ADMIN="1";

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ModelService modelService;

    @Value("${filePath.tempWorkBasePath}")
    public String save;

    @Value("${filePath.transformationFilePath}")
    public String transformationFilePath;

    //跳转到项目页面
    @RequestMapping("/projectHome")
    public String toprojectHome(){
        return "ProjectHome/ProjectHome";
    }

    //跳转到项目新增
    @RequestMapping("/addProjectHome")
    public String toNewProjects(){
        return "ProjectHome/addProjectHome";
    }

    //跳转到项目详情
    @RequestMapping("/details")
    public String toSeeDetails(){
        return "ProjectHome/details";
    }


    /**
     * 创建项目
     */
    @RequestMapping("/create")
    @ResponseBody
    public Object createProject(HttpServletRequest request,@RequestParam(value= "file",required=false) MultipartFile file) throws ParseException {
        String projectName = request.getParameter("projectName");//项目名字
        //项目地址
        String projectAddress = request.getParameter("ProjectAddress");
        //描述
        String projectDescription = request.getParameter("projectDescription");
        String projectManager = request.getParameter("project_manager");//项目经理  id
        User user = (User)request.getSession().getAttribute(Const.LOGIN_USER);
        Project project=new Project();
        project.setCreatePerson(user.getId().toString());
       // project.setCreatePerson("1");
        project.setProjectName(projectName);
        project.setProjectAddress(projectAddress);
        project.setProjectDescription(projectDescription);
        project.setProjectManager(projectManager);
        project.setCreateTime( time());

        star();
        try {
            //判断 图片是否存在
            if (StringUtils.isNotBlank(file.getOriginalFilename())&&file.getOriginalFilename()!=null){
                    String filename = file.getOriginalFilename();
             /*   System.out.println(imageChangeBase64(filename));*/
                    if (filename.contains(".")){
                        int i = filename.lastIndexOf(".");
                        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");//设置日期格式
                        String date = df.format(new Date());// new Date()为获取当前系统时间，也可使用当前时间戳
                        System.out.println(date);
                        filename=UUID.randomUUID().toString()+filename.substring(i,filename.length());
                    }
                File fileDir = FileUtil.getImgDirFile(save+"/bimImg");
                // 构建真实的文件路径
                File newFile = new File(fileDir.getAbsolutePath() + File.separator + filename);
                System.out.println(newFile.getAbsolutePath());
                project.setImg("/bimImg/"+filename);
                // 上传图片到 -》 “绝对路径”
                file.transferTo(newFile);
            }
            projectService.addproject(project);
            success(true);
            message("项目创建成功!");
        } catch (Exception e) {
            e.printStackTrace();
            log.error("项目创建失败"+e.getMessage());
            success(false);
            message("项目创建失败!");
        }
        return end();
    }

    /**
     * 图片转BASE64
     * @param imagePath 路径
     * @return
     */
    public String imageChangeBase64(String imagePath){
        InputStream inputStream = null;
        byte[] data = null;
        try {
            inputStream = new FileInputStream(imagePath);
            data = new byte[inputStream.available()];
            inputStream.read(data);
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 加密
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(data);
    }

    @RequestMapping("add")
    public String add(){
        return  "add";
    }

    /**
     * 修改项目
     * @param request
     * @return
     */
    @RequestMapping("/update")
    @ResponseBody
    public Object update(HttpServletRequest request,@RequestParam(value= "file",required=false) MultipartFile file){
        star();
        try {
            //地址
            String projectAddress = request.getParameter("ProjectAddress");
            //项目信息
            String projectDescription = request.getParameter("projectDescription");
            String projectName = request.getParameter("projectName");
            //项目id
            String projectId = request.getParameter("projectId");
            Project project=new Project();
            project.setId(Integer.valueOf(projectId));
            User user = (User) request.getSession().getAttribute(Const.LOGIN_USER);
            project.setProjectAddress(projectAddress);
            project.setProjectDescription(projectDescription);
            project.setProjectName(projectName);
            project.setUpdatePerson(user.getId().toString());
            project.setUpdateTime(time());

            //判断是否有附件
            if(file != null){
                //判断 图片是否存在,未删除原图,只覆盖原图地址
                if (StringUtils.isNotBlank(file.getOriginalFilename())&&file.getOriginalFilename()!=null){
                    String filename = file.getOriginalFilename();
                    /*   System.out.println(imageChangeBase64(filename));*/
                    if (filename.contains(".")){
                        int i = filename.lastIndexOf(".");
                        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");//设置日期格式
                        String date = df.format(new Date());// new Date()为获取当前系统时间，也可使用当前时间戳
                        System.out.println(date);
                        filename=UUID.randomUUID().toString()+filename.substring(i,filename.length());
                    }
                    File fileDir = FileUtil.getImgDirFile(save+"/bimImg");
                    // 构建真实的文件路径
                    File newFile = new File(fileDir.getAbsolutePath() + File.separator + filename);
                    System.out.println(newFile.getAbsolutePath());
                    project.setImg("/bimImg/"+filename);
                    // 上传图片到 -》 “绝对路径”
                    file.transferTo(newFile);
                }
            }

            //更新项目
            projectService.updateProject(project);
            success(true);
        }catch (Exception e){
            e.printStackTrace();
            log.error("项目修改失败"+e.getMessage());
            success(false);
            message("修改失败!");
        }
        return  end();
    }


    /**
     * 返回用户
     * @param userName -->用户名 模糊查询
     * @return 返回map
     */
    @RequestMapping("/user")
    @ResponseBody
    public Object user(String userName){
        star();
        try{
            List<Map> list=    projectService.findUser(userName);
            data(list);
            success(true);
        }catch (Exception e){
            e.printStackTrace();
            log.error("查找用户信息报错--->"+e.getMessage());
           success(false);
           message("查询用户失败");
        }
        return  end();
    }

    /**
     * 加载项目
     * @param request
     * @param projectName  ->项目名称搜索
     * @param pageNum ->分页索引下标
     * @param pageSize ->显示数量
     * @param rule   ->排序规则
     * @return
     */
    @RequestMapping("/findAllproject")
    @ResponseBody
    public Object findAllproject(HttpServletRequest request,String projectName,@RequestParam(value="pageNum",defaultValue="1")int pageNum,
                                            @RequestParam(value="pageSize",defaultValue="11")int pageSize,@RequestParam(defaultValue="desc")String rule) {
        star();
      try {
          PageHelper.startPage(pageNum, pageSize);
          PageHelper.orderBy("p.create_time  "+rule);
         String userId = getUserId(request);
          Map<String,String> map=new HashMap<>(16);
          map.put("userId",userId);
          //map.put("userId","1");
          map.put("projectName",projectName);
          List<Project> users=projectService.findAllproject(map);
          PageInfo<Project> pageInfo = new PageInfo<Project>(users);
          success(true);
          data(pageInfo);
      }catch (Exception e){
          e.printStackTrace();
          log.error("查询项目出错"+e.getMessage());
          success(false);
          message("查询项目出错");
      }
      return  end();
    }

    /**
     * 1、查询该用户是否有权限
     * 2、无权限 返回 有权限执行
     * 3、根据项目查询问题 根据问题查询图片
     * @param id ->项目id
     * @param request
     * @return
     */
    @RequestMapping("/delete")
    @ResponseBody
    public Object delete(String id,HttpServletRequest request){
        // 设置hashmap长度
        Map map=new HashMap(16);
        //获取用户id
        map.put("userId",getUserId(request));
       // map.put("userId","1");
        map.put("ProjectId",id);
        map.put("role",ADMIN);
        //查询角色
        Map  role=projectService.findRole(map);
        star();
        try {
            if (null!=role&&!role.isEmpty()){
                //查询该用户的角色信息
                if (role.get("id").toString().equals(ADMIN)){
                    //查询问题
                    List<String> list=projectService.findProblem(map);
                    //查找 问题图片
                    String img="";
                    if (null!=list&&!list.isEmpty()){
                        img =projectService.findProblemImg(list);
                    }
                    if (null!=role.get("img").toString()&&StringUtils.isNotBlank(role.get("img").toString())){
                        if (null!=img&&StringUtils.isNotBlank(img) ){
                            img+=","+role.get("img");
                        }else{
                            img=role.get("img").toString();
                        }
                    }
                    List<Map<String,String>> maplist=projectService.findModelList(map);
                    //转化 调用公共接口 删除项目图片
                    Problem problem=new Problem();

                    if(null!=maplist&&!maplist.isEmpty()){
                        //删除模型
                        deleteModel(maplist);
                    }
                    if (null!=img&&StringUtils.isNotBlank(img)){
                        problem.setProblemScreenshots(img);
                        deleteAll(problem);
                    }
                    //删除数据->项目表->模型表->项目用户角色中间表->问题表->附件表
                    projectService.deleteProjectAll(map,list,maplist);
                    success(true);
                    message("项目删除成功!");
                }else{
                    success(true);
                    message("对不起你不是该项目的项目管理员,无权限删除,请联系该项目管理员进行删除!");
                }
            }else{
                success(true);
                message("对不起你不是该项目的项目管理员,无权限删除,请联系该项目管理员进行删除!");
            }

        }catch ( Exception e){
            e.printStackTrace();
            log.error("删除项目失败!{}"+e.getMessage());
            success(false);
            message("项目删除失败");
        }

        return  end();
    }

    /**
     * 查询项目详情人员列表
     * @param projectId ->项目id
     * @param request
     * @return
     */
    @RequestMapping("/projectDetail")
    @ResponseBody
    public   Object projectDetail(String projectId,HttpServletRequest request){
        star();
        try {
            request.getSession().setAttribute(Const.PROJECT_ID,projectId);
            Project project= projectService.projectDetail(projectId);
            //todo createPersonName原本为单独查询,2019.08.30改为详情sql一起查询
            /*String createPersonId = project.getCreatePerson();
            String createPersonName = projectService.getCreatePersonNameById(createPersonId);
            project.setCreatePersonName(createPersonName);*/
            List<User> users=projectService.projectAllUser(projectId);
            if (users!=null&&users.size()!=0){
                project.setUsers(users);
            }
            success(true);
            data(project);
        }catch (Exception e){
            e.printStackTrace();
            log.error("查询项目详情错误"+e.getMessage());
            success(false);
            message("查询项目详情错误");
        }
        return end();
    }

    /**
     * 项目问题
     * @param projectId -->项目id
     * @param pageNum   -->分页(页数下标)
     * @param pageSize  -->分页(每页显示数量)
     * @return
     */
    @RequestMapping("projectProblem")
    @ResponseBody
    public Object projectProblem(String projectId,@RequestParam(value="pageNum",defaultValue="1")int pageNum,
                                            @RequestParam(value="pageSize",defaultValue="10")int pageSize){
        star();
        try {
            PageHelper.startPage(pageNum, pageSize);
            List<Problem> users=projectService.projectProblem(projectId);
            PageInfo<Problem> pageInfo = new PageInfo<Problem>(users);
            success(true);
            data(pageInfo);
        }catch (Exception e){
            e.printStackTrace();
            log.error("查询项目问题出错"+e.getMessage());
           success(false);
           message("查询项目问题出错");
        }
        return end();
    }

    /**
     * 获取当前登陆人id
     */
    public String getUserId(HttpServletRequest request){
        User user = (User) request.getSession().getAttribute(Const.LOGIN_USER); //session用户
        String userId = user.getId().toString();    //用户id
        return userId;
    }

    /**
     * 获取系统当前时间
     */
    public Date time() throws ParseException {
        SimpleDateFormat dfCreate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        String dateCreate = dfCreate.format(new Date());// new Date()为获取当前系统时间，也可使用当前时间戳
        return dfCreate.parse(dateCreate);
    }

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

    public void deleteModel(List list ){
        for (Iterator it = list.iterator(); it.hasNext(); ) {
            Map map = (Map) it.next();
            File file = new File(map.get("path").toString());
            if (file.exists()&&null!=map.get("path").toString()&&StringUtils.isNotBlank(map.get("path").toString())) {
                file.delete();
            }
            //开始截串位置
            int begin = map.get("path").toString().lastIndexOf("\\")+1;
            //结束截串位置
            int end = map.get("path").toString().lastIndexOf(".");
            String filePath2 = transformationFilePath+"/"+map.get("path").toString().substring(begin,end)+"ToTransformation";
            modelService.deleteFolder(filePath2);
        }
    }
}
