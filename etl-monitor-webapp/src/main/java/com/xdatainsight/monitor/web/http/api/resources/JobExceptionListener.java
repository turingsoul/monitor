package com.xdatainsight.monitor.web.http.api.resources;

import com.xdatainsight.monitor.hibernate.HibernateUtil;
import com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities.PackageExecLogEntity;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.scheduler2.quartz.QuartzJobKey;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

public class JobExceptionListener implements JobListener {

    private static Log log = LogFactory.getLog(JobExceptionListener.class);

    @Override
    public String getName() {
        return "JobExceptionListener";
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {

    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {

    }

    @Override
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {

        if(jobException != null) {
            //SAVE STATUS TO DATABASE
            Session session;
            Transaction tx = null;
            try {
                String fileName = StringUtils.isBlank(context.getJobDetail().getJobDataMap().getString("job"))?
                        context.getJobDetail().getJobDataMap().getString("transformation")+".ktr":context.getJobDetail().getJobDataMap().getString("job")+".kjb";
                PackageExecLogEntity execlog = new PackageExecLogEntity();
                execlog.setSuccess(false);
                execlog.setJobName(QuartzJobKey.parse(context.getJobDetail().getName()).getJobName());
                execlog.setExecTime(context.getFireTime());
                String directory = context.getJobDetail().getJobDataMap().getString("directory");
                if(!StringUtils.isBlank(directory)) {
                    directory = directory + "/";
                }
                execlog.setKettlePackageName("/"
                        + directory
                        + fileName);
                session = HibernateUtil.getSession();
                tx = session.beginTransaction();
                session.save(execlog);
                tx.commit();
            }catch (Throwable e) {
                log.warn("error while saving package exec status to database, continue...",e);
                if(tx != null) {
                    tx.rollback();
                }
            }

            String warnUrl = PentahoSystem.getSystemSetting("warn-url","");
            String appName = PentahoSystem.getSystemSetting("app-name","ETL");
            String warnMessage = PentahoSystem.getSystemSetting("warn-message","{\"AppName\":\"%s\",\"WarnDetails\":\"%s\",\"WarnLevel\":\"%s\",\"WarnTime\":\"%s\"}");
            String defaultWarnLevel = PentahoSystem.getSystemSetting("default-warn-level","非常严重");
            String warnLevelMap = PentahoSystem.getSystemSetting("warn-level-map","").replaceAll(";","\n");
            //NOTIFY THE WARNING SYSTEM
            HttpClient client =  new HttpClient();
            PostMethod method = new PostMethod(warnUrl);

            String warnLevel = defaultWarnLevel;
            Properties properties = new Properties();
            try {
                properties.load(new StringReader(warnLevelMap));
            } catch (IOException e) {
                log.warn("error while loading warnLevelMap,using default warn level",e);
            }

            String directory = "/" + context.getJobDetail().getJobDataMap().getString("directory");
            if( StringUtils.isNotBlank(directory)) {
                for (Object o : properties.keySet()) {
                    if (directory.toLowerCase().contains(((String) o).toLowerCase())) {
                        warnLevel = (String) properties.get(o);
                        break;
                    }
                }
            }

            String sentMessage="";
            try {
                if(!StringUtils.isBlank(directory)) {
                    directory = directory + "/";
                }
                String fileName = StringUtils.isBlank(context.getJobDetail().getJobDataMap().getString("job"))?
                        context.getJobDetail().getJobDataMap().getString("transformation")+".ktr":context.getJobDetail().getJobDataMap().getString("job")+".kjb";
                String packageName = directory + fileName;
                sentMessage = String.format(warnMessage, appName,
                        "任务:" + QuartzJobKey.parse(context.getJobDetail().getName()).getJobName()+"执行出错\r\n转换为:"+ packageName + "\r\n" + ExceptionUtils.getFullStackTrace(jobException),
                        warnLevel,
                        new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
                StringRequestEntity requestEntity = new StringRequestEntity(
                        sentMessage,
                        "application/json",
                        "UTF-8");
                method.setRequestEntity(requestEntity);
                client.executeMethod(method);
            } catch (Exception e) {
                log.warn("error sending warn message:" + sentMessage + " to url:"+ warnUrl +"",e);
            }

        } else {
            Session session;
            Transaction tx = null;
            try {
                String fileName = StringUtils.isBlank(context.getJobDetail().getJobDataMap().getString("job"))?
                        context.getJobDetail().getJobDataMap().getString("transformation")+".ktr":context.getJobDetail().getJobDataMap().getString("job")+".kjb";
                PackageExecLogEntity execlog = new PackageExecLogEntity();
                execlog.setSuccess(true);
                execlog.setJobName(QuartzJobKey.parse(context.getJobDetail().getName()).getJobName());
                execlog.setExecTime(context.getFireTime());
                String directory = context.getJobDetail().getJobDataMap().getString("directory");
                if(!StringUtils.isBlank(directory)) {
                    directory = directory + "/";
                }
                execlog.setKettlePackageName("/"
                        + directory
                        + fileName);
                session = HibernateUtil.getSession();
                tx = session.beginTransaction();
                session.save(execlog);
                tx.commit();
            }catch (Throwable e) {
                log.warn("error while saving package exec status to database, continue...",e);
                if(tx != null) {
                    tx.rollback();
                }
            }
        }
    }
}
