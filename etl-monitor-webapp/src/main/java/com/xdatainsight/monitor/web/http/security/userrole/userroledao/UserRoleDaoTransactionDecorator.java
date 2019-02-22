package com.xdatainsight.monitor.web.http.security.userrole.userroledao;

import org.pentaho.platform.api.engine.security.userroledao.*;
import org.pentaho.platform.api.mt.ITenant;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;

/**
 * Wraps a {@link IUserRoleDao}, beginning, committing, and rolling back transactions before and after each operation.
 *
 * <p>Why not just do the transactions in the DAO implementation?  Because transactions are a
 * <a href="http://en.wikipedia.org/wiki/Cross-cutting_concern">cross-cutting concern</a>, an aspect that is often
 * scattered throughout the code but is best separated from other code.</p>
 *
 * @author mlowery
 */
public class UserRoleDaoTransactionDecorator implements IUserRoleDao {

    /**
     * Spring's transaction template that begins and commits a transaction, and automatically rolls back on a runtime
     * exception. Recommended configuration for this bean: <code>propagationBehavior</code> set to
     * <code>TransactionDefinition.PROPAGATION_REQUIRES_NEW)</code>.
     */
    private TransactionTemplate transactionTemplate;

    /**
     * The wrapped DAO to which to delegate.
     */
    private IUserRoleDao userRoleDao;


    @Override
    public IPentahoUser createUser(final ITenant tenant, final String username, final String password, final String description, final String[] roles) throws AlreadyExistsException, UncategorizedUserRoleDaoException {
        return (IPentahoUser) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.createUser(tenant, username, password, description, roles);
            }
        });
    }

    @Override
    public void setPassword(final ITenant tenant, final String userName, final String password) throws NotFoundException, UncategorizedUserRoleDaoException {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                userRoleDao.setPassword(tenant, userName, password);
            }
        });
    }

    @Override
    public void setUserDescription(final ITenant tenant, final String userName, final String description) throws NotFoundException, UncategorizedUserRoleDaoException {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                userRoleDao.setUserDescription(tenant, userName, description);
            }
        });
    }

    @Override
    public void deleteUser(final IPentahoUser user) throws NotFoundException, UncategorizedUserRoleDaoException {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                userRoleDao.deleteUser(user);
            }
        });
    }

    @Override
    public IPentahoUser getUser(final ITenant tenant, final String name) throws UncategorizedUserRoleDaoException {
        return (IPentahoUser) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getUser(tenant, name);
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoUser> getUsers() throws UncategorizedUserRoleDaoException {
        return (List<IPentahoUser>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getUsers();
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoUser> getUsers(final ITenant tenant) throws UncategorizedUserRoleDaoException {
        return (List<IPentahoUser>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getUsers(tenant);
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoUser> getUsers(final ITenant tenant, final boolean includeSubtenants) throws UncategorizedUserRoleDaoException {
        return (List<IPentahoUser>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getUsers(tenant, includeSubtenants);
            }
        });
    }

    @Override
    public IPentahoRole createRole(final ITenant tenant, final String roleName, final String description, final String[] memberUserNames) throws AlreadyExistsException, UncategorizedUserRoleDaoException {
        return (IPentahoRole) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.createRole(tenant, roleName, description, memberUserNames);
            }
        });
    }

    @Override
    public void setRoleDescription(final ITenant tenant, final String roleName, final String description) throws NotFoundException, UncategorizedUserRoleDaoException {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                userRoleDao.setRoleDescription(tenant, roleName, description);
            }
        });
    }

    @Override
    public void deleteRole(final IPentahoRole role) throws NotFoundException, UncategorizedUserRoleDaoException {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                userRoleDao.deleteRole(role);
            }
        });
    }

    @Override
    public IPentahoRole getRole(final ITenant tenant, final String name) throws UncategorizedUserRoleDaoException {
        return (IPentahoRole) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getRole(tenant, name);
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoRole> getRoles() throws UncategorizedUserRoleDaoException {
        return (List<IPentahoRole>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getRoles();
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoRole> getRoles(final ITenant tenant) throws UncategorizedUserRoleDaoException {
        return (List<IPentahoRole>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getRoles(tenant);
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoRole> getRoles(final ITenant tenant, final boolean includeSubtenants) throws UncategorizedUserRoleDaoException {
        return (List<IPentahoRole>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getRoles(tenant, includeSubtenants);
            }
        });
    }

    @Override
    public void setRoleMembers(final ITenant tenant, final String roleName, final String[] memberUserNames) throws NotFoundException, UncategorizedUserRoleDaoException {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                userRoleDao.setRoleMembers(tenant, roleName, memberUserNames);
            }
        });
    }

    @Override
    public void setUserRoles(final ITenant tenant, final String userName, final String[] roles) throws NotFoundException, UncategorizedUserRoleDaoException {
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                userRoleDao.setUserRoles(tenant, userName, roles);
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoUser> getRoleMembers(final ITenant tenant, final String roleName) throws UncategorizedUserRoleDaoException {
        return (List<IPentahoUser>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getRoleMembers(tenant, roleName);
            }
        });
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<IPentahoRole> getUserRoles(final ITenant tenant, final String userName) throws UncategorizedUserRoleDaoException {
        return (List<IPentahoRole>) transactionTemplate.execute(new TransactionCallback() {
            public Object doInTransaction(TransactionStatus status) {
                return userRoleDao.getUserRoles(tenant, userName);
            }
        });
    }


    public void setTransactionTemplate(final TransactionTemplate transactionTemplate) {
        this.transactionTemplate = transactionTemplate;
    }

    public void setUserRoleDao(final IUserRoleDao userRoleDao) {
        this.userRoleDao = userRoleDao;
    }

}
