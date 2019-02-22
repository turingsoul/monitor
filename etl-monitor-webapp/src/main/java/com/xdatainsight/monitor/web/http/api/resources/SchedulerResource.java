package com.xdatainsight.monitor.web.http.api.resources;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_XML;
import static javax.ws.rs.core.MediaType.TEXT_PLAIN;
import static javax.ws.rs.core.Response.Status.FORBIDDEN;
import static javax.ws.rs.core.Response.Status.UNAUTHORIZED;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.xdatainsight.monitor.web.http.api.resources.services.SchedulerService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.enunciate.Facet;
import org.codehaus.enunciate.jaxrs.ResponseCode;
import org.codehaus.enunciate.jaxrs.StatusCodes;
import org.pentaho.platform.api.repository2.unified.UnifiedRepositoryException;
import org.pentaho.platform.api.scheduler2.IJobTrigger;
import org.pentaho.platform.api.scheduler2.Job;
import org.pentaho.platform.api.scheduler2.Job.JobState;
import org.pentaho.platform.api.scheduler2.SchedulerException;

/**
 * The SchedulerResource service provides the means to create, read, update, delete, and list schedules and blockout periods.  Also provides the ability to control the status of schedules and the scheduler.
 */
@Path ( "/scheduler" )
public class SchedulerResource extends AbstractJaxRSResource {

    protected SchedulerService schedulerService;

    protected static final Log logger = LogFactory.getLog( SchedulerResource.class );

    public SchedulerResource() {
        schedulerService = new SchedulerService();
    }


