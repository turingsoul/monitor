

package com.xdatainsight.monitor.web.http.security;

import org.springframework.beans.factory.FactoryBean;

public class UserRoleListEnhancedUserMapFactoryBean implements FactoryBean {

    /*
     * The user map text which will be processed by property editor.
     */
    private String userMap;

    public Object getObject() throws Exception {
        UserRoleListEnhancedUserMapEditor userRoleListEnhancedUserMapEditor = new UserRoleListEnhancedUserMapEditor();
        userRoleListEnhancedUserMapEditor.setAsText( userMap );
        return userRoleListEnhancedUserMapEditor.getValue();
    }

    public Class getObjectType() {
        return UserRoleListEnhancedUserMap.class;
    }

    public boolean isSingleton() {
        return true;
    }

    public void setUserMap( final String userMap ) {
        this.userMap = userMap;
    }
}
