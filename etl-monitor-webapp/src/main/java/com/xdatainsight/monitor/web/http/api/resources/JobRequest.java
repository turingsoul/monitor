package com.xdatainsight.monitor.web.http.api.resources;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement
public class JobRequest implements Serializable {

    private static final long serialVersionUID = 6111578259094385262L;

    private String jobId;

    public JobRequest() {
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId( String jobId ) {
        this.jobId = jobId;
    }

}
