package com.zy.bim.service;

import com.zy.bim.bean.MutilFileInfo;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;

public interface FileManagerService {
    void saveMutiBurstFiletoDir(MutilFileInfo fileinfo, MultipartFile file) throws Exception;

    void saveSingleFiletoDir(MutilFileInfo fileinfo, MultipartFile file) throws Exception;

    String MutilMergingChunks(MutilFileInfo fileinfo,HttpServletRequest request) throws Exception;

    File GenerateDirPathForCurrFile(MutilFileInfo fileinfo, String flag) throws Exception;

    String download(HttpServletRequest request, HttpServletResponse response) throws FileNotFoundException, UnsupportedEncodingException;

    String checkFileMd5(HttpServletRequest request);

    String deltefile(HttpServletRequest request, HttpServletResponse response) throws Exception;
}
