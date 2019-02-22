

package com.xdatainsight.monitor.web.http.security;

import org.springframework.security.GrantedAuthority;
import org.springframework.security.GrantedAuthorityImpl;
import org.springframework.security.userdetails.UserDetails;
import org.springframework.security.userdetails.memory.UserMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class UserRoleListEnhancedUserMap extends UserMap {
    // ~ Static fields/initializers
    // =============================================

    // ~ Instance fields
    // ========================================================

    private final Map<String, UserDetails> userRoleListEnhanceduserMap = new HashMap<String, UserDetails>();

    private final Map<GrantedAuthority, Set<String>> rolesToUsersMap = new HashMap<GrantedAuthority, Set<String>>();

    // ~ Methods
    // ================================================================

    @Override
    public void addUser( final UserDetails user ) throws IllegalArgumentException {
        super.addUser( user );
        this.userRoleListEnhanceduserMap.put( user.getUsername().toLowerCase(), user );
        GrantedAuthority[] auths = user.getAuthorities();
        for ( GrantedAuthority anAuthority : auths ) {
            Set<String> userListForAuthority = rolesToUsersMap.get( anAuthority );
            if ( userListForAuthority == null ) {
                userListForAuthority = new TreeSet<String>();
                rolesToUsersMap.put( anAuthority, userListForAuthority );
            }
            userListForAuthority.add( user.getUsername() );
        }
    }

    public String[] getAllAuthorities() {
        Set<GrantedAuthority> authoritiesSet = this.rolesToUsersMap.keySet();
        List<String> roles = new ArrayList<String>( authoritiesSet.size() );
        for ( GrantedAuthority role : authoritiesSet ) {
            roles.add( role.getAuthority() );
        }
        return (String[]) roles.toArray();
    }

    public String[] getAllUsers() {
        String[] rtn = new String[userRoleListEnhanceduserMap.size()];
        Iterator it = userRoleListEnhanceduserMap.values().iterator();
        int i = 0;
        while ( it.hasNext() ) {
            rtn[i] = ( (UserDetails) it.next() ).getUsername();
            i++;
        }
        return rtn;
    }

    public String[] getUserNamesInRole( final String role ) {
        Set<String> userListForAuthority = rolesToUsersMap.get( new GrantedAuthorityImpl( role ) );
        String[] typ = {};
        if ( userListForAuthority != null ) {
            return userListForAuthority.toArray( typ );
        } else {
            return typ;
        }
    }

    @Override
    public void setUsers( final Map users ) {
        super.setUsers( users );
        Iterator iter = users.values().iterator();
        while ( iter.hasNext() ) {
            addUser( (UserDetails) iter.next() );
        }
    }

}
