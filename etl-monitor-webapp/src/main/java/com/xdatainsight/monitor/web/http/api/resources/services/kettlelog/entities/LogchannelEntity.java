package com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities;

import java.util.Date;

/**
 * Created by ljlsh on 2016/11/30.
 */
public class LogchannelEntity {
    private Integer idBatch;
    private String channelId;
    private Date logDate;
    private String loggingObjectType;
    private String objectName;
    private String objectCopy;
    private String repositoryDirectory;
    private String filename;
    private String objectId;
    private String objectRevision;
    private String parentChannelId;
    private String rootChannelId;

    public Integer getIdBatch() {
        return idBatch;
    }

    public void setIdBatch(Integer idBatch) {
        this.idBatch = idBatch;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public Date getLogDate() {
        return logDate;
    }

    public void setLogDate(Date logDate) {
        this.logDate = logDate;
    }

    public String getLoggingObjectType() {
        return loggingObjectType;
    }

    public void setLoggingObjectType(String loggingObjectType) {
        this.loggingObjectType = loggingObjectType;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getObjectCopy() {
        return objectCopy;
    }

    public void setObjectCopy(String objectCopy) {
        this.objectCopy = objectCopy;
    }

    public String getRepositoryDirectory() {
        return repositoryDirectory;
    }

    public void setRepositoryDirectory(String repositoryDirectory) {
        this.repositoryDirectory = repositoryDirectory;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public String getObjectRevision() {
        return objectRevision;
    }

    public void setObjectRevision(String objectRevision) {
        this.objectRevision = objectRevision;
    }

    public String getParentChannelId() {
        return parentChannelId;
    }

    public void setParentChannelId(String parentChannelId) {
        this.parentChannelId = parentChannelId;
    }

    public String getRootChannelId() {
        return rootChannelId;
    }

    public void setRootChannelId(String rootChannelId) {
        this.rootChannelId = rootChannelId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LogchannelEntity that = (LogchannelEntity) o;

        if (idBatch != null ? !idBatch.equals(that.idBatch) : that.idBatch != null) return false;
        if (channelId != null ? !channelId.equals(that.channelId) : that.channelId != null) return false;
        if (logDate != null ? !logDate.equals(that.logDate) : that.logDate != null) return false;
        if (loggingObjectType != null ? !loggingObjectType.equals(that.loggingObjectType) : that.loggingObjectType != null)
            return false;
        if (objectName != null ? !objectName.equals(that.objectName) : that.objectName != null) return false;
        if (objectCopy != null ? !objectCopy.equals(that.objectCopy) : that.objectCopy != null) return false;
        if (repositoryDirectory != null ? !repositoryDirectory.equals(that.repositoryDirectory) : that.repositoryDirectory != null)
            return false;
        if (filename != null ? !filename.equals(that.filename) : that.filename != null) return false;
        if (objectId != null ? !objectId.equals(that.objectId) : that.objectId != null) return false;
        if (objectRevision != null ? !objectRevision.equals(that.objectRevision) : that.objectRevision != null)
            return false;
        if (parentChannelId != null ? !parentChannelId.equals(that.parentChannelId) : that.parentChannelId != null)
            return false;
        if (rootChannelId != null ? !rootChannelId.equals(that.rootChannelId) : that.rootChannelId != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idBatch != null ? idBatch.hashCode() : 0;
        result = 31 * result + (channelId != null ? channelId.hashCode() : 0);
        result = 31 * result + (logDate != null ? logDate.hashCode() : 0);
        result = 31 * result + (loggingObjectType != null ? loggingObjectType.hashCode() : 0);
        result = 31 * result + (objectName != null ? objectName.hashCode() : 0);
        result = 31 * result + (objectCopy != null ? objectCopy.hashCode() : 0);
        result = 31 * result + (repositoryDirectory != null ? repositoryDirectory.hashCode() : 0);
        result = 31 * result + (filename != null ? filename.hashCode() : 0);
        result = 31 * result + (objectId != null ? objectId.hashCode() : 0);
        result = 31 * result + (objectRevision != null ? objectRevision.hashCode() : 0);
        result = 31 * result + (parentChannelId != null ? parentChannelId.hashCode() : 0);
        result = 31 * result + (rootChannelId != null ? rootChannelId.hashCode() : 0);
        return result;
    }
}
