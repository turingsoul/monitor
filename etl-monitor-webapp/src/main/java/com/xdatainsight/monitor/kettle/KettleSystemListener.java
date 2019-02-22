package com.xdatainsight.monitor.kettle;

import org.pentaho.di.core.Const;
import org.pentaho.di.core.KettleEnvironment;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.logging.KettleLogStore;
import org.pentaho.platform.api.engine.IPentahoSession;
import org.pentaho.platform.api.engine.IPentahoSystemListener;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.util.logging.Logger;

public class KettleSystemListener implements IPentahoSystemListener {

    /**
     * If {@code true}, send Kettle output to the platform log file (e.g. pentaho.log) in addition to its normal
     * destinations.
     */
    private boolean usePlatformLogFile = true;

    public boolean startup( final IPentahoSession session ) {

        if ( usePlatformLogFile ) {
            KettleLogStore.init( false, false );
            initLogging();
        }


        // Inform Kettle where the plugins should be loaded
        System.setProperty( Const.PLUGIN_BASE_FOLDERS_PROP, Const.DEFAULT_PLUGIN_BASE_FOLDERS + "," +
                PentahoSystem.getApplicationContext().getSolutionPath( "system/kettle/plugins" ) );

        try {
            System.setProperty(Const.KETTLE_DISABLE_CONSOLE_LOGGING,"Y");
            KettleSystemListener.environmentInit( session );
        } catch ( Throwable t ) {
            Logger.error( KettleSystemListener.class.getName(), "KettleSystemListener.ERROR_0001_PLUGIN_LOAD_FAILED" );
            return false;
        }
        return true;
    }

    /**
     * Sends Kettle's logs to the platform log as well.
     */
    protected void initLogging() {

    }

    public static void environmentInit( final IPentahoSession session ) throws KettleException {
        // init kettle without simplejndi
        KettleEnvironment.init( false );
    }

    public void shutdown() {
        //nothing to do
    }


}
