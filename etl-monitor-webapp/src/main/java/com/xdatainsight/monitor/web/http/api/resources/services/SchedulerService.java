package com.xdatainsight.monitor.web.http.api.resources.services;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.*;

import com.xdatainsight.monitor.web.http.api.resources.*;
import com.xdatainsight.monitor.web.http.api.resources.utils.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.pentaho.platform.api.action.IAction;
import org.pentaho.platform.api.engine.IPentahoSession;
import org.pentaho.platform.api.scheduler2.IBlockoutManager;
import org.pentaho.platform.api.scheduler2.IJobFilter;
import org.pentaho.platform.api.scheduler2.IJobTrigger;
import org.pentaho.platform.api.scheduler2.IScheduler;
import org.pentaho.platform.api.scheduler2.Job;
import org.pentaho.platform.api.scheduler2.Job.JobState;
import org.pentaho.platform.api.scheduler2.SchedulerException;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.scheduler2.blockout.BlockoutAction;
import org.pentaho.platform.scheduler2.quartz.QuartzScheduler;
import org.pentaho.platform.util.messages.LocaleHelper;

import static org.pentaho.platform.api.scheduler2.Job.JobState.*;

public class SchedulerService {

    protected IScheduler scheduler = PentahoSystem.get( IScheduler.class, "IScheduler2", null ); //$NON-NLS-1$

    protected IBlockoutManager blockoutManager;

    private static final Log logger = LogFactory.getLog( SchedulerService.class );

    private static final String PDI_ACTION_CLASS = "com.xdatainsight.monitor.kettle.PdiAction";

    public Job createJob( JobScheduleRequest scheduleRequest )
            throws IOException, SchedulerException, IllegalAccessException {

        // Used to determine if created by a RunInBackgroundCommand
        boolean runInBackground =
                scheduleRequest.getSimpleJobTrigger() == null && scheduleRequest.getComplexJobTrigger() == null
                        && scheduleRequest.getCronJobTrigger() == null;

        if ( runInBackground ) {
            throw new SecurityException();
        }

        boolean hasInputFile = !StringUtils.isEmpty( scheduleRequest.getInputFile() );
        String file = scheduleRequest.getInputFile();

        // if we have an inputfile, generate job name based on that if the name is not passed in
        if ( hasInputFile && StringUtils.isEmpty( scheduleRequest.getJobName() ) ) {
            scheduleRequest.setJobName( file.substring( 0, file.lastIndexOf( "." ) ));
        } else if ( StringUtils.isEmpty( scheduleRequest.getJobName() ) && !StringUtils.isEmpty( scheduleRequest.getActionClass() ) ) {
            String actionClass =
                    scheduleRequest.getActionClass().substring( scheduleRequest.getActionClass().lastIndexOf( "." ) + 1 );
            scheduleRequest.setJobName( actionClass );
        } else if ( !hasInputFile && StringUtils.isEmpty( scheduleRequest.getJobName() ) ) {
            // just make up a name
            scheduleRequest.setJobName( "" + System.currentTimeMillis() );
        }


        Job job;

        IJobTrigger jobTrigger = SchedulerResourceUtil.convertScheduleRequestToJobTrigger( scheduleRequest, scheduler );

        HashMap<String, Serializable> parameterMap = new HashMap<String, Serializable>();
        for ( JobScheduleParam param : scheduleRequest.getJobParameters() ) {
            parameterMap.put( param.getName(), param.getValue() );
        }

        if ( isPdiFile( file ) ) {
            parameterMap = handlePDIScheduling( file, parameterMap );
        }

        parameterMap.put( LocaleHelper.USER_LOCALE_PARAM, LocaleHelper.getLocale() );

        // need to locate actions from plugins if done this way too (but for now, we're just on main)
        String actionClass = scheduleRequest.getActionClass();
        if(StringUtils.isBlank(actionClass))
            actionClass = PDI_ACTION_CLASS;
        try {
            Class<IAction> iAction = getAction( actionClass );
            job = getScheduler().createJob( scheduleRequest.getJobName(), iAction, parameterMap, jobTrigger );
        } catch ( ClassNotFoundException e ) {
            logger.error("error while create quartz job" , e);
            throw new RuntimeException( e );
        }

        return job;
    }

    public Job triggerNow( String jobId ) throws SchedulerException {
        getScheduler().triggerNow( jobId );
        // update job state
        return getScheduler().getJob( jobId );
    }



    public Job getJob( String jobId ) throws SchedulerException {
        return getScheduler().getJob( jobId );
    }

    public boolean isScheduleAllowed() {
        return true;
    }

