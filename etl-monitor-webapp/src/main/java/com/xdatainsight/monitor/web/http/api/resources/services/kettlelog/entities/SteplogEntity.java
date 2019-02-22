package com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities;

import java.util.Date;

/**
 * Created by ljlsh on 2016/11/30.
 */
public class SteplogEntity {
    private Integer idBatch;
    private String channelId;
    private Date logDate;
    private String transname;
    private String stepname;
    private Integer stepCopy;
    private Long linesRead;
    private Long linesWritten;
    private Long linesUpdated;
    private Long linesInput;
    private Long linesOutput;
    private Long linesRejected;
    private Long errors;
    private String logField;

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

    public String getTransname() {
        return transname;
    }

    public void setTransname(String transname) {
        this.transname = transname;
    }

    public String getStepname() {
        return stepname;
    }

    public void setStepname(String stepname) {
        this.stepname = stepname;
    }

    public Integer getStepCopy() {
        return stepCopy;
    }

    public void setStepCopy(Integer stepCopy) {
        this.stepCopy = stepCopy;
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

    public String getLogField() {
        return logField;
    }

    public void setLogField(String logField) {
        this.logField = logField;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SteplogEntity that = (SteplogEntity) o;

        if (idBatch != null ? !idBatch.equals(that.idBatch) : that.idBatch != null) return false;
        if (channelId != null ? !channelId.equals(that.channelId) : that.channelId != null) return false;
        if (logDate != null ? !logDate.equals(that.logDate) : that.logDate != null) return false;
        if (transname != null ? !transname.equals(that.transname) : that.transname != null) return false;
        if (stepname != null ? !stepname.equals(that.stepname) : that.stepname != null) return false;
        if (stepCopy != null ? !stepCopy.equals(that.stepCopy) : that.stepCopy != null) return false;
        if (linesRead != null ? !linesRead.equals(that.linesRead) : that.linesRead != null) return false;
        if (linesWritten != null ? !linesWritten.equals(that.linesWritten) : that.linesWritten != null) return false;
        if (linesUpdated != null ? !linesUpdated.equals(that.linesUpdated) : that.linesUpdated != null) return false;
        if (linesInput != null ? !linesInput.equals(that.linesInput) : that.linesInput != null) return false;
        if (linesOutput != null ? !linesOutput.equals(that.linesOutput) : that.linesOutput != null) return false;
        if (linesRejected != null ? !linesRejected.equals(that.linesRejected) : that.linesRejected != null)
            return false;
        if (errors != null ? !errors.equals(that.errors) : that.errors != null) return false;
        if (logField != null ? !logField.equals(that.logField) : that.logField != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idBatch != null ? idBatch.hashCode() : 0;
        result = 31 * result + (channelId != null ? channelId.hashCode() : 0);
        result = 31 * result + (logDate != null ? logDate.hashCode() : 0);
        result = 31 * result + (transname != null ? transname.hashCode() : 0);
        result = 31 * result + (stepname != null ? stepname.hashCode() : 0);
        result = 31 * result + (stepCopy != null ? stepCopy.hashCode() : 0);
        result = 31 * result + (linesRead != null ? linesRead.hashCode() : 0);
        result = 31 * result + (linesWritten != null ? linesWritten.hashCode() : 0);
        result = 31 * result + (linesUpdated != null ? linesUpdated.hashCode() : 0);
        result = 31 * result + (linesInput != null ? linesInput.hashCode() : 0);
        result = 31 * result + (linesOutput != null ? linesOutput.hashCode() : 0);
        result = 31 * result + (linesRejected != null ? linesRejected.hashCode() : 0);
        result = 31 * result + (errors != null ? errors.hashCode() : 0);
        result = 31 * result + (logField != null ? logField.hashCode() : 0);
        return result;
    }
}
