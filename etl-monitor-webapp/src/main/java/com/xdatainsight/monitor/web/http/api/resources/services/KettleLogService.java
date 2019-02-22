package com.xdatainsight.monitor.web.http.api.resources.services;

import com.xdatainsight.monitor.hibernate.HibernateUtil;
import com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities.OperationlogEntity;
import com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities.PackageExecLogEntity;
import com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities.SteplogEntity;
import com.xdatainsight.monitor.web.http.api.resources.utils.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.*;
import org.pentaho.platform.api.scheduler2.Job;
import org.pentaho.platform.api.scheduler2.SchedulerException;

import java.util.*;

public class KettleLogService {



    public List getScheduledDate(String pathId) {
        String path = FileUtils.idToPath(pathId);
        String name = FilenameUtils.getBaseName(path);
        String extension = FilenameUtils.getExtension(path);
        if(extension.equalsIgnoreCase("ktr")) {
            return getTransScheduledDate(name);
        } else if(extension.equalsIgnoreCase("kjb")) {
            return getJobScheduledDate(name);
        } else {
            return new ArrayList<Date>();
        }
    }


    public Map getDetailLogs(String pathId, String channelId) {
        Map<String,List> result = new HashMap<String,List>();
        String path = FileUtils.idToPath(pathId);
        String extension = FilenameUtils.getExtension(path);
        if(extension.equalsIgnoreCase("ktr")) {
            result.put("translog",getTransLogByChannelId(channelId));
            result.put("steplog",getStepLogByChannelId(channelId));
        } else if(extension.equalsIgnoreCase("kjb")) {
            result.put("joblog",getJobLogByChannelId(channelId));
            result.put("jobsteplog",getJobStepLogByChannelId(channelId));
            result.put("steplog",getStepLogByChannelId(channelId));
        }
        return result;
    }


    public List getScheduledDateByJobId(String jobId) throws SchedulerException {
        SchedulerService schedulerService = new SchedulerService();
        Job job = schedulerService.getJob(jobId);
        String fileName = job.getJobParams().get("job") == null?
                job.getJobParams().get("transformation")+".ktr":job.getJobParams().get("job")+".kjb";
        String path;
        if(StringUtils.isBlank(((String)job.getJobParams().get("directory")))) {
            path = job.getJobParams().get("directory") + "/" + fileName;
        } else {
            path = "/" + job.getJobParams().get("directory") + "/" + fileName;
        }

        String name = FilenameUtils.getBaseName(path);
        String extension = FilenameUtils.getExtension(path);
        if(extension.equalsIgnoreCase("ktr")) {
            return getTransScheduledDate(name);
        } else if(extension.equalsIgnoreCase("kjb")) {
            return getJobScheduledDate(name);
        } else {
            return new ArrayList<Date>();
        }
    }

    public Map getDetailLogsByJobId(String jobId, String channelId) throws SchedulerException {
        Map<String,List> result = new HashMap<String,List>();
        SchedulerService schedulerService = new SchedulerService();
        Job job = schedulerService.getJob(jobId);
        String fileName = job.getJobParams().get("job") == null?
                job.getJobParams().get("transformation")+".ktr":job.getJobParams().get("job")+".kjb";
        String path;
        if(StringUtils.isBlank(((String)job.getJobParams().get("directory")))) {
            path = job.getJobParams().get("directory") + "/" + fileName;
        } else {
            path = "/" + job.getJobParams().get("directory") + "/" + fileName;
        }
        String extension = FilenameUtils.getExtension(path);
        if(extension.equalsIgnoreCase("ktr")) {
            result.put("translog",getTransLogByChannelId(channelId));
            result.put("steplog",getStepLogByChannelId(channelId));
        } else if(extension.equalsIgnoreCase("kjb")) {
            result.put("joblog",getJobLogByChannelId(channelId));
            result.put("jobsteplog",getJobStepLogByChannelId(channelId));
            result.put("steplog",getStepLogByChannelId(channelId));
        }
        return result;
    }

    public Map getOperationLog(int pageNo, int pageSize, String userId, Date startTime, Date endTime) {
        Map<String,Object> resultMap = new HashMap<>();
        Criteria criteria = HibernateUtil.getSession().createCriteria(OperationlogEntity.class);

        if (userId != null) {
            criteria.add(Restrictions.eq("userId", userId));
        }
        if(startTime != null) {
            criteria.add(Restrictions.ge("addTime",startTime));
        }
        if(endTime != null) {
            criteria.add(Restrictions.le("addTime",endTime));
        }
        long rowCount = (long) criteria.setProjection(
                Projections.rowCount()).uniqueResult();
        criteria.setProjection(null);
        criteria.setFirstResult((pageNo - 1) * pageSize);
        criteria.setMaxResults(pageSize);
        criteria.addOrder(Order.desc("addTime"));
        List result = criteria.list();
        resultMap.put("totalPage",Math.ceil(((double)rowCount/pageSize)));
        resultMap.put("result",result);
        return resultMap;
    }

    public Map getExecStatusCounts(Date startTime, Date endTime) {
        Map<String,Object> resultMap = new HashMap<>();
        Criteria criteria = HibernateUtil.getSession().createCriteria(PackageExecLogEntity.class);
        if(startTime == null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.MONTH, -1);
            startTime = calendar.getTime();
        }
        if (endTime == null) {
            endTime = new Date();
        }
        long rowCount = (long) criteria.add(Restrictions.ge("execTime",startTime))
                .add(Restrictions.le("execTime",endTime))
                .add(Restrictions.eq("success",true))
                .setProjection(Projections.rowCount()).uniqueResult();