    public String doGetCanSchedule() {
        return isScheduleAllowed() ? "true" : "false";
    }

    public String getState() throws SchedulerException {
        return getScheduler().getStatus().name();
    }

    public String start() throws SchedulerException {
        getScheduler().start();
        return getScheduler().getStatus().name();
    }

    public String pause() throws SchedulerException {
        getScheduler().pause();
        return getScheduler().getStatus().name();
    }

    public String shutdown() throws SchedulerException {
        getScheduler().shutdown();
        return getScheduler().getStatus().name();
    }

    public JobState pauseJob( String jobId ) throws SchedulerException {
        Job job = getJob( jobId );
        getScheduler().pauseJob( jobId );
        job = getJob( jobId );
        return job.getState();
    }

    public JobState resumeJob( String jobId ) throws SchedulerException {
        Job job = getJob( jobId );
        getScheduler().resumeJob( jobId );
        job = getJob( jobId );
        return job.getState();
    }

    public boolean removeJob( String jobId ) throws SchedulerException {
        Job job = getJob( jobId );
        getScheduler().removeJob( jobId );
        return true;
    }

    public Job getJobInfo( String jobId ) throws SchedulerException {
        Job job = getJob( jobId );
        for ( String key : job.getJobParams().keySet() ) {
            Serializable value = job.getJobParams().get( key );
            if ( value.getClass().isArray() ) {
                String[] sa = ( new String[0] ).getClass().cast( value );
                ArrayList<String> list = new ArrayList<String>();
                Collections.addAll(list, sa);
                job.getJobParams().put( key, list );
            }
        }
        return job;
    }

    public List<Job> getBlockOutJobs() {
        return getBlockoutManager().getBlockOutJobs();
    }

    public boolean hasBlockouts() {
        List<Job> jobs = getBlockoutManager().getBlockOutJobs();
        return jobs != null && jobs.size() > 0;
    }

    public boolean willFire( IJobTrigger trigger ) {
        return getBlockoutManager().willFire( trigger );
    }

    public boolean shouldFireNow() {
        return getBlockoutManager().shouldFireNow();
    }

    public Job addBlockout( JobScheduleRequest jobScheduleRequest ) throws IOException, IllegalAccessException, SchedulerException {
        if ( isScheduleAllowed() ) {
            jobScheduleRequest.setActionClass( BlockoutAction.class.getCanonicalName() );
            jobScheduleRequest.getJobParameters().add( getJobScheduleParam( IBlockoutManager.DURATION_PARAM,
                    jobScheduleRequest.getDuration() ) );
            jobScheduleRequest.getJobParameters().add( getJobScheduleParam( IBlockoutManager.TIME_ZONE_PARAM, jobScheduleRequest.getTimeZone() ) );
            updateStartDateForTimeZone( jobScheduleRequest );
            return createJob( jobScheduleRequest );
        }
        throw new IllegalAccessException();
    }

    protected JobScheduleParam getJobScheduleParam( String name, String value ) {
        return new JobScheduleParam( name, value );
    }

    protected JobScheduleParam getJobScheduleParam( String name, long value ) {
        return new JobScheduleParam( name, value );
    }

    protected void updateStartDateForTimeZone( JobScheduleRequest jobScheduleRequest ) {
        SchedulerResourceUtil.updateStartDateForTimeZone( jobScheduleRequest );
    }

    public Job updateBlockout( String jobId, JobScheduleRequest jobScheduleRequest )
            throws IllegalAccessException, SchedulerException, IOException {
        if ( isScheduleAllowed() ) {
            boolean isJobRemoved = removeJob( jobId );
            if ( isJobRemoved ) {
                return addBlockout( jobScheduleRequest );
            }
        }
        throw new IllegalArgumentException();
    }

    public BlockStatusProxy getBlockStatus(JobScheduleRequest jobScheduleRequest ) throws SchedulerException {
        IJobTrigger trigger = convertScheduleRequestToJobTrigger( jobScheduleRequest );
        Boolean totallyBlocked = false;
        Boolean partiallyBlocked = getBlockoutManager().isPartiallyBlocked( trigger );
        if ( partiallyBlocked ) {
            totallyBlocked = !getBlockoutManager().willFire( trigger );
        }
        return getBlockStatusProxy( totallyBlocked, partiallyBlocked );
    }

    protected BlockStatusProxy getBlockStatusProxy( Boolean totallyBlocked, Boolean partiallyBlocked ) {
        return new BlockStatusProxy( totallyBlocked, partiallyBlocked );
    }

