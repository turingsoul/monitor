package com.xdatainsight.monitor.web.http.api.resources;

import com.xdatainsight.monitor.web.http.api.resources.services.UserRoleDaoService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.pentaho.platform.engine.security.DefaultUsernameComparator;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

import static javax.ws.rs.core.MediaType.APPLICATION_FORM_URLENCODED;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.WILDCARD;

@Path ( "/userrole/" )
public class UserRoleDaoResource extends AbstractJaxRSResource {

    protected static UserRoleDaoService userRoleDaoService;
    private static final Log logger =
            LogFactory.getLog( UserRoleDaoResource.class );


    public UserRoleDaoResource() {
        userRoleDaoService = new UserRoleDaoService();
        userRoleDaoService.setUserComparator(new DefaultUsernameComparator());
    }



    /**
     * Returns the list of users in the platform's repository
     *
     * @return list of users in the platform
     * @throws Exception Exception
     */
    @GET
    @Path( "/users" )
    @Produces( { APPLICATION_JSON } )
    public List getUsers() throws Exception {
        return userRoleDaoService.getUsers();
    }



    /**
     * Create a new user with provided information.
     *
     */
    @POST
    @Path ( "/createUser" )
    @Consumes ( { APPLICATION_FORM_URLENCODED } )
    public String createUser(@FormParam("username") String username,
                               @FormParam("password") String password) {
        logRequestData(httpServletRequest,"");
        String userName = username;
        String passWord = password;
        try {
            userName = URLDecoder.decode( userName.replace( "+", "%2B" ), "UTF-8" );
        } catch ( UnsupportedEncodingException e ) {
            userName = username;
            logger.warn( e.getMessage(), e );
        }
        try {
            passWord = URLDecoder.decode( passWord.replace( "+", "%2B" ), "UTF-8" );
        } catch ( UnsupportedEncodingException e ) {
            passWord = password;
            logger.warn( e.getMessage(), e );
        }
        boolean success = userRoleDaoService.createUser(userName, passWord );
        return success ? "true":"false";
    }





    /**
     * Delete user(s) from the platform
     *
     * @param userNames (list of tab (\t) separated user names)
     * @return
     */
    @GET
    @Path ( "/deleteUsers" )
    public String deleteUser( @QueryParam ( "userNames" ) String userNames ) {
        logRequestData(httpServletRequest,"");
        boolean success = userRoleDaoService.deleteUsers(userNames);
        return success ? "true":"false";
    }
    /**
     * Update the password of a selected user
     *
     */
    @POST
    @Path ( "/updatePassword" )
    @Consumes({APPLICATION_FORM_URLENCODED})
    public String updatePassword( @FormParam("username") String username,
                                    @FormParam("password") String password ) {
        logRequestData(httpServletRequest,"");

        String userName = username;
        String passWord = password;
        try {
            userName = URLDecoder.decode( userName.replace( "+", "%2B" ), "UTF-8" );
        } catch ( UnsupportedEncodingException e ) {
            userName = username;
            logger.warn( e.getMessage(), e );
        }
        try {
            passWord = URLDecoder.decode( passWord.replace( "+", "%2B" ), "UTF-8" );
        } catch ( UnsupportedEncodingException e ) {
            passWord = password;
            logger.warn( e.getMessage(), e );
        }
        boolean success = userRoleDaoService.updatePassword(userName, passWord);
        return success ? "true":"false";
    }

    /**
     * Update the password of a selected user
     *
     */
    @POST
    @Path ( "/changePassword" )
    @Consumes({APPLICATION_FORM_URLENCODED})
    public String changePassword( @FormParam("oldpassword") String oldpassword,
                                  @FormParam("newpassword") String newpassword ) {
        logRequestData(httpServletRequest,"");

        String oldpass = oldpassword;
        String newpass = newpassword;
        try {
            oldpass = URLDecoder.decode( oldpass.replace( "+", "%2B" ), "UTF-8" );
        } catch ( UnsupportedEncodingException e ) {
            oldpass = oldpassword;
            logger.warn( e.getMessage(), e );
        }
        try {
            newpass = URLDecoder.decode( newpass.replace( "+", "%2B" ), "UTF-8" );
        } catch ( UnsupportedEncodingException e ) {
            newpass = newpassword;
            logger.warn( e.getMessage(), e );
        }
        boolean success = userRoleDaoService.changePassword(oldpass, newpass);
        return success ? "true":"false";
    }



}
