package com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities;

import java.util.Date;

/**
 * Created by ljlsh on 2016/11/30.
 */
public class TranslogEntity {
    private Integer idBatch;
    private String channelId;
    private String transname;
    private String status;
    private Long linesRead;
    private Long linesWritten;
    private Long linesUpdated;
    private Long linesInput;
    private Long linesOutput;
    private Long linesRejected;
    private Long errors;
    private Date startdate;
    private Date enddate;
    private Date logdate;
    private Date depdate;
    private Date replaydate;
    private String logField;
    private String executingServer;
    private String executingUser;
    private String client;

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

    public String getTransname() {
        return transname;
    }

    public void setTransname(String transname) {
        this.transname = transname;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getLinesRead() {
        return linesRead;
    }

    public void setLinesRead(Long linesRead) {
        this.linesRead = linesRead;
    }

    public Long getLinesWritten() {
        return linesWritten;
    }

    public void setLinesWritten(Long linesWritten) {
        this.linesWritten = linesWritten;
    }

    public Long getLinesUpdated() {
        return linesUpdated;
    }

    public void setLinesUpdated(Long linesUpdated) {
        this.linesUpdated = linesUpdated;
    }

    public Long getLinesInput() {
        return linesInput;
    }

    public void setLinesInput(Long linesInput) {
        this.linesInput = linesInput;
    }

    public Long getLinesOutput() {
        return linesOutput;
    }

    public void setLinesOutput(Long linesOutput) {
        this.linesOutput = linesOutput;
    }

    public Long getLinesRejected() {
        return linesRejected;
    }

    public void setLinesRejected(Long linesRejected) {
        this.linesRejected = linesRejected;
    }

    public Long getErrors() {
        return errors;
    }

    public void setErrors(Long errors) {
        this.errors = errors;
    }

    public Date getStartdate() {
        return startdate;
    }

    public void setStartdate(Date startdate) {
        this.startdate = startdate;
    }

    public Date getEnddate() {
        return enddate;
    }

    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }

    public Date getLogdate() {
        return logdate;
    }

    public void setLogdate(Date logdate) {
        this.logdate = logdate;
    }

    public Date getDepdate() {
        return depdate;
    }

    public void setDepdate(Date depdate) {
        this.depdate = depdate;
    }

    public Date getReplaydate() {
        return replaydate;
    }

    public void setReplaydate(Date replaydate) {
        this.replaydate = replaydate;
    }

    public String getLogField() {
        return logField;
    }

    public void setLogField(String logField) {
        this.logField = logField;
    }

    public String getExecutingServer() {
        return executingServer;
    }

    public void setExecutingServer(String executingServer) {
        this.executingServer = executingServer;
    }

    public String getExecutingUser() {
        return executingUser;
    }

    public void setExecutingUser(String executingUser) {
        this.executingUser = executingUser;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TranslogEntity that = (TranslogEntity) o;

        if (idBatch != null ? !idBatch.equals(that.idBatch) : that.idBatch != null) return false;
        if (channelId != null ? !channelId.equals(that.channelId) : that.channelId != null) return false;
        if (transname != null ? !transname.equals(that.transname) : that.transname != null) return false;
        if (status != null ? !status.equals(that.status) : that.status != null) return false;
        if (linesRead != null ? !linesRead.equals(that.linesRead) : that.linesRead != null) return false;
        if (linesWritten != null ? !linesWritten.equals(that.linesWritten) : that.linesWritten != null) return false;
        if (linesUpdated != null ? !linesUpdated.equals(that.linesUpdated) : that.linesUpdated != null) return false;
        if (linesInput != null ? !linesInput.equals(that.linesInput) : that.linesInput != null) return false;
        if (linesOutput != null ? !linesOutput.equals(that.linesOutput) : that.linesOutput != null) return false;
        if (linesRejected != null ? !linesRejected.equals(that.linesRejected) : that.linesRejected != null)
            return false;
        if (errors != null ? !errors.equals(that.errors) : that.errors != null) return false;
        if (startdate != null ? !startdate.equals(that.startdate) : that.startdate != null) return false;
        if (enddate != null ? !enddate.equals(that.enddate) : that.enddate != null) return false;
        if (logdate != null ? !logdate.equals(that.logdate) : that.logdate != null) return false;
        if (depdate != null ? !depdate.equals(that.depdate) : that.depdate != null) return false;
        if (replaydate != null ? !replaydate.equals(that.replaydate) : that.replaydate != null) return false;
        if (logField != null ? !logField.equals(that.logField) : that.logField != null) return false;
        if (executingServer != null ? !executingServer.equals(that.executingServer) : that.executingServer != null)
            return false;
        if (executingUser != null ? !executingUser.equals(that.executingUser) : that.executingUser != null)
            return false;
        if (client != null ? !client.equals(that.client) : that.client != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idBatch != null ? idBatch.hashCode() : 0;
        result = 31 * result + (channelId != null ? channelId.hashCode() : 0);
        result = 31 * result + (transname != null ? transname.hashCode() : 0);
        result = 31 * result + (status != null ? status.hashCode() : 0);
        result = 31 * result + (linesRead != null ? linesRead.hashCode() : 0);
        result = 31 * result + (linesWritten != null ? linesWritten.hashCode() : 0);
        result = 31 * result + (linesUpdated != null ? linesUpdated.hashCode() : 0);
        result = 31 * result + (linesInput != null ? linesInput.hashCode() : 0);
        result = 31 * result + (linesOutput != null ? linesOutput.hashCode() : 0);
        result = 31 * result + (linesRejected != null ? linesRejected.hashCode() : 0);
        result = 31 * result + (errors != null ? errors.hashCode() : 0);
        result = 31 * result + (startdate != null ? startdate.hashCode() : 0);
        result = 31 * result + (enddate != null ? enddate.hashCode() : 0);
        result = 31 * result + (logdate != null ? logdate.hashCode() : 0);
        result = 31 * result + (depdate != null ? depdate.hashCode() : 0);
        result = 31 * result + (replaydate != null ? replaydate.hashCode() : 0);
        result = 31 * result + (logField != null ? logField.hashCode() : 0);
        result = 31 * result + (executingServer != null ? executingServer.hashCode() : 0);
        result = 31 * result + (executingUser != null ? executingUser.hashCode() : 0);
        result = 31 * result + (client != null ? client.hashCode() : 0);
        return result;
    }
}
