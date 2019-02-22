
package com.xdatainsight.monitor.web.http.security;

import org.springframework.beans.propertyeditors.PropertiesEditor;
import org.springframework.security.userdetails.User;
import org.springframework.security.userdetails.UserDetails;
import org.springframework.security.userdetails.memory.UserAttribute;
import org.springframework.security.userdetails.memory.UserAttributeEditor;

import java.beans.PropertyEditorSupport;
import java.util.Properties;

public class UserRoleListEnhancedUserMapEditor extends PropertyEditorSupport {
    // ~ Methods
    // ================================================================

    @Override
    public void setAsText( final String s ) throws IllegalArgumentException {
        UserRoleListEnhancedUserMap userRoleListEnhanceduserMap = new UserRoleListEnhancedUserMap();

        // Use properties editor to tokenize the string
        PropertiesEditor propertiesEditor = new PropertiesEditor();
        propertiesEditor.setAsText( s );

        Properties props = (Properties) propertiesEditor.getValue();
        UserRoleListEnhancedUserMapEditor.addUsersFromProperties( userRoleListEnhanceduserMap, props );

        setValue( userRoleListEnhanceduserMap );
    }

    public static UserRoleListEnhancedUserMap addUsersFromProperties( final UserRoleListEnhancedUserMap userMap,
                                                                      final Properties props ) {
        // Now we have properties, process each one individually
        UserAttributeEditor configAttribEd = new UserAttributeEditor();

        for ( Object element : props.keySet() ) {
            String username = (String) element;
            String value = props.getProperty( username );

            // Convert value to a password, enabled setting, and list of granted
            // authorities
            configAttribEd.setAsText( value );

            UserAttribute attr = (UserAttribute) configAttribEd.getValue();

            // Make a user object, assuming the properties were properly
            // provided
            if ( attr != null ) {
                UserDetails user =
                        new User( username, attr.getPassword(), attr.isEnabled(), true, true, true, attr.getAuthorities() );
                userMap.addUser( user );
            }
        }

        return userMap;
    }
}
