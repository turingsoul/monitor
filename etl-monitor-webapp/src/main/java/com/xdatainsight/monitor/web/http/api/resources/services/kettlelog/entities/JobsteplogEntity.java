package com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities;

import java.util.Date;

/**
 * Created by ljlsh on 2016/11/30.
 */
public class JobsteplogEntity {
    private Integer idBatch;
    private String channelId;
    private Date logDate;
    private String transname;
    private String stepname;
    private Long linesRead;
    private Long linesWritten;
    private Long linesUpdated;
    private Long linesInput;
    private Long linesOutput;
    private Long linesRejected;
    private Long errors;
    private Byte result;
    private Long nrResultRows;
    private Long nrResultFiles;
    private String logField;
    private Integer copyNr;

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

    public Byte getResult() {
        return result;
    }

    public void setResult(Byte result) {
        this.result = result;
    }

    public Long getNrResultRows() {
        return nrResultRows;
    }

    public void setNrResultRows(Long nrResultRows) {
        this.nrResultRows = nrResultRows;
    }

    public Long getNrResultFiles() {
        return nrResultFiles;
    }

    public void setNrResultFiles(Long nrResultFiles) {
        this.nrResultFiles = nrResultFiles;
    }

    public String getLogField() {
        return logField;
    }

    public void setLogField(String logField) {
        this.logField = logField;
    }

    public Integer getCopyNr() {
        return copyNr;
    }

    public void setCopyNr(Integer copyNr) {
        this.copyNr = copyNr;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        JobsteplogEntity that = (JobsteplogEntity) o;

        if (idBatch != null ? !idBatch.equals(that.idBatch) : that.idBatch != null) return false;
        if (channelId != null ? !channelId.equals(that.channelId) : that.channelId != null) return false;
        if (logDate != null ? !logDate.equals(that.logDate) : that.logDate != null) return false;
        if (transname != null ? !transname.equals(that.transname) : that.transname != null) return false;
        if (stepname != null ? !stepname.equals(that.stepname) : that.stepname != null) return false;
        if (linesRead != null ? !linesRead.equals(that.linesRead) : that.linesRead != null) return false;
        if (linesWritten != null ? !linesWritten.equals(that.linesWritten) : that.linesWritten != null) return false;
        if (linesUpdated != null ? !linesUpdated.equals(that.linesUpdated) : that.linesUpdated != null) return false;
        if (linesInput != null ? !linesInput.equals(that.linesInput) : that.linesInput != null) return false;
        if (linesOutput != null ? !linesOutput.equals(that.linesOutput) : that.linesOutput != null) return false;
        if (linesRejected != null ? !linesRejected.equals(that.linesRejected) : that.linesRejected != null)
            return false;
        if (errors != null ? !errors.equals(that.errors) : that.errors != null) return false;
        if (result != null ? !result.equals(that.result) : that.result != null) return false;
        if (nrResultRows != null ? !nrResultRows.equals(that.nrResultRows) : that.nrResultRows != null) return false;
        if (nrResultFiles != null ? !nrResultFiles.equals(that.nrResultFiles) : that.nrResultFiles != null)
            return false;
        if (logField != null ? !logField.equals(that.logField) : that.logField != null) return false;
        if (copyNr != null ? !copyNr.equals(that.copyNr) : that.copyNr != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result1 = idBatch != null ? idBatch.hashCode() : 0;
        result1 = 31 * result1 + (channelId != null ? channelId.hashCode() : 0);
        result1 = 31 * result1 + (logDate != null ? logDate.hashCode() : 0);
        result1 = 31 * result1 + (transname != null ? transname.hashCode() : 0);
        result1 = 31 * result1 + (stepname != null ? stepname.hashCode() : 0);
        result1 = 31 * result1 + (linesRead != null ? linesRead.hashCode() : 0);
        result1 = 31 * result1 + (linesWritten != null ? linesWritten.hashCode() : 0);
        result1 = 31 * result1 + (linesUpdated != null ? linesUpdated.hashCode() : 0);
        result1 = 31 * result1 + (linesInput != null ? linesInput.hashCode() : 0);
        result1 = 31 * result1 + (linesOutput != null ? linesOutput.hashCode() : 0);
        result1 = 31 * result1 + (linesRejected != null ? linesRejected.hashCode() : 0);
        result1 = 31 * result1 + (errors != null ? errors.hashCode() : 0);
        result1 = 31 * result1 + (result != null ? result.hashCode() : 0);
        result1 = 31 * result1 + (nrResultRows != null ? nrResultRows.hashCode() : 0);
        result1 = 31 * result1 + (nrResultFiles != null ? nrResultFiles.hashCode() : 0);
        result1 = 31 * result1 + (logField != null ? logField.hashCode() : 0);
        result1 = 31 * result1 + (copyNr != null ? copyNr.hashCode() : 0);
        return result1;
    }
}
