package com.xdatainsight.monitor.web.http.security.userrole.userroledao;


import com.xdatainsight.monitor.web.http.security.userrole.XdtRole;
import com.xdatainsight.monitor.web.http.security.userrole.XdtUser;
import org.pentaho.platform.api.engine.security.userroledao.*;
import org.pentaho.platform.api.mt.ITenant;
import org.pentaho.platform.api.repository.RepositoryException;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import java.util.ArrayList;
import java.util.List;

public class HibernateUserRoleDao extends HibernateDaoSupport implements IUserRoleDao {

    public static final String DEFAULT_ALL_USERS_QUERY = "from XdtUser order by username";

    public static final String DEFAULT_ALL_ROLES_QUERY = "from XdtRole order by name";

    // ~ Instance fields =================================================================================================

    private String allUsersQuery = DEFAULT_ALL_USERS_QUERY;

    private String allRolesQuery = DEFAULT_ALL_ROLES_QUERY;

    private String tenantAdminRoleName;

    private String singleTenantAdminUserName;

    public HibernateUserRoleDao() {
    }

    // ~ Methods =========================================================================================================


    @Override
    public IPentahoUser createUser(ITenant tenant, String username, String password, String description, String[] roles) throws AlreadyExistsException, UncategorizedUserRoleDaoException {

        String passwordEncoded = DigestUtils.md5Hex(password+"{"+username+"}");
        XdtUser userToCreate = new XdtUser(username,passwordEncoded,description,true);
        IPentahoRole roleAdmin = getRole(null, tenantAdminRoleName);
        IPentahoRole roleAuthenticated = getRole(null, "Authenticated");
        userToCreate.addRole(roleAdmin);
        userToCreate.addRole(roleAuthenticated);

        if (getUser(tenant, userToCreate.getUsername()) == null) {
            try {
                getHibernateTemplate().save(userToCreate);
            } catch (DataAccessException e) {
                throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao CREATE USER ERROR", e); //$NON-NLS-1$
            }
        } else {
            throw new AlreadyExistsException(userToCreate.getUsername());
        }
        return getUser(tenant,username);
    }

    @Override
    public void setPassword(ITenant tenant, String userName, String password) throws NotFoundException, UncategorizedUserRoleDaoException {

        IPentahoUser userToUpdate = getUser(tenant, userName);
        if (userToUpdate != null) {
            String passwordEncoded = DigestUtils.md5Hex(password+"{"+userToUpdate.getUsername()+"}");
            userToUpdate.setPassword(passwordEncoded);
            try {
                getHibernateTemplate().update(getHibernateTemplate().merge(userToUpdate));
            } catch (DataAccessException e) {
                throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao CHANGE PASSWORD ERROR", e); //$NON-NLS-1$
            }
        } else {
            throw new NotFoundException(userName);
        }
    }

    @Override
    public void setUserDescription(ITenant tenant, String userName, String description) throws NotFoundException, UncategorizedUserRoleDaoException {

    }

    @Override
    public void deleteUser(IPentahoUser user) throws NotFoundException, UncategorizedUserRoleDaoException {

        IPentahoUser userToDelete = getUser(null, user.getUsername());
        if ( canDeleteUser( userToDelete ) ) {
            try {
                getHibernateTemplate().delete(userToDelete);
            } catch (DataAccessException e) {
                throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao.ERROR_0004_DATA_ACCESS_EXCEPTION", e);
            }
        } else {
            throw new RepositoryException( "AbstractJcrBackedUserRoleDao.ERROR_0004_LAST_USER_NEEDED_IN_ROLE " + tenantAdminRoleName);
        }
    }