    @POST
    @Path ( "/job" )
    @Consumes ( { APPLICATION_JSON, APPLICATION_XML } )
    @Produces ( "text/plain" )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Schedule created successfully." ),
            @ResponseCode ( code = 401, condition = "User is not allowed to create schedules." ),
            @ResponseCode ( code = 403, condition = "Cannot create schedules for the specified file." ),
            @ResponseCode ( code = 500, condition = "An error occurred while creating a schedule." )
    } )
    public Response createJob( JobScheduleRequest scheduleRequest ) {
        logRequestData(httpServletRequest,toJSon(scheduleRequest));
        try {
            Job job = schedulerService.createJob( scheduleRequest );
            return buildPlainTextOkResponse( job.getJobId() );
        } catch ( SchedulerException e ) {
            return buildServerErrorResponse( e.getCause().getMessage() );
        } catch ( IOException e ) {
            return buildServerErrorResponse( e.getCause().getMessage() );
        } catch ( SecurityException e ) {
            return buildStatusResponse( UNAUTHORIZED );
        } catch ( IllegalAccessException e ) {
            return buildStatusResponse( FORBIDDEN );
        }
    }


    @POST
    @Path ( "/triggerNow" )
    @Produces ( "text/plain" )
    @Consumes ( { APPLICATION_XML, APPLICATION_JSON } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Job triggered successfully." ),
            @ResponseCode ( code = 400, condition = "Invalid input." ),
            @ResponseCode ( code = 500, condition = "Invalid jobId." )
    } )
    public Response triggerNow( JobRequest jobRequest ) {
        logRequestData(httpServletRequest,toJSon(jobRequest));
        try {
            Job job = schedulerService.triggerNow( jobRequest.getJobId() );
            return buildPlainTextOkResponse( job.getState().name() );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }



    @GET
    @Path ( "/getJobs" )
    @Produces ( { APPLICATION_JSON, APPLICATION_XML } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Jobs retrieved successfully." ),
            @ResponseCode ( code = 500, condition = "Error while retrieving jobs." )
    } )
    public List<Job> getAllJobs() {
        logRequestData(httpServletRequest,"");
        try {
            return schedulerService.getJobs();
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }


    @GET
    @Path ( "/getJobsByPathId" )
    @Produces ( { APPLICATION_JSON, APPLICATION_XML } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Jobs retrieved successfully." ),
            @ResponseCode ( code = 500, condition = "Error while retrieving jobs." )
    } )
    public List<Job> getJobsByFilePath( @QueryParam( "pathId" ) String pathId) {
        logRequestData(httpServletRequest,"");
        try {
            return schedulerService.getJobsByFilePath(pathId);
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }

    @GET
    @Path ( "/canSchedule" )
    @Produces ( TEXT_PLAIN )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successful retrieved the scheduling permission." ),
            @ResponseCode ( code = 500, condition = "Unable to retrieve the scheduling permission." )
    } )
    public String doGetCanSchedule() {
        logRequestData(httpServletRequest,"");
        return schedulerService.doGetCanSchedule();
    }


    @GET
    @Path ( "/state" )
    @Produces ( "text/plain" )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the state of the scheduler." ),
            @ResponseCode ( code = 500, condition = "An error occurred when getting the state of the scheduler." )
    } )
    public Response getState() {
        logRequestData(httpServletRequest,"");
        try {
            String state = schedulerService.getState();
            return buildPlainTextOkResponse( state );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }

    @GET
    @Path ( "/getAllJobState" )
    @Produces ( {APPLICATION_JSON} )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the state of the scheduler." ),
            @ResponseCode ( code = 500, condition = "An error occurred when getting the state of the scheduler." )
    } )
    public Map getAllJobState() {
        try {
            return schedulerService.getAllJobState();
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        } catch (org.quartz.SchedulerException e) {
            throw new RuntimeException( e );
        }
    }

    @POST
    @Path ( "/start" )
    @Produces ( "text/plain" )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully started the server." ),
            @ResponseCode ( code = 500, condition = "An error occurred when resuming the scheduler." )
    } )
    public Response start() {
        logRequestData(httpServletRequest,"");
        try {
            String status = schedulerService.start();
            return buildPlainTextOkResponse( status );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }

    @POST
    @Path ( "/pause" )
    @Produces ( "text/plain" )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully paused the server." ),
            @ResponseCode ( code = 500, condition = "An error occurred when pausing the scheduler." )
    } )
    public Response pause() {
        logRequestData(httpServletRequest,"");
        try {
            String status = schedulerService.pause();
            return buildPlainTextOkResponse( status );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }

    @POST
    @Path ( "/shutdown" )
    @Produces ( "text/plain" )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully shut down the server." ),
            @ResponseCode ( code = 500, condition = "An error occurred when shutting down the scheduler." )
    } )
    public Response shutdown() {
        logRequestData(httpServletRequest,"");
        try {
            String status = schedulerService.shutdown();
            return buildPlainTextOkResponse( status );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }

    @POST
    @Path ( "/jobState" )
    @Produces ( "text/plain" )
    @Consumes ( { APPLICATION_XML, APPLICATION_JSON } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the state of the requested job." ),
            @ResponseCode ( code = 500, condition = "Invalid jobId." )
    } )
    public Response getJobState( JobRequest jobRequest ) {
        logRequestData(httpServletRequest,toJSon(jobRequest));
        try {
            return buildPlainTextOkResponse( schedulerService.getJobState( jobRequest ).name() );
        } catch ( UnsupportedOperationException e ) {
            return buildPlainTextStatusResponse( UNAUTHORIZED );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }


    @POST
    @Path ( "/pauseJob" )
    @Produces ( "text/plain" )
    @Consumes ( { APPLICATION_XML, APPLICATION_JSON } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully paused the job." ),
            @ResponseCode ( code = 500, condition = "Invalid jobId." )
    } )
    public Response pauseJob( JobRequest jobRequest ) {
        logRequestData(httpServletRequest,toJSon(jobRequest));
        try {
            JobState state = schedulerService.pauseJob( jobRequest.getJobId() );
            return buildPlainTextOkResponse( state.name() );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }


    @POST
    @Path ( "/resumeJob" )
    @Produces ( "text/plain" )
    @Consumes ( { APPLICATION_XML, APPLICATION_JSON } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully resumed the job." ),
            @ResponseCode ( code = 500, condition = "Invalid jobId." )
    } )
    public Response resumeJob( JobRequest jobRequest ) {
        logRequestData(httpServletRequest,toJSon(jobRequest));
        try {
            JobState state = schedulerService.resumeJob( jobRequest.getJobId() );
            return buildPlainTextOkResponse( state.name() );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }


    @DELETE
    @Path ( "/removeJob" )
    @Produces ( "text/plain" )
    @Consumes ( { APPLICATION_XML, APPLICATION_JSON } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully removed the job." ),
            @ResponseCode ( code = 500, condition = "Invalid jobId." )
    } )
    public Response removeJob( JobRequest jobRequest ) {
        logRequestData(httpServletRequest,toJSon(jobRequest));
        try {
            if ( schedulerService.removeJob( jobRequest.getJobId() ) ) {
                return buildPlainTextOkResponse( "REMOVED" );
            }
            Job job = schedulerService.getJob( jobRequest.getJobId() );
            return buildPlainTextOkResponse( job.getState().name() );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }


    @GET
    @Path ( "/jobinfo" )
    @Produces ( { APPLICATION_JSON, APPLICATION_XML } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved the information for the requested job." ),
            @ResponseCode ( code = 500, condition = "Invalid jobId." )
    } )
    public Job getJob( @QueryParam( "jobId" ) String jobId,
                       @DefaultValue( "false" ) @QueryParam( "asCronString" ) String asCronString ) {
        logRequestData(httpServletRequest,"");
        try {
            return schedulerService.getJobInfo( jobId );
        } catch ( SchedulerException e ) {
            throw new RuntimeException( e );
        }
    }


    /**
     * @return list of Job
     * @deprecated Method is deprecated as the name getBlockoutJobs is preferred over getJobs
     *
     * Retrieves all blockout jobs in the system
     */
    @Deprecated
    @Facet ( name = "Unsupported" )
    public List<Job> getJobs() {
        return getBlockoutJobs();
    }


    @GET
    @Path ( "/blockout/blockoutjobs" )
    @Produces ( { APPLICATION_JSON, APPLICATION_XML } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully retrieved blockout jobs." )
    } )
    public List<Job> getBlockoutJobs() {
        logRequestData(httpServletRequest,"");
        return schedulerService.getBlockOutJobs();
    }


    @GET
    @Path ( "/blockout/hasblockouts" )
    @Produces ( { TEXT_PLAIN } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully determined whether or not the system contains blockouts." )
    } )
    public Response hasBlockouts() {
        logRequestData(httpServletRequest,"");
        Boolean hasBlockouts = schedulerService.hasBlockouts();
        return buildOkResponse( hasBlockouts.toString() );
    }


    @POST
    @Path ( "/blockout/add" )
    @Consumes ( { APPLICATION_JSON, APPLICATION_XML } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successful operation." ),
            @ResponseCode ( code = 401, condition = "User is not authorized to create blockout." )
    } )
    public Response addBlockout( JobScheduleRequest jobScheduleRequest ) {
        logRequestData(httpServletRequest,toJSon(jobScheduleRequest));
        try {
            Job job = schedulerService.addBlockout( jobScheduleRequest );
            return buildPlainTextOkResponse( job.getJobId() );
        } catch ( IOException e ) {
            return buildStatusResponse( UNAUTHORIZED );
        } catch ( SchedulerException e ) {
            return buildStatusResponse( UNAUTHORIZED );
        } catch ( IllegalAccessException e ) {
            return buildStatusResponse( UNAUTHORIZED );
        }
    }


    @POST
    @Path ( "/blockout/update" )
    @Consumes ( { APPLICATION_JSON, APPLICATION_XML } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successful operation." ),
            @ResponseCode ( code = 401, condition = "User is not authorized to update blockout." )
    } )
    public Response updateBlockout( @QueryParam ( "jobid" ) String jobId, JobScheduleRequest jobScheduleRequest ) {
        logRequestData(httpServletRequest,toJSon(jobScheduleRequest));
        try {
            Job job = schedulerService.updateBlockout( jobId, jobScheduleRequest );
            return buildPlainTextOkResponse( job.getJobId() );
        } catch ( IOException e ) {
            return buildStatusResponse( Status.UNAUTHORIZED );
        } catch ( SchedulerException e ) {
            return buildStatusResponse( Status.UNAUTHORIZED );
        } catch ( IllegalAccessException e ) {
            return buildStatusResponse( Status.UNAUTHORIZED );
        }
    }


    @POST
    @Path ( "/blockout/willFire" )
    @Consumes ( { APPLICATION_JSON, APPLICATION_XML } )
    @Produces ( { TEXT_PLAIN } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successful operation." ),
            @ResponseCode ( code = 500, condition = "An error occurred while determining blockouts being fired." )
    } )
    public Response blockoutWillFire( JobScheduleRequest jobScheduleRequest ) {
        logRequestData(httpServletRequest,toJSon(jobScheduleRequest));
        Boolean willFire;
        try {
            willFire = schedulerService.willFire( convertScheduleRequestToJobTrigger( jobScheduleRequest ) );
        } catch ( UnifiedRepositoryException e ) {
            return buildServerErrorResponse( e );
        } catch ( SchedulerException e ) {
            return buildServerErrorResponse( e );
        }
        return buildOkResponse( willFire.toString() );
    }


    @GET
    @Path ( "/blockout/shouldFireNow" )
    @Produces ( { TEXT_PLAIN } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successful operation." )
    } )
    public Response shouldFireNow() {
        logRequestData(httpServletRequest,"");
        Boolean result = schedulerService.shouldFireNow();
        return buildOkResponse( result.toString() );
    }



    @POST
    @Path ( "/blockout/blockstatus" )
    @Consumes ( { APPLICATION_JSON, APPLICATION_XML } )
    @Produces ( { APPLICATION_JSON, APPLICATION_XML } )
    @StatusCodes ( {
            @ResponseCode ( code = 200, condition = "Successfully got the blockout status." ),
            @ResponseCode ( code = 401, condition = "User is not authorized to get the blockout status." )
    } )
    public Response getBlockStatus( JobScheduleRequest jobScheduleRequest ) {
        logRequestData(httpServletRequest,toJSon(jobScheduleRequest));
        try {
            BlockStatusProxy blockStatusProxy = schedulerService.getBlockStatus( jobScheduleRequest );
            return buildOkResponse( blockStatusProxy );
        } catch ( SchedulerException e ) {
            return buildStatusResponse( Status.UNAUTHORIZED );
        }
    }



    protected Response buildOkResponse( Object entity ) {
        return Response.ok( entity ).build();
    }

    protected Response buildPlainTextOkResponse( String msg ) {
        return Response.ok( msg ).type( MediaType.TEXT_PLAIN ).build();
    }

    protected Response buildServerErrorResponse( Object entity ) {
        return Response.serverError().entity( entity ).build();
    }

    protected Response buildStatusResponse( Status status ) {
        return Response.status( status ).build();
    }

    protected Response buildPlainTextStatusResponse( Status status ) {
        return Response.status( status ).type( MediaType.TEXT_PLAIN ).build();
    }

    protected IJobTrigger convertScheduleRequestToJobTrigger( JobScheduleRequest request ) throws SchedulerException {
        return SchedulerResourceUtil.convertScheduleRequestToJobTrigger( request, schedulerService.getScheduler() );
    }
}
