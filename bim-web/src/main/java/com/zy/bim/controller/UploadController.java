package com.zy.bim.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zy.bim.bean.MutilFileInfo;
import com.zy.bim.service.FileManagerService;
import com.zy.bim.util.MutilFileUploadUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * @version 1.0
 * @author 陈坤鹏
 * @since 2019-07-15
 * @return 大文件分片,断点上传
 */
@Controller
@RequestMapping("/bim/file")
public class UploadController extends BaseController{

	@Autowired
	private FileManagerService fileManagerService;

	/**
	 * 检查文件md5值
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/checkFileMd5")
	@ResponseBody
	public String checkFileMd5(HttpServletRequest request, HttpServletResponse response){
		try {
			String flag = fileManagerService.checkFileMd5(request);
			return flag;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 分片上传
	 * @param fileinfo
	 * @param file
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/uploadFile", method = RequestMethod.POST)
	@ResponseBody
	public Object MutiluploadFile(MutilFileInfo fileinfo, @RequestParam(required=false,value="file")MultipartFile file, HttpServletResponse response) throws Exception {
		star();
		try {
			if(file != null && !file.isEmpty()){
				if(MutilFileUploadUtils.checkMutiFilePremeter(fileinfo)){    //切片上传
					fileManagerService.saveMutiBurstFiletoDir(fileinfo,file);
					success(true);
				}else if(MutilFileUploadUtils.checkSingleFilePremeter(fileinfo)){//单文件整体上传
					fileManagerService.saveSingleFiletoDir(fileinfo,file);
					success(true);
				}else {
					throw new Exception("文件上传参数不合法");
				}
			}else {
				throw new Exception("文件上传附件字节流内容为空");
			}
		} catch (Exception e) {
			success(false);
			e.printStackTrace();
			response.setStatus(500);
		}
		return end();
	}
	/**
	 * callback 通知文件分片合并
	 * @return 返回处理结果，请求头200:成功,500:失败
	 * @throws Exception
	 */
	@RequestMapping(value = "/mergingChunks", method = RequestMethod.POST)
	@ResponseBody
	public Object MutilMergingChunksForFile(MutilFileInfo fileinfo,HttpServletRequest request,HttpServletResponse response) throws Exception {
		Map<String, String> map = new HashMap<>();
		star();
		try {
			String fileAdd = fileManagerService.MutilMergingChunks(fileinfo,request);
			map.put("fileAdd",fileAdd);
			data(map);
			success(true);
			message("文件上传成功");
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
			success(false);
			message("文件上传失败");
		}
		return end();
	}

	/**
	 *
	 * 文件下载
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/download")
	public Map<String, String> download(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, String> map = new HashMap<>();
		try {
			String fileAdd = fileManagerService.download(request,response);
			map.put("fileAdd",fileAdd);
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
		}
		return map;
	}

	/**
	 *
	 * 文件删除
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping("/delete")
	public Map<String, String> delete(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, String> map = new HashMap<>();
		try {
			String fileAdd = fileManagerService.deltefile(request,response);
			map.put("fileAdd",fileAdd);
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
		}
		return map;
	}

	@RequestMapping("/file")
	public String test(){
		return "fileTest";
	}

}