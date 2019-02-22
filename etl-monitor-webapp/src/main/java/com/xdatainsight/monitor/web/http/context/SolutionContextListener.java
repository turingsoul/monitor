package com.xdatainsight.monitor.web.http.context;

import org.apache.commons.lang.StringUtils;
import org.pentaho.platform.api.engine.IApplicationContext;
import org.pentaho.platform.api.engine.IPentahoObjectFactory;
import org.pentaho.platform.engine.core.system.PathBasedSystemSettings;
import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.util.logging.Logger;
import org.pentaho.platform.util.messages.LocaleHelper;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.File;
import java.util.Enumeration;
import java.util.Locale;
import java.util.Properties;

public class SolutionContextListener implements ServletContextListener {

    protected static String solutionPath;

    protected static String contextPath;

    private static final String DEFAULT_SPRING_CONFIG_FILE_NAME = "spring-beans.xml"; //$NON-NLS-1$

    public void contextInitialized( final ServletContextEvent event ) {

        ServletContext context = event.getServletContext();

        LocaleHelper.setLocale( Locale.getDefault() );

        LocaleHelper.setDefaultLocale( LocaleHelper.getLocale() );
        // log everything that goes on here
        Logger.info( SolutionContextListener.class.getName(), "SolutionContextListener.INFO_INITIALIZING" );
        Logger.info( SolutionContextListener.class.getName(), "SolutionContextListener.INFO_SERVLET_CONTEXT" + context );
        SolutionContextListener.contextPath = context.getRealPath( "" );
        Logger.info( SolutionContextListener.class.getName(), "SolutionContextListener.INFO_CONTEXT_PATH" + SolutionContextListener.contextPath ); //$NON-NLS-1$

        SolutionContextListener.solutionPath = SolutionContextListener.contextPath + File.separator + "WEB-INF";


        Logger.info(getClass().getName(), "SolutionContextListener.INFO_ROOT_PATH" + SolutionContextListener.solutionPath );

        String fullyQualifiedServerUrl = "http://localhost:8080/";

        IApplicationContext applicationContext =
                new WebApplicationContext( SolutionContextListener.solutionPath, fullyQualifiedServerUrl, context
                        .getRealPath( "" ), context );

        // Copy out all the initParameter values from the servlet context and put them in the application context.
        Properties props = new Properties();
        Enumeration<?> initParameterNames = context.getInitParameterNames();
        String initParameterName;
        while ( initParameterNames.hasMoreElements() ) {
            initParameterName = (String) initParameterNames.nextElement();
            props.setProperty( initParameterName, context.getInitParameter( initParameterName ) );
        }
        ( (WebApplicationContext) applicationContext ).setProperties( props );

        setSystemCfgFile();
        setObjectFactory( context );

        boolean initOk = PentahoSystem.init( applicationContext );

        this.showInitializationMessage( initOk, fullyQualifiedServerUrl );
    }

    private void setObjectFactory( final ServletContext context ) {

        String objectFactoryClassName = context.getInitParameter( "objectFactory" );
        String objectFactoryConfigFile = context.getInitParameter( "objectFactoryCfgFile" );

        // if web.xml doesn't specify a config file, use the default path.
        if ( objectFactoryConfigFile == null || StringUtils.isEmpty( objectFactoryConfigFile ) ) {
            objectFactoryConfigFile = solutionPath + "/" + DEFAULT_SPRING_CONFIG_FILE_NAME;
        } else if (!objectFactoryConfigFile.contains("/")) {
            objectFactoryConfigFile = solutionPath + "/" + objectFactoryConfigFile;
        }
        IPentahoObjectFactory objectFactory;
        try {
            Class<?> classObject = Class.forName( objectFactoryClassName );
            objectFactory = (IPentahoObjectFactory) classObject.newInstance();
        } catch ( Exception e ) {
            String msg = "SolutionContextListener.ERROR_0002_BAD_OBJECT_FACTORY";
            // Cannot proceed without an object factory, so we'll put some context around what
            // we were trying to do throw a runtime exception
            throw new RuntimeException( msg, e );
        }
        objectFactory.init( objectFactoryConfigFile, context );
        PentahoSystem.registerPrimaryObjectFactory( objectFactory );
    }

    private void setSystemCfgFile() {
        System.setProperty(PathBasedSystemSettings.SYSTEM_CFG_PATH_KEY, solutionPath + "/" + "monitor.xml");
    }

    public void showInitializationMessage( final boolean initOk, final String fullyQualifiedServerUrl ) {

            if ( initOk ) {
                System.out.println( "SolutionContextListener.INFO_SYSTEM_READY" );
            } else {
                System.err.println("SolutionContextListener.INFO_SYSTEM_NOT_READY" + fullyQualifiedServerUrl );
            }

    }


    public void contextDestroyed( final ServletContextEvent event ) {

        PentahoSystem.shutdown();
        if ( LocaleHelper.getLocale() == null ) {
            LocaleHelper.setLocale( Locale.getDefault() );
        }
        // log everything that goes on here
        Logger.info( SolutionContextListener.class.getName(), "SolutionContextListener.INFO_SYSTEM_EXITING" );
    }
}