    protected IJobTrigger convertScheduleRequestToJobTrigger( JobScheduleRequest jobScheduleRequest )
            throws SchedulerException {
        return SchedulerResourceUtil.convertScheduleRequestToJobTrigger( jobScheduleRequest, scheduler );
    }

    public JobState getJobState( JobRequest jobRequest ) throws SchedulerException {
        Job job = getJob( jobRequest.getJobId() );
        if ( isScheduleAllowed() || getSession().getName().equals( job.getUserName() ) ) {
            return job.getState();
        }

        throw new UnsupportedOperationException();
    }

    protected IPentahoSession getSession() {
        return PentahoSessionHolder.getSession();
    }

    @SuppressWarnings( "unchecked" )
    public Class<IAction> getAction( String actionClass ) throws ClassNotFoundException {
        return ( (Class<IAction>) Class.forName( actionClass ) );
    }

    public IScheduler getScheduler() {
        if ( scheduler == null ) {
            scheduler = PentahoSystem.get( IScheduler.class, "IScheduler2", null );
        }

        return scheduler;
    }

    protected boolean isPdiFile( String file ) {
        return SchedulerResourceUtil.isPdiFile( file );
    }

    protected HashMap<String, Serializable> handlePDIScheduling( String file,
                                                                 HashMap<String, Serializable> parameterMap ) {
        return SchedulerResourceUtil.handlePDIScheduling( file, parameterMap );
    }

    public List<Job> getJobs() throws SchedulerException {
        return getScheduler().getJobs(new IJobFilter() {
            public boolean accept( Job job ) {
                return true;
            }
        } );
    }

    public List<Job> getJobsByFilePath(final String pathId) throws SchedulerException {
        return getScheduler().getJobs(new IJobFilter() {
            public boolean accept( Job job ) {
                String fileName = job.getJobParams().get("job") == null?
                        job.getJobParams().get("transformation")+".ktr":job.getJobParams().get("job")+".kjb";
                String path;
                if(StringUtils.isBlank(((String)job.getJobParams().get("directory")))) {
                    path = job.getJobParams().get("directory") + "/" + fileName;
                } else {
                    path = "/" + job.getJobParams().get("directory") + "/" + fileName;
                }
                return path.toLowerCase().contains(FileUtils.idToPath(pathId).toLowerCase());
            }
        } );
    }

    public Map<Object,Integer> getAllJobState() throws SchedulerException, org.quartz.SchedulerException {
        Map<Object,Integer> state = new HashMap<Object, Integer>();
        List<Job> jobs = getJobs();
        state.put("ALL",jobs.size());
        for (JobState jobState : JobState.values()) {
            state.put(jobState,0);
        }
        Integer i;
        for (Job job : jobs) {
            switch (job.getState()){
                case NORMAL:
                    i = state.get(NORMAL);
                    if(i == null) {
                        state.put(NORMAL,1);
                    } else {
                        state.put(NORMAL,i+1);
                    }
                    break;
                case PAUSED:
                    i = state.get(PAUSED);
                    if(i == null) {
                        state.put(PAUSED,1);
                    } else {
                        state.put(PAUSED,i+1);
                    }
                    break;
                case COMPLETE:
                    i = state.get(COMPLETE);
                    if(i == null) {
                        state.put(COMPLETE,1);
                    } else {
                        state.put(COMPLETE,i+1);
                    }
                    break;
                case ERROR:
                    i = state.get(ERROR);
                    if(i == null) {
                        state.put(ERROR,1);
                    } else {
                        state.put(ERROR,i+1);
                    }
                    break;
                case BLOCKED:
                    i = state.get(BLOCKED);
                    if(i == null) {
                        state.put(BLOCKED,1);
                    } else {
                        state.put(BLOCKED,i+1);
                    }
                    break;
                case UNKNOWN:
                    i = state.get(UNKNOWN);
                    if(i == null) {
                        state.put(UNKNOWN,1);
                    } else {
                        state.put(UNKNOWN,i+1);
                    }
                    break;
                default:
                    break;
            }
        }
        int executing = ((QuartzScheduler) getScheduler()).getQuartzScheduler().getCurrentlyExecutingJobs().size();
        state.put("EXECUTING", executing);
        int normal = state.get(NORMAL)+state.get(COMPLETE)-executing;
        state.put(NORMAL,normal);
        return state;
    }

    protected IBlockoutManager getBlockoutManager() {
        if ( blockoutManager == null ) {
            blockoutManager = PentahoSystem.get( IBlockoutManager.class, "IBlockoutManager", null ); //$NON-NLS-1$;
        }

        return blockoutManager;
    }
}