        resultMap.put("SUCCESS",rowCount);
        criteria = HibernateUtil.getSession().createCriteria(PackageExecLogEntity.class);
        long rowCount1 = (long) criteria.add(Restrictions.ge("execTime",startTime))
                .add(Restrictions.le("execTime",endTime))
                .add(Restrictions.eq("success",false))
                .setProjection(Projections.rowCount()).uniqueResult();
        resultMap.put("FAIL",rowCount1);
        return resultMap;
    }

    public List getExecStatusDetails(Date startTime, Date endTime) {
        Criteria criteria = HibernateUtil.getSession().createCriteria(PackageExecLogEntity.class);
        if(startTime == null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.MONTH, -1);
            startTime = calendar.getTime();
        }
        if (endTime == null) {
            endTime = new Date();
        }
        return criteria.add(Restrictions.ge("execTime", startTime))
                .add(Restrictions.le("execTime", endTime)).list();
    }

    public Map getExecCount(Date startTime, Date endTime, String subject) {
        if(subject == null) {
            subject = "";
        }
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("subject",subject);
        resultMap.put("tableInput",0L);
        resultMap.put("tableOutput",0L);
        resultMap.put("linesInput",0L);
        resultMap.put("linesOutput",0L);
        if(startTime == null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.MONTH, -1);
            startTime = calendar.getTime();
        }
        if (endTime == null) {
            endTime = new Date();
        }
        String[] splitSubject = subject.split(",");
        for (String s : splitSubject) {
            Criteria criteria;
            long count;
            criteria = HibernateUtil.getSession().createCriteria(SteplogEntity.class);
            count = (long) criteria.add(Restrictions.ge("logDate", startTime))
                    .add(Restrictions.le("logDate", endTime))
                    .add(Restrictions.like("stepname", "%" + s + "%" + "输入%"))
                    .setProjection(Projections.countDistinct("stepname")).uniqueResult();
            resultMap.put("tableInput", count + (long)resultMap.get("tableInput"));

            criteria = HibernateUtil.getSession().createCriteria(SteplogEntity.class);
            count = (long) criteria.add(Restrictions.ge("logDate", startTime))
                    .add(Restrictions.le("logDate", endTime))
                    .add(Restrictions.like("stepname", "%" + s + "%" + "输出%"))
                    .setProjection(Projections.countDistinct("stepname")).uniqueResult();
            resultMap.put("tableOutput", count + (long)resultMap.get("tableOutput"));

            criteria = HibernateUtil.getSession().createCriteria(SteplogEntity.class);
            Object o = criteria.add(Restrictions.ge("logDate", startTime))
                    .add(Restrictions.le("logDate", endTime))
                    .add(Restrictions.like("stepname", "%" + s + "%" + "输入%"))
                    .setProjection(Projections.sum("linesInput")).uniqueResult();
            if (o == null) {
                count = 0;
            } else {
                count = (long) o;
            }
            resultMap.put("linesInput", count + (long)resultMap.get("linesInput"));

            criteria = HibernateUtil.getSession().createCriteria(SteplogEntity.class);
            Object oo = criteria.add(Restrictions.ge("logDate", startTime))
                    .add(Restrictions.le("logDate", endTime))
                    .add(Restrictions.like("stepname", "%" + s + "%" + "输出%"))
                    .setProjection(Projections.sum("linesOutput")).uniqueResult();
            if (oo == null) {
                count = 0;
            } else {
                count = (long) oo;
            }
            resultMap.put("linesOutput", count + (long)resultMap.get("linesOutput"));
        }
        return resultMap;
    }

    public List getExecCountDetails(Date startTime, Date endTime, String subject) {
        if(subject == null) {
            subject = "";
        }
        if (subject.contains(",")) {
            List<Map> list = new ArrayList<>();
            for (String s : subject.split(",")) {
                list.add(getExecCount(startTime, endTime, s));
            }
            return list;
        }
        Criteria criteria = HibernateUtil.getSession().createCriteria(SteplogEntity.class);
        if(startTime == null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.MONTH, -1);
            startTime = calendar.getTime();
        }
        if (endTime == null) {
            endTime = new Date();
        }
        return criteria.add(Restrictions.ge("logDate", startTime))
                .add(Restrictions.le("logDate", endTime))
                .add(Restrictions.like("stepname", "%" + subject + "%" + "输%"))
                .list();

    }

    private List getJobLogByChannelId(String channelId) {
        Query query = HibernateUtil.getSession().getNamedQuery("getJobLogByChannelId");
        query.setString("channelId",channelId);
        return query.list();
    }

    private List getTransLogByChannelId(String channelId) {
        Query query = HibernateUtil.getSession().getNamedQuery("getTransLogByChannelId");
        query.setString("channelId",channelId);
        return query.list();
    }

    private List getJobStepLogByChannelId(String channelId) {
        Query query = HibernateUtil.getSession().getNamedQuery("getJobStepLogByChannelId");
        query.setString("channelId",channelId);
        return query.list();
    }

    private List getStepLogByChannelId(String channelId) {
        Query query = HibernateUtil.getSession().getNamedQuery("getStepLogByChannelId");
        query.setString("channelId",channelId);
        return query.list();
    }


    private List getJobScheduledDate(String jobName) {
        Query query = HibernateUtil.getSession().getNamedQuery("getScheduledJobsByName");
        query.setString("jobName",jobName);
        query.setMaxResults(10);
        return query.list();
    }

    private List getTransScheduledDate(String transName) {
        Query query = HibernateUtil.getSession().getNamedQuery("getScheduledTransByName");
        query.setString("transName",transName);
        query.setMaxResults(10);
        return query.list();
    }

}
