package com.xdatainsight.monitor.kettle;

import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.plugins.PluginRegistry;
import org.pentaho.di.core.plugins.RepositoryPluginType;
import org.pentaho.di.repository.RepositoriesMeta;
import org.pentaho.di.repository.Repository;
import org.pentaho.di.repository.RepositoryMeta;
import org.pentaho.platform.engine.core.system.PentahoSystem;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;

public class KettleRepositoryUtil {

    private static final String SINGLE_DI_SERVER_INSTANCE = "singleDiServerInstance";

    private static RepositoryMeta repositoryMeta;

    private KettleRepositoryUtil() {

    }

    public static void init() throws Exception {
        RepositoriesMeta repositoriesMeta = new RepositoriesMeta();

        boolean singleDiServerInstance =
                "true".equals( PentahoSystem.getSystemSetting( SINGLE_DI_SERVER_INSTANCE, "false" ) );

        if ( singleDiServerInstance ) {

            // only load a default enterprise repository. If this option is set, then you cannot load
            // transformations or jobs from anywhere but the local server.
            String repositoriesXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><repositories>"
                    + "<repository><id>PentahoEnterpriseRepository</id>"
                    + "<name>" + SINGLE_DI_SERVER_INSTANCE + "</name>"
                    + "<description>" + SINGLE_DI_SERVER_INSTANCE + "</description>"
                    + "<repository_location_url>" + PentahoSystem.getApplicationContext().getFullyQualifiedServerURL()
                    + "</repository_location_url>"
                    + "<version_comment_mandatory>N</version_comment_mandatory>"
                    + "</repository>"
                    + "</repositories>";

            ByteArrayInputStream sbis = new ByteArrayInputStream( repositoriesXml.getBytes( "UTF8" ) );
            repositoriesMeta.readDataFromInputStream( sbis );
        } else if (PentahoSystem.getSystemSetting( "kettle/settings.xml", "repository.type", "files" ).equals( "rdbms" )) {
            //add support for specified repositories.xml files

            String repositoriesXmlFile = PentahoSystem.getSystemSetting( "kettle/settings.xml", "repositories.xml.file", null );
            String repositoriesXmlFilePath = PentahoSystem.getApplicationContext().getSolutionPath("system/kettle/" + repositoriesXmlFile);
            try (FileInputStream input = new FileInputStream(repositoriesXmlFilePath)) {
                byte[] bytes = new byte[input.available()];

                input.read(bytes);
                repositoriesMeta.readDataFromInputStream(new ByteArrayInputStream(bytes));
            }

        } else {
            throw new KettleException("Kettle system repository not rdbms");
        }

        // Find the specified repository.
        if ( singleDiServerInstance ) {
            repositoryMeta = repositoriesMeta.findRepository( SINGLE_DI_SERVER_INSTANCE );
        } else {
            repositoryMeta = repositoriesMeta.findRepository( PentahoSystem.getSystemSetting( "kettle/settings.xml", "repository.name", "" ));
        }
    }

    public static Repository getRepository() throws Exception {
        if ( repositoryMeta == null ) {
            init();
        }

        Repository repository = PluginRegistry.getInstance()
                .loadClass( RepositoryPluginType.class, repositoryMeta.getId(), Repository.class );
        repository.init( repositoryMeta );

        // OK, now try the username and password


        // Two scenarios here: internal to server or external to server. If internal, you are already authenticated. If
        // external, you must provide a username and additionally specify that the IP address of the machine running this
        // code is trusted.
        repository.connect( PentahoSystem.getSystemSetting( "kettle/settings.xml", "repository.userid", "" ), PentahoSystem.getSystemSetting( "kettle/settings.xml", "repository.password", "" ) );

        // OK, the repository is open and ready to use.
        return repository;

    }

    public static void closeRepository(Repository repository) {
        repository.disconnect();
    }
}
