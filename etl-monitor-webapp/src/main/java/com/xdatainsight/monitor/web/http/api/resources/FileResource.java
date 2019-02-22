package com.xdatainsight.monitor.web.http.api.resources;


import com.xdatainsight.monitor.web.http.api.resources.services.FileService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.enunciate.jaxrs.ResponseCode;
import org.codehaus.enunciate.jaxrs.StatusCodes;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.platform.api.scheduler2.SchedulerException;
import org.pentaho.platform.repository2.unified.webservices.RepositoryFileTreeDto;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.MediaType.*;

/**
 * This service provides methods for listing, creating, downloading, uploading, and removal of files.
 *
 */
@Path ( "/repo/files/" )
public class FileResource extends AbstractJaxRSResource {

    protected static final Log logger = LogFactory.getLog( FileResource.class );

    protected FileService fileService;

    public FileResource() throws Exception {
        fileService = new FileService();
    }


    @GET
    @Path ( "/tree" )
    @Produces ( { APPLICATION_JSON } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the list of files from root of the repository." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public RepositoryFileTreeDto doGetRootTree() {
        logRequestData(httpServletRequest,"");
        return fileService.doGetTree();
    }

    @GET
    @Path ( "{pathId : .+}/parameters" )
    @Produces ( { APPLICATION_JSON } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the parameters." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public String[] doGetFileParameters(@PathParam ( "pathId" ) String pathId ) {
        logRequestData(httpServletRequest,"");
        return fileService.doGetFileParameters(pathId);
    }

    @GET
    @Path ( "{pathId : .+}/content" )
    @Produces ( { APPLICATION_XML, APPLICATION_JSON} )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the content." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public Response doGetFileContent(@PathParam ( "pathId" ) String pathId ) {
        logRequestData(httpServletRequest,"");
        return Response.ok(fileService.doGetFileContent(pathId)).build();
    }

    @GET
    @Path ( "{pathId : .+}/runTest" )
    @Produces ( { APPLICATION_XML, APPLICATION_JSON} )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the content." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public String runTest(@PathParam ( "pathId" ) String pathId ) {
        logRequestData(httpServletRequest,"");
        return fileService.runTest(pathId);
    }

    @GET
    @Path ( "/contentByJobId" )
    @Produces ( { APPLICATION_XML, APPLICATION_JSON} )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the content." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public String doGetFileContentByJobId(@QueryParam ( "jobId" ) String jobId ) {
        logRequestData(httpServletRequest,"");
        try {
            return fileService.doGetFileContentByJobId(jobId);
        } catch (SchedulerException e) {
            throw new WebApplicationException(e);
        }
    }

    @GET
    @Path ( "/delete" )
    @Produces ( { APPLICATION_XML, APPLICATION_JSON} )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully delete the object." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public Response doDelete(@QueryParam ( "pathId" ) String pathId ) {
        logRequestData(httpServletRequest,"");
        try {
            fileService.doDeleteFile(pathId);
            return Response.ok().build();
        }  catch (Exception e) {
            throw new WebApplicationException(e);
        }
    }

    @GET
    @Path ( "/rename" )
    @Produces ( { APPLICATION_XML, APPLICATION_JSON} )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully rename the object." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public Response doRename(@QueryParam ( "pathId" ) String pathId, @QueryParam ( "newName" ) String newName ) {
        logRequestData(httpServletRequest,"");
        try {
            fileService.doRenameFile(pathId, newName);
            return Response.ok().build();
        }  catch (Exception e) {
            throw new WebApplicationException(e);
        }
    }

    @GET
    @Path ( "/create" )
    @Produces ( { APPLICATION_XML, APPLICATION_JSON} )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully create the object." ),
            @ResponseCode ( code = 404, condition = "Invalid parameters." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public Response doCreateDirectory(@QueryParam ( "parentPathId" ) String parentPathId, @QueryParam ( "name" ) String name ) {
        logRequestData(httpServletRequest,"");
        try {
            fileService.doCreateDirectory(parentPathId, name);
            return Response.ok().build();
        }  catch (Exception e) {
            throw new WebApplicationException(e);
        }
    }
}
