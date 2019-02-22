package com.xdatainsight.monitor.web.http.security.userrole;

import org.pentaho.platform.api.engine.security.userroledao.IPentahoRole;
import org.pentaho.platform.security.userroledao.PentahoUser;

import java.util.HashSet;
import java.util.Set;

public class XdtUser extends PentahoUser {


    private Set<IPentahoRole> roles = new HashSet<>();

    protected XdtUser() {
        // constructor reserved for use by Hibernate
    }

    public XdtUser(String username, String password, String description, boolean enabled) {
        super(username, password, description, enabled);
    }

    public void setRoles(Set<IPentahoRole> roles) {
        this.roles = roles;
    }

    public Set<IPentahoRole> getRoles() {
        return roles;
    }

    public boolean addRole(IPentahoRole role) {
        return roles.add(role);
    }

    public boolean removeRole(IPentahoRole role) {
        return roles.remove(role);
    }

    public void clearRoles() {
        roles.clear();
    }
}
