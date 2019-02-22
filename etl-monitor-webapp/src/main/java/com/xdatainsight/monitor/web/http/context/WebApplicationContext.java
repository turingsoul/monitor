package com.xdatainsight.monitor.web.http.context;

import org.pentaho.platform.engine.core.system.PentahoSystem;
import org.pentaho.platform.engine.core.system.StandaloneApplicationContext;

public class WebApplicationContext extends StandaloneApplicationContext {

    private String fullyQualifiedServerUrl;

    public WebApplicationContext( final String solutionRootPath, final String fullyQualifiedServerUrl,
                                  final String applicationPath, final Object context ) {
        super( solutionRootPath, applicationPath, context );

        this.fullyQualifiedServerUrl = fullyQualifiedServerUrl;
    }

    @Override
    public String getFullyQualifiedServerURL() {
        if ( !fullyQualifiedServerUrl.endsWith( "/" ) ) {
            fullyQualifiedServerUrl = fullyQualifiedServerUrl + "/";
        }
        return fullyQualifiedServerUrl;
    }

    @Override
    public String getPentahoServerName() {
        return PentahoSystem
                .getSystemSetting( "name", "ETL-monitor" );
    }

    @Override
    public void setFullyQualifiedServerURL( final String fullyQualifiedServerUrl ) {
        this.fullyQualifiedServerUrl = fullyQualifiedServerUrl;
    }

}
