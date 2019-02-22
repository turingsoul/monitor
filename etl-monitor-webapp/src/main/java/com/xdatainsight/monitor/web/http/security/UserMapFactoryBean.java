
package com.xdatainsight.monitor.web.http.security;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.security.userdetails.memory.UserMap;
import org.springframework.security.userdetails.memory.UserMapEditor;


public class UserMapFactoryBean implements FactoryBean {
    /*
     * The user map text which will be processed by property editor.
     */
    private String userMap;

    public Object getObject() throws Exception {
        UserMapEditor userMapEditor = new UserMapEditor();
        userMapEditor.setAsText( userMap );
        return userMapEditor.getValue();
    }

    public Class getObjectType() {
        return UserMap.class;
    }

    public boolean isSingleton() {
        return true;
    }

    public void setUserMap( final String userMap ) {
        this.userMap = userMap;
    }

}
