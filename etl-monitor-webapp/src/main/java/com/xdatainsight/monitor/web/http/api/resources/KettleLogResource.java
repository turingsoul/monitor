package com.xdatainsight.monitor.web.http.api.resources;

import com.xdatainsight.monitor.web.http.api.resources.services.KettleLogService;
import com.xdatainsight.monitor.web.http.api.resources.utils.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.enunciate.jaxrs.ResponseCode;
import org.codehaus.enunciate.jaxrs.StatusCodes;
import org.pentaho.platform.api.scheduler2.SchedulerException;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.pentaho.platform.repository2.unified.webservices.RepositoryFileTreeDto;

import javax.ws.rs.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/logs/" )
public class KettleLogResource extends AbstractJaxRSResource {

    protected static final Log logger = LogFactory.getLog( FileResource.class );

    protected KettleLogService logService;

    public KettleLogResource() {
        logService = new KettleLogService();
    }

    @GET
    @Path ( "/scheduledDate" )
    @Produces( { APPLICATION_JSON } )
    @StatusCodes( {
            @ResponseCode( code = 200, condition = "." ),
            @ResponseCode ( code = 404, condition = "." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public List doGetScheduledDate(@QueryParam("pathId") String pathId) {
        logRequestData(httpServletRequest,"");
        return logService.getScheduledDate(pathId);
    }

    @GET
    @Path ( "/detailLogs" )
    @Produces( { APPLICATION_JSON } )
    @StatusCodes( {
            @ResponseCode( code = 200, condition = "." ),
            @ResponseCode ( code = 404, condition = "." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public Map doGetDetailLogs(@QueryParam("pathId") String pathId, @QueryParam("channelId") String channelId) {
        logRequestData(httpServletRequest,"");
        return logService.getDetailLogs(pathId, channelId);
    }

    @GET
    @Path ( "/scheduledDateByJobId" )
    @Produces( { APPLICATION_JSON } )
    @StatusCodes( {
            @ResponseCode( code = 200, condition = "." ),
            @ResponseCode ( code = 404, condition = "." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public List doGetScheduledDateById(@QueryParam("jobId") String jobId) {
        logRequestData(httpServletRequest,"");
        try {
            return logService.getScheduledDateByJobId(jobId);
        } catch (SchedulerException e) {
            throw new WebApplicationException(e);
        }
    }

    @GET
    @Path ( "/detailLogsById" )
    @Produces( { APPLICATION_JSON } )
    @StatusCodes( {
            @ResponseCode( code = 200, condition = "." ),
            @ResponseCode ( code = 404, condition = "." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public Map doGetDetailLogsByJobId(@QueryParam("jobId") String jobId, @QueryParam("channelId") String channelId) {
        logRequestData(httpServletRequest,"");
        try {
            return logService.getDetailLogsByJobId(jobId, channelId);
        } catch (SchedulerException e) {
            throw new WebApplicationException(e);
        }
    }

    @GET
    @Path ( "/operationLog" )
    @Produces( { APPLICATION_JSON } )
    @StatusCodes( {
            @ResponseCode( code = 200, condition = "." ),
            @ResponseCode ( code = 404, condition = "." ),
            @ResponseCode ( code = 500, condition = "Server Error." )
    } )
    public Map doGetOperationLog(@QueryParam("pageNo") @DefaultValue("0") int pageNo,
                                 @QueryParam("pageSize") @DefaultValue("30") int pageSize,
                                 @QueryParam("userId") String userId,
                                 @QueryParam("startTime") long startTime,
                                 @QueryParam("endTime") long endTime) {
        logRequestData(httpServletRequest,"");
        Date start = null,end = null;
        String user = null;
        if (startTime != 0 ) {
            start = new Date(startTime);
        }
        if (endTime != 0 ) {
            end = new Date(endTime);
        }
        if (userId != null && !StringUtils.isEmpty(userId)) {
            user = userId;
        }
        return logService.getOperationLog(pageNo,pageSize,user,start,end);
    }

    @GET
    @Path("/getExecStatus")
    @Produces({APPLICATION_JSON})
    public Map doGetExecStatus(@QueryParam("startTime") long startTime,
                               @QueryParam("endTime") long endTime) {

        logRequestData(httpServletRequest,"");
        Date start = null,end = null;
        if (startTime != 0 ) {
            start = new Date(startTime);
        }
        if (endTime != 0 ) {
            end = new Date(endTime);
        }

        return logService.getExecStatusCounts(start, end);

    }

    @GET
    @Path("/getExecStatusDetails")
    @Produces({APPLICATION_JSON})
    public List doGetExecStatusDetails(@QueryParam("startTime") long startTime,
                                       @QueryParam("endTime") long endTime) {

        logRequestData(httpServletRequest,"");
        Date start = null,end = null;
        if (startTime != 0 ) {
            start = new Date(startTime);
        }
        if (endTime != 0 ) {
            end = new Date(endTime);
        }

        return logService.getExecStatusDetails(start,end);

    }

    @GET
    @Path("/getExecCount")
    @Produces({APPLICATION_JSON})
    public Map doGetExecCount(@QueryParam("startTime") long startTime,
                               @QueryParam("endTime") long endTime,
                               @QueryParam("subject")String subject) {

        logRequestData(httpServletRequest,"");
        Date start = null,end = null;
        if (startTime != 0 ) {
            start = new Date(startTime);
        }
        if (endTime != 0 ) {
            end = new Date(endTime);
        }

        return logService.getExecCount(start,end,subject);

    }

    @GET
    @Path("/getExecCountDetails")
    @Produces({APPLICATION_JSON})
    public List doGetExecCountDetails(@QueryParam("startTime") long startTime,
                                     @QueryParam("endTime") long endTime,
                                     @QueryParam("subject")String subject) {

        logRequestData(httpServletRequest,"");
        Date start = null,end = null;
        if (startTime != 0 ) {
            start = new Date(startTime);
        }
        if (endTime != 0 ) {
            end = new Date(endTime);
        }

        return logService.getExecCountDetails(start,end,subject);

    }
}
