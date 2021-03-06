package com.xdatainsight.monitor.web.http.api.resources.utils;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.pentaho.platform.util.RepositoryPathEncoder;

public class FileUtils {
    public static final String PATH_SEPARATOR = "/";
    public static final String ENCODED_PATH_SEPARATOR = ":";
    private static final Log logger = LogFactory.getLog( FileUtils.class );

    public static String idToPath( String pathId ) {
        String path = null;
        // slashes in pathId are illegal.. we scrub them out so the file will not be found
        // if the pathId was given in slash separated format
        if ( pathId.contains( PATH_SEPARATOR ) ) {
            logger.warn( "FileResource.ILLEGAL_PATHID" + pathId );
        }
        path = pathId.replaceAll( PATH_SEPARATOR, ENCODED_PATH_SEPARATOR );
        path = RepositoryPathEncoder.decodeRepositoryPath( path );
        if ( !path.startsWith( PATH_SEPARATOR ) ) {
            path = PATH_SEPARATOR + path;
        }
        return path;
    }
}
