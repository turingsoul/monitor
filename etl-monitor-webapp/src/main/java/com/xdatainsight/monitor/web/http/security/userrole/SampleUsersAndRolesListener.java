package com.xdatainsight.monitor.web.http.security.userrole;

import com.xdatainsight.monitor.web.http.security.userrole.userroledao.UserRoleDaoTransactionDecorator;
import org.pentaho.platform.api.engine.IPentahoSession;
import org.pentaho.platform.api.engine.IPentahoSystemListener;
import org.pentaho.platform.api.engine.security.userroledao.IUserRoleDao;
import org.pentaho.platform.api.engine.security.userroledao.UncategorizedUserRoleDaoException;
import org.pentaho.platform.engine.core.system.PentahoSystem;


public class SampleUsersAndRolesListener implements IPentahoSystemListener {
    @Override
    public boolean startup(IPentahoSession iPentahoSession) {
        IUserRoleDao userRoleDao = PentahoSystem.get(IUserRoleDao.class, "IUserRoleDao", iPentahoSession);
        if (userRoleDao instanceof UserRoleDaoTransactionDecorator) {
            try {
                boolean noUsers = userRoleDao.getUsers().isEmpty();

                if (noUsers) {
                    XdtRole adminRole = new XdtRole("Administrator", "Super User");
                    XdtRole anonymous = new XdtRole("Anonymous", "User has not logged in");
                    XdtRole authenticated = new XdtRole("Authenticated", "User has logged in");

                    userRoleDao.createRole(null,adminRole.getName(),adminRole.getDescription(),null);
                    userRoleDao.createRole(null,anonymous.getName(),anonymous.getDescription(),null);
                    userRoleDao.createRole(null,authenticated.getName(),authenticated.getDescription(),null);

                    XdtUser admin = new XdtUser("admin", "password", null, true);
                    admin.addRole(adminRole);
                    admin.addRole(authenticated);

                    userRoleDao.createUser(null,admin.getUsername(),admin.getPassword(),admin.getDescription(),null);
                }
            } catch (UncategorizedUserRoleDaoException ignore) {
                // log error and simply return
                return false;
            }
        }
        return true;
    }

    @Override
    public void shutdown() {

    }
}
