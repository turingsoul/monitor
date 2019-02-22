package com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities;

import java.util.Date;

public class PackageExecLogEntity {
    private int id;
    private String jobName;
    private String kettlePackageName;
    private Boolean success;
    private Date execTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getKettlePackageName() {
        return kettlePackageName;
    }

    public void setKettlePackageName(String kettlePackageName) {
        this.kettlePackageName = kettlePackageName;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public Date getExecTime() {
        return execTime;
    }

    public void setExecTime(Date execTime) {
        this.execTime = execTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PackageExecLogEntity that = (PackageExecLogEntity) o;

        if (id != that.id) return false;
        if (jobName != null ? !jobName.equals(that.jobName) : that.jobName != null) return false;
        if (kettlePackageName != null ? !kettlePackageName.equals(that.kettlePackageName) : that.kettlePackageName != null)
            return false;
        if (success != null ? !success.equals(that.success) : that.success != null) return false;
        if (execTime != null ? !execTime.equals(that.execTime) : that.execTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (jobName != null ? jobName.hashCode() : 0);
        result = 31 * result + (kettlePackageName != null ? kettlePackageName.hashCode() : 0);
        result = 31 * result + (success != null ? success.hashCode() : 0);
        result = 31 * result + (execTime != null ? execTime.hashCode() : 0);
        return result;
    }
}
