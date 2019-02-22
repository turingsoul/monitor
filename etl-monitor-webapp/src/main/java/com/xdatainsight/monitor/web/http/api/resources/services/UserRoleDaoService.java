package com.xdatainsight.monitor.web.http.api.resources.services;

import org.apache.commons.codec.digest.DigestUtils;
import org.pentaho.platform.api.engine.IUserRoleListService;
import org.pentaho.platform.api.engine.security.userroledao.IPentahoUser;
import org.pentaho.platform.api.engine.security.userroledao.IUserRoleDao;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.pentaho.platform.engine.core.system.PentahoSystem;

import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.StringTokenizer;


public class UserRoleDaoService {

    private IUserRoleListService userRoleListService;

    private IUserRoleDao userRoleDao;

    private Comparator<String> userComparator;





    public List getUsers() {
        IUserRoleListService service = getUserRoleListService();
        List<String> allUsers = service.getAllUsers();
        if ( null != userComparator ) {
            Collections.sort( allUsers, userComparator );
        }
        return allUsers;
    }

    public boolean createUser(String name, String password) {
        IUserRoleDao userRoleDao = getUserRoleDao();
        try {
            userRoleDao.createUser(null, name, password,"",null);
            return true;
        } catch (Throwable e) {
            return false;
        }
    }

    public boolean deleteUsers(String userNames) {
        try {
            IUserRoleDao roleDao = getUserRoleDao();
            StringTokenizer tokenizer = new StringTokenizer( userNames, "\t" );
            while ( tokenizer.hasMoreTokens() ) {
                IPentahoUser user = roleDao.getUser( null, tokenizer.nextToken() );
                if ( user != null ) {
                    roleDao.deleteUser( user );
                }
            }
        } catch ( Throwable e ) {
            return false;
        }
        return true;
    }

    public boolean updatePassword(String username, String password) {
        try {
            IUserRoleDao roleDao = getUserRoleDao();
            IPentahoUser puser = roleDao.getUser( null, username );
            if ( puser != null ) {
                roleDao.setPassword(null, username, password);
                return true;
            }
        } catch ( Throwable e ) {
            return false;
        }
        return false;
    }

    public boolean changePassword(String oldpassword, String newpassword) {
        try {
            IUserRoleDao roleDao = getUserRoleDao();
            String username = PentahoSessionHolder.getSession().getName();
            IPentahoUser puser = roleDao.getUser( null, username );
            if ( puser != null && puser.getPassword().equals(DigestUtils.md5Hex(oldpassword+"{"+username+"}"))) {
                roleDao.setPassword(null, username, newpassword);
                return true;
            }
        } catch ( Throwable e ) {
            return false;
        }
        return false;
    }



    private IUserRoleListService getUserRoleListService() {
        if ( userRoleListService == null ) {
            userRoleListService = PentahoSystem.get( IUserRoleListService.class );
        }
        return userRoleListService;
    }

    private IUserRoleDao getUserRoleDao() {
        if ( userRoleDao == null ) {
            userRoleDao = PentahoSystem.get( IUserRoleDao.class, "IUserRoleDao", PentahoSessionHolder.getSession());
        }
        return userRoleDao;
    }


    public void setUserComparator( Comparator<String> userComparator ) {
        this.userComparator = userComparator;
    }

}

