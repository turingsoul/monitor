package com.xdatainsight.monitor.web.http.security.userrole.userrolelistservice;

import java.util.ArrayList;
import java.util.List;

import org.pentaho.platform.api.engine.IUserRoleListService;
import org.pentaho.platform.api.engine.security.userroledao.IPentahoRole;
import org.pentaho.platform.api.engine.security.userroledao.IPentahoUser;
import org.pentaho.platform.api.engine.security.userroledao.IUserRoleDao;
import org.pentaho.platform.api.mt.ITenant;

/**
 * An {@link IUserRoleListService} that delegates to an {@link IUserRoleDao}.
 *
 */
public class UserRoleDaoUserRoleListService implements IUserRoleListService {

    // ~ Static fields/initializers ======================================================================================

    // ~ Instance fields =================================================================================================

    private IUserRoleDao userRoleDao;


    // ~ Constructors ====================================================================================================

    // ~ Methods =========================================================================================================
    @Override
    public List<String> getAllRoles() {
        List<IPentahoRole> roles = userRoleDao.getRoles();

        List<String> auths = new ArrayList<>();

        for (IPentahoRole role : roles) {
            auths.add(role.getName());
        }

        return auths;

    }

    @Override
    public List<String> getSystemRoles() {
        return getAllRoles();
    }

    @Override
    public List<String> getAllRoles(ITenant tenant) {
        return getAllRoles();
    }

    @Override
    public List<String> getAllUsers() {
        List<IPentahoUser> users = userRoleDao.getUsers();

        List<String> usernames = new ArrayList<>();

        for (IPentahoUser user : users) {
            usernames.add(user.getUsername());
        }

        return usernames;
    }

    @Override
    public List<String> getAllUsers(ITenant tenant) {
        return getAllUsers();
    }

    @Override
    public List<String> getUsersInRole(ITenant tenant, String role) {
        List<IPentahoUser> users = userRoleDao.getRoleMembers(tenant, role);
        List<String> usernames = new ArrayList<>();
        for (IPentahoUser user : users) {
            usernames.add(user.getUsername());
        }

        return usernames;
    }

    @Override
    public List<String> getRolesForUser(ITenant tenant, String username) {
        List<IPentahoRole> roles = userRoleDao.getUserRoles(tenant, username);
        List<String> rolenames = new ArrayList<>();
        for (IPentahoRole role : roles) {
            rolenames.add(role.getName());
        }

        return rolenames;
    }


    public void setUserRoleDao(IUserRoleDao userRoleDao) {
        this.userRoleDao = userRoleDao;
    }

}