    @Override
    public IPentahoUser getUser(ITenant tenant, String name) throws UncategorizedUserRoleDaoException {
        try {
            return (XdtUser) getHibernateTemplate().get(XdtUser.class, name);
        } catch (DataAccessException e) {
            throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao GET USER ERROR", e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoUser> getUsers() throws UncategorizedUserRoleDaoException {
        try {
            return getHibernateTemplate().find(getAllUsersQuery());
        } catch (DataAccessException e) {
            throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao.ERROR_0004_DATA_ACCESS_EXCEPTION", e);
        }
    }

    @Override
    public List<IPentahoUser> getUsers(ITenant tenant) throws UncategorizedUserRoleDaoException {
        return getUsers();
    }

    @Override
    public List<IPentahoUser> getUsers(ITenant tenant, boolean includeSubtenants) throws UncategorizedUserRoleDaoException {
        return getUsers();
    }

    @Override
    public IPentahoRole createRole(ITenant tenant, String roleName, String description, String[] memberUserNames) throws AlreadyExistsException, UncategorizedUserRoleDaoException {
        XdtRole role = new XdtRole(roleName, description);
        if (getRole(tenant, role.getName()) == null) {
            try {
                getHibernateTemplate().save(role);
            } catch (DataAccessException e) {
                throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao CREATE USER ERROR", e); //$NON-NLS-1$
            }
        } else {
            throw new AlreadyExistsException(role.getName());
        }
        return getRole(tenant, roleName);
    }

    @Override
    public void setRoleDescription(ITenant tenant, String roleName, String description) throws NotFoundException, UncategorizedUserRoleDaoException {

    }

    @Override
    public void deleteRole(IPentahoRole role) throws NotFoundException, UncategorizedUserRoleDaoException {

    }

    @Override
    public IPentahoRole getRole(ITenant tenant, String name) throws UncategorizedUserRoleDaoException {

        try {
            return (XdtRole) getHibernateTemplate().get(XdtRole.class, name);
        } catch (DataAccessException e) {
            throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao.ERROR_0004_DATA_ACCESS_EXCEPTION", e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoRole> getRoles() throws UncategorizedUserRoleDaoException {
        try {
            return getHibernateTemplate().find(getAllRolesQuery());
        } catch (DataAccessException e) {
            throw new UncategorizedUserRoleDaoException("HibernateUserRoleDao.ERROR_0004_DATA_ACCESS_EXCEPTION", e);
        }
    }

    @Override
    public List<IPentahoRole> getRoles(ITenant tenant) throws UncategorizedUserRoleDaoException {
        return getRoles();
    }

    @Override
    public List<IPentahoRole> getRoles(ITenant tenant, boolean includeSubtenants) throws UncategorizedUserRoleDaoException {
        return getRoles();
    }

    @Override
    public void setRoleMembers(ITenant tenant, String roleName, String[] memberUserNames) throws NotFoundException, UncategorizedUserRoleDaoException {

    }

    @Override
    public void setUserRoles(ITenant tenant, String userName, String[] roles) throws NotFoundException, UncategorizedUserRoleDaoException {

    }

    @Override
    public List<IPentahoUser> getRoleMembers(ITenant tenant, String roleName) throws UncategorizedUserRoleDaoException {
        XdtRole xdtRole = ((XdtRole) getRole(tenant, roleName));
        return new ArrayList<>(xdtRole.getUsers());

    }

    @Override
    public List<IPentahoRole> getUserRoles(ITenant tenant, String userName) throws UncategorizedUserRoleDaoException {
        XdtUser xdtUser = ((XdtUser) getUser(tenant, userName));
        return new ArrayList<>(xdtUser.getRoles());
    }


    public void setAllUsersQuery(String allUsersQuery) {
        this.allUsersQuery = allUsersQuery;
    }

    public String getAllUsersQuery() {
        return allUsersQuery;
    }

    public void setAllRolesQuery(String allRolesQuery) {
        this.allRolesQuery = allRolesQuery;
    }

    public String getAllRolesQuery() {
        return allRolesQuery;
    }

    public void setTenantAdminRoleName(String tenantAdminRoleName) {
        this.tenantAdminRoleName = tenantAdminRoleName;
    }

    public String getTenantAdminRoleName() {
        return tenantAdminRoleName;
    }

    public void setSingleTenantAdminUserName(String singleTenantAdminUserName) {
        this.singleTenantAdminUserName = singleTenantAdminUserName;
    }

    public String getSingleTenantAdminUserName() {
        return singleTenantAdminUserName;
    }

    private boolean canDeleteUser( final IPentahoUser user ) {
        boolean userHasAdminRole = false;
        List<IPentahoRole> roles = getUserRoles( null, user.getUsername() );
        for ( IPentahoRole role : roles ) {
            if ( tenantAdminRoleName.equals( role.getName() ) ) {
                userHasAdminRole = true;
                break;
            }
        }

        if ( ( isMyself( user.getUsername() ) || isDefaultAdminUser( user.getUsername() ) ) && userHasAdminRole ) {
            throw new RepositoryException( "ERROR_UNABLE_TO_DELETE_USER_IS_YOURSELF_OR_DEFAULT_ADMIN_USER" );
        }

        if ( userHasAdminRole ) {
            List<IPentahoUser> usersWithAdminRole = getRoleMembers( null, tenantAdminRoleName );
            if ( usersWithAdminRole == null ) {
                throw new RepositoryException( "ERROR_LAST_USER_NEEDED_IN_ROLE " + tenantAdminRoleName  );
            }
            if ( usersWithAdminRole.size() > 1 ) {
                return true;
            } else if ( usersWithAdminRole.size() == 1 ) {
                return false;
            } else {
                throw new RepositoryException( "ERROR_LAST_USER_SHOULD_BE_IN_ROLE " + tenantAdminRoleName );
            }
        }
        return true;
    }

    private boolean isMyself( String userName ) {
        return PentahoSessionHolder.getSession().getName().equals( userName );
    }

    private boolean isDefaultAdminUser( String userName ) {
        String defaultAdminUser = singleTenantAdminUserName;
        if ( defaultAdminUser != null ) {
            return defaultAdminUser.equals( userName );
        }
        return false;
    }

}

