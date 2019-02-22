package com.xdatainsight.monitor.web.http.api.resources.services;

import com.xdatainsight.monitor.kettle.EngineMetaLoader;
import com.xdatainsight.monitor.kettle.KettleRepositoryUtil;
import com.xdatainsight.monitor.kettle.PdiAction;
import com.xdatainsight.monitor.web.http.api.resources.utils.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.parameters.DuplicateParamException;
import org.pentaho.di.core.parameters.NamedParams;
import org.pentaho.di.core.parameters.NamedParamsDefault;
import org.pentaho.di.repository.Repository;
import org.pentaho.di.repository.RepositoryDirectoryInterface;
import org.pentaho.di.repository.RepositoryElementMetaInterface;
import org.pentaho.platform.api.action.IAction;
import org.pentaho.platform.api.scheduler2.Job;
import org.pentaho.platform.api.scheduler2.SchedulerException;
import org.pentaho.platform.api.util.IPdiContentProvider;
import org.pentaho.platform.repository2.unified.webservices.RepositoryFileDto;
import org.pentaho.platform.repository2.unified.webservices.RepositoryFileTreeDto;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class FileService {
    private Repository repository;
    private SchedulerService schedulerService;

    private static final Log logger = LogFactory.getLog( FileService.class );

    public FileService() {
        schedulerService = new SchedulerService();
    }

    public RepositoryFileTreeDto doGetTree() {
        try {
            repository = KettleRepositoryUtil.getRepository();
            RepositoryDirectoryInterface directory = repository.loadRepositoryDirectoryTree();
            RepositoryFileTreeDto fileTreeDto = new RepositoryFileTreeDto();
            RepositoryFileDto fileDto = new RepositoryFileDto();
            fileDto.setName(directory.getName());
            fileDto.setFolder(true);
            fileDto.setId(directory.getObjectId().getId());
            fileDto.setPath(directory.getPath());
            fileTreeDto.setFile(fileDto);
            fileTreeDto.setChildren(computeChildren(directory,repository));
            return fileTreeDto;
        } catch (Exception e) {
            logger.error("error get file tree",e);
        } finally {
            if ( repository != null ) {
                repository.disconnect();
            }

        }
        return null;
    }

    public String[] doGetFileParameters(String pathId) {
        try {
            repository = KettleRepositoryUtil.getRepository();
            String idToPath = idToPath( pathId );
            String directory = FilenameUtils.getPathNoEndSeparator( idToPath );
            String fileName = FilenameUtils.getBaseName(idToPath);
            String fileExtension = FilenameUtils.getExtension(idToPath);
            EngineMetaLoader engineMetaUtil = new EngineMetaLoader( repository );
            NamedParams meta = null;
            try {
                if (fileExtension.equalsIgnoreCase("ktr")) {
                    meta = engineMetaUtil.loadTransMeta(directory,fileName);
                } else if (fileExtension.equalsIgnoreCase("kjb") ) {
                    meta = engineMetaUtil.loadJobMeta(directory,fileName);
                }
            }catch (FileNotFoundException e) {
                return new String[] {};
            }

            if ( !isEmpty( meta = filterUserParameters( meta ) ) ) {
                return meta.listParameters();
            }
        } catch (Exception e) {
            logger.error("error get file parameters",e);
        } finally {
            if ( repository != null ) {
                repository.disconnect();
            }
        }

        return new String[] {};


    }

    public String doGetFileContent(String pathId) {
        String idToPath = idToPath( pathId );
        return getFileContent(idToPath);
    }

    private String getFileContent(String path) {
        try {
            repository = KettleRepositoryUtil.getRepository();
            String directory = FilenameUtils.getPathNoEndSeparator( path );
            String fileName = FilenameUtils.getBaseName(path);
            String fileExtension = FilenameUtils.getExtension(path);
            EngineMetaLoader engineMetaUtil = new EngineMetaLoader( repository );
            try {
                if (fileExtension.equalsIgnoreCase("ktr")) {
                    return engineMetaUtil.loadTransMeta(directory,fileName).getXML();
                } else if (fileExtension.equalsIgnoreCase("kjb") ) {
                    return engineMetaUtil.loadJobMeta(directory,fileName).getXML();
                }
            }catch (FileNotFoundException | KettleException e) {
                return "";
            }
        } catch (Exception e) {
            logger.error("error get file parameters",e);
        } finally {
            if ( repository != null ) {
                repository.disconnect();
            }
        }

        return "";
    }

    private List<RepositoryFileTreeDto> computeChildren(RepositoryDirectoryInterface directory,Repository repository ) throws KettleException {
        List<RepositoryElementMetaInterface> elements = repository.getJobAndTransformationObjects(directory.getObjectId(),false);
        List<RepositoryFileTreeDto> children = new ArrayList<>();
        for (RepositoryDirectoryInterface directoryInterface : directory.getChildren()) {
            RepositoryFileTreeDto childrenfiletree = new RepositoryFileTreeDto();
            RepositoryFileDto childrenfile = new RepositoryFileDto();
            childrenfile.setName(directoryInterface.getName());
            childrenfile.setFolder(true);
            childrenfile.setId(directoryInterface.getObjectId().getId());
            childrenfile.setPath(directoryInterface.getPath());
            childrenfiletree.setFile(childrenfile);
            childrenfiletree.setChildren(computeChildren(directoryInterface, repository));
            children.add(childrenfiletree);
        }
        for (RepositoryElementMetaInterface elementMetaInterface : elements) {
            if(elementMetaInterface.getRepositoryDirectory().getObjectId().getId().equals(directory.getObjectId().getId())) {
                RepositoryFileTreeDto filetree = new RepositoryFileTreeDto();
                RepositoryFileDto file = new RepositoryFileDto();
                file.setFolder(false);
                file.setLastModifiedDate(elementMetaInterface.getModifiedDate());
                file.setName(elementMetaInterface.getName()+elementMetaInterface.getObjectType().getExtension());
                file.setId(elementMetaInterface.getObjectId().getId());
                file.setOwner(elementMetaInterface.getModifiedUser());
                if(elementMetaInterface.getRepositoryDirectory().getPath().endsWith("/")) {
                    file.setPath(elementMetaInterface.getRepositoryDirectory().getPath() + elementMetaInterface.getName()+elementMetaInterface.getObjectType().getExtension());
                } else {
                    file.setPath(elementMetaInterface.getRepositoryDirectory().getPath() + "/" + elementMetaInterface.getName()+elementMetaInterface.getObjectType().getExtension());
                }

                filetree.setFile(file);
                children.add(filetree);
            }
        }
        return children;
    }


    private NamedParams filterUserParameters( NamedParams params ) {

        NamedParams userParams = new NamedParamsDefault();

        if ( !isEmpty( params ) ) {

            for ( String paramName : params.listParameters() ) {

                if ( isUserParameter( paramName ) ) {
                    try {
                        userParams.addParameterDefinition( paramName, StringUtils.EMPTY, StringUtils.EMPTY );
                    } catch ( DuplicateParamException e ) {
                        // ignore
                    }
                }
            }
        }

        return userParams;
    }

    private boolean isUserParameter( String paramName ) {

        if ( !StringUtils.isEmpty( paramName ) ) {
            // prevent rendering of protected/hidden/system parameters
            if( paramName.startsWith( IPdiContentProvider.PROTECTED_PARAMETER_PREFIX ) ){
                return false;
            }
        }
        return true;
    }

    private boolean isEmpty( NamedParams np ) {
        return np == null || np.listParameters() == null || np.listParameters().length == 0;

    }

    private String idToPath( String pathId ) {
        return FileUtils.idToPath( pathId );
    }

    public String runTest(String pathId ) {
        PdiAction pdiAction = new PdiAction();
        pdiAction.setDirectory(FilenameUtils.getPathNoEndSeparator(idToPath(pathId)));
        if( FilenameUtils.getExtension(idToPath(pathId)).equalsIgnoreCase( "ktr" ) ) {
            pdiAction.setTransformation( FilenameUtils.getBaseName( idToPath(pathId) ) );
        }
        else if( FilenameUtils.getExtension(idToPath(pathId)).equalsIgnoreCase( "kjb" ) ) { //$NON-NLS-1$
            pdiAction.setJob( FilenameUtils.getBaseName( idToPath(pathId) ) );
        }
        try {
            pdiAction.execute();
        } catch (Exception e) {
            return "error execute";
        }
        return pdiAction.getLog();
    }

    public String doGetFileContentByJobId(String jobId) throws SchedulerException {
        SchedulerService schedulerService = new SchedulerService();
        Job job = schedulerService.getJob(jobId);
        String fileName = job.getJobParams().get("job") == null?
                job.getJobParams().get("transformation")+".ktr":job.getJobParams().get("job")+".kjb";
        String path;
        if(StringUtils.isBlank(((String)job.getJobParams().get("directory")))) {
            path = job.getJobParams().get("directory") + "/" + fileName;
        } else {
            path = "/" + job.getJobParams().get("directory") + "/" + fileName;
        }
        return getFileContent(path);

    }


    public void doDeleteFile(String pathId) throws Exception {
        try {
            repository = KettleRepositoryUtil.getRepository();
            String idToPath = idToPath( pathId );
            String directory = FilenameUtils.getPathNoEndSeparator( idToPath );
            String fileName = FilenameUtils.getBaseName(idToPath);
            String fileExtension = FilenameUtils.getExtension(idToPath);

            if(StringUtils.isBlank(fileExtension)) {
                repository.deleteRepositoryDirectory(repository.findDirectory(directory+"/"+fileName));
            } else if (fileExtension.equalsIgnoreCase("kjb")) {
                repository.deleteJob(repository.getJobId(fileName,repository.findDirectory(directory)));
            } else if (fileExtension.equalsIgnoreCase("ktr")) {
                repository.deleteTransformation(repository.getTransformationID(fileName,repository.findDirectory(directory)));
            }

            List<Job> jobs = schedulerService.getJobsByFilePath(pathId);
            for (Job job : jobs) {
                schedulerService.removeJob(job.getJobId());
            }
        } finally {
            if ( repository != null ) {
                repository.disconnect();
            }
        }
    }

    public void doRenameFile(String pathId,String newName) throws Exception {
        try {
            repository = KettleRepositoryUtil.getRepository();
            String idToPath = idToPath( pathId );
            String directory = FilenameUtils.getPathNoEndSeparator( idToPath );
            String fileName = FilenameUtils.getBaseName(idToPath);
            String fileExtension = FilenameUtils.getExtension(idToPath);

            if(StringUtils.isBlank(fileExtension)) {
                repository.renameRepositoryDirectory(repository.findDirectory(directory+"/"+fileName).getObjectId(),null,newName);
                List<Job> jobs = schedulerService.getJobsByFilePath(pathId);
                for (Job job : jobs) {
                    schedulerService.removeJob(job.getJobId());
                    String originDirectory = "/" + job.getJobParams().get("directory").toString();
                    String[] originPathSplit = originDirectory.split("/");
                    String directory1 = directory;
                    if(!StringUtils.isBlank(directory1)) {
                        directory1 = "/" + directory1;
                    }
                    String[] renamePathSplit = (directory1+"/"+newName).split("/");
                    StringBuilder newPath = new StringBuilder();
                    for (int i = 0; i < originPathSplit.length; i++) {
                        if (i<renamePathSplit.length) {
                            newPath.append(renamePathSplit[i]).append("/");
                        } else {
                            newPath.append(originPathSplit[i]).append("/");
                        }
                    }

                    job.getJobParams().put("directory",FilenameUtils.getFullPathNoEndSeparator(newPath.toString().substring(1)));
                    try {
                        Class<IAction> iAction = schedulerService.getAction( job.getJobParams().get("ActionAdapterQuartzJob-ActionClass").toString() );
                        schedulerService.getScheduler().createJob(job.getJobName(),iAction,job.getJobParams(),job.getJobTrigger());
                    } catch ( ClassNotFoundException e ) {
                        throw new SchedulerException( e );
                    }
                }
            } else if (fileExtension.equalsIgnoreCase("kjb")) {
                repository.renameJob(repository.getJobId(fileName,repository.findDirectory(directory)),null,newName);
                List<Job> jobs = schedulerService.getJobsByFilePath(pathId);
                for (Job job : jobs) {
                    schedulerService.removeJob(job.getJobId());
                    job.getJobParams().put("job",newName);
                    try {
                        Class<IAction> iAction = schedulerService.getAction( job.getJobParams().get("ActionAdapterQuartzJob-ActionClass").toString() );
                        schedulerService.getScheduler().createJob(job.getJobName(),iAction,job.getJobParams(),job.getJobTrigger());
                    } catch ( ClassNotFoundException e ) {
                        throw new SchedulerException( e );
                    }
                }
            } else if (fileExtension.equalsIgnoreCase("ktr")) {
                repository.renameTransformation(repository.getTransformationID(fileName,repository.findDirectory(directory)),null,newName);
                List<Job> jobs = schedulerService.getJobsByFilePath(pathId);
                for (Job job : jobs) {
                    schedulerService.removeJob(job.getJobId());
                    job.getJobParams().put("transformation",newName);
                    try {
                        Class<IAction> iAction = schedulerService.getAction( job.getJobParams().get("ActionAdapterQuartzJob-ActionClass").toString() );
                        schedulerService.getScheduler().createJob(job.getJobName(),iAction,job.getJobParams(),job.getJobTrigger());
                    } catch ( ClassNotFoundException e ) {
                        throw new SchedulerException( e );
                    }
                }
            }
        } finally {
            if ( repository != null ) {
                repository.disconnect();
            }
        }
    }

    public void doCreateDirectory(String parentPathId,String name) throws Exception {
        try {
            repository = KettleRepositoryUtil.getRepository();
            String idToPath = idToPath( parentPathId );
            String directory = FilenameUtils.getPathNoEndSeparator( idToPath );
            String fileName = FilenameUtils.getBaseName(idToPath);
            String fileExtension = FilenameUtils.getExtension(idToPath);
            if(StringUtils.isNotBlank(fileExtension)) {
                throw new KettleException("Can't create directory under a file");
            }
            repository.createRepositoryDirectory(repository.findDirectory(directory+"/"+fileName),name);
        } finally {
            if ( repository != null ) {
                repository.disconnect();
            }
        }
    }
}
