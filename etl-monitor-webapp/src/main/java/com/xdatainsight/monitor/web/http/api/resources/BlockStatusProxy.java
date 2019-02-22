package com.xdatainsight.monitor.web.http.api.resources;

import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class BlockStatusProxy {
    Boolean totallyBlocked;
    Boolean partiallyBlocked;

    public BlockStatusProxy() {
        this( false, false );
    }

    public BlockStatusProxy( Boolean totallyBlocked, Boolean partiallyBlocked ) {
        super();
        this.totallyBlocked = totallyBlocked;
        this.partiallyBlocked = partiallyBlocked;
    }

    public Boolean getTotallyBlocked() {
        return totallyBlocked;
    }

    public void setTotallyBlocked( Boolean totallyBlocked ) {
        this.totallyBlocked = totallyBlocked;
    }

    public Boolean getPartiallyBlocked() {
        return partiallyBlocked;
    }

    public void setPartiallyBlocked( Boolean partiallyBlocked ) {
        this.partiallyBlocked = partiallyBlocked;
    }
}
