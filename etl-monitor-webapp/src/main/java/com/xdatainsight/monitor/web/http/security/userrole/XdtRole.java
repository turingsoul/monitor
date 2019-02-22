package com.xdatainsight.monitor.web.http.security.userrole;

import org.pentaho.platform.api.engine.security.userroledao.IPentahoUser;
import org.pentaho.platform.security.userroledao.PentahoRole;

import java.util.HashSet;
import java.util.Set;

public class XdtRole extends PentahoRole {


    protected XdtRole() {
        // constructor reserved for use by Hibernate
    }
    public XdtRole(String name, String description) {
        super(name, description);
    }
    private Set<IPentahoUser> users = new HashSet<>();

    public void setUsers(Set<IPentahoUser> users) {
        this.users = users;
    }

    public Set<IPentahoUser> getUsers() {
        return users;
    }
}
