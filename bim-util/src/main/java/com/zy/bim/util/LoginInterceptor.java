package com.zy.bim.util;

import com.zy.bim.bean.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.PrintWriter;
import java.util.ArrayList;

/**
 * @author Liang Wenjie
 * @version 1.00
 * @time 2019/7/4 0004 下午 1:47
 */
@Component
public class LoginInterceptor extends HandlerInterceptorAdapter {

    private static Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);

    //进入controller前进行拦截
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.debug("拦截器正在进行拦截");
        String requestURI = request.getRequestURI();
        ArrayList<String> baiMingDan = new ArrayList<>();
        //登录页面不拦截
        baiMingDan.add("/bim/login");   //去往登陆页不拦截
        baiMingDan.add("/bim/doLogin"); //登陆逻辑验证不拦截
        baiMingDan.add("/bim/weixintDoLogin"); //移动端登录不拦截
        baiMingDan.add("/bim/weixintRegistration"); //移动端注册不拦截
        // 注册也不拦截
        baiMingDan.add("/bim/getUserByPhone");  //注册查询手机号码是否唯一
        baiMingDan.add("/bim/sendMessage");  //短信发送不拦截
        baiMingDan.add("/bim/registerUser");    //注册逻辑不拦截
        baiMingDan.add("/bim/problem/findOne");    //页面详情查询不拦截
        baiMingDan.add("/bim/problem/detailsShare");    //跳转分享的页面详情查询不拦截
        baiMingDan.add("/bim/modelShare/queryLightweightModelPathByModelShareId");    //模型分享查询接口不拦截
        baiMingDan.add("/bim/modelShare/modelLightWeightShare");    //跳转模型分享查询页面不拦截
        if(baiMingDan.contains(requestURI)){
            logger.debug("访问路径白名单，放行，白名单路径为:{}",requestURI);
            return true;
        }else {
            //查看是否登录
            HttpSession session = request.getSession();
            User user = (User)session.getAttribute(Const.LOGIN_USER);
            if(user != null){
                logger.debug("用户已登陆，放行");
                return true;
            }else {
                PrintWriter out = response.getWriter();
                out.println("<html>");
                out.println("<script>");
                out.println("window.open ('"+request.getContextPath()+"/bim/login','_top')");
                out.println("</script>");
                out.println("</html>");
                //response.sendRedirect("/bim/login");
                logger.debug("用户未登陆，重定向到登陆页面");
                return false;
            }
        }
    }
}
