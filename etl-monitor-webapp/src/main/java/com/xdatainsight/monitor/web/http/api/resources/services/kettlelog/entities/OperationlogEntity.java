package com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities;

import java.util.Date;

/**
 * Created by xiaobaibai on 2017/3/16.
 */
public class OperationlogEntity {
    private int id;
    private String sessionId;
    private String userId;
    private String ipAddr;
    private String url;
    private String action;
    private String object;
    private String objectType;
    private String contents;
    private Date addTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getIpAddr() {
        return ipAddr;
    }

    public void setIpAddr(String ipAddr) {
        this.ipAddr = ipAddr;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }

    public String getObjectType() {
        return objectType;
    }

    public void setObjectType(String objectType) {
        this.objectType = objectType;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OperationlogEntity that = (OperationlogEntity) o;

        if (id != that.id) return false;
        if (sessionId != null ? !sessionId.equals(that.sessionId) : that.sessionId != null) return false;
        if (userId != null ? !userId.equals(that.userId) : that.userId != null) return false;
        if (ipAddr != null ? !ipAddr.equals(that.ipAddr) : that.ipAddr != null) return false;
        if (url != null ? !url.equals(that.url) : that.url != null) return false;
        if (action != null ? !action.equals(that.action) : that.action != null) return false;
        if (object != null ? !object.equals(that.object) : that.object != null) return false;
        if (objectType != null ? !objectType.equals(that.objectType) : that.objectType != null) return false;
        if (contents != null ? !contents.equals(that.contents) : that.contents != null) return false;
        if (addTime != null ? !addTime.equals(that.addTime) : that.addTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (sessionId != null ? sessionId.hashCode() : 0);
        result = 31 * result + (userId != null ? userId.hashCode() : 0);
        result = 31 * result + (ipAddr != null ? ipAddr.hashCode() : 0);
        result = 31 * result + (url != null ? url.hashCode() : 0);
        result = 31 * result + (action != null ? action.hashCode() : 0);
        result = 31 * result + (object != null ? object.hashCode() : 0);
        result = 31 * result + (objectType != null ? objectType.hashCode() : 0);
        result = 31 * result + (contents != null ? contents.hashCode() : 0);
        result = 31 * result + (addTime != null ? addTime.hashCode() : 0);
        return result;
    }
}

