package com.xdatainsight.monitor.web.http.api.resources;

import com.xdatainsight.monitor.web.http.api.resources.services.KettleService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.pentaho.di.core.database.DatabaseMeta;
import org.pentaho.di.repository.kdr.delegates.metastore.KDBRMetaStoreElement;
import org.pentaho.hbase.shim.api.HBaseValueMeta;
import org.pentaho.metastore.api.IMetaStoreElement;

import javax.ws.rs.*;

import java.util.List;
import java.util.Map;

import static javax.ws.rs.core.MediaType.*;

@Path( "/kettle/" )
public class KettleResource extends AbstractJaxRSResource {

    protected static final Log logger = LogFactory.getLog( KettleResource.class );

    protected KettleService kettleService;

    public KettleResource() throws Exception {
        kettleService = new KettleService();
    }

    @POST
    @Path ( "/testConnection" )
    @Consumes( { APPLICATION_FORM_URLENCODED } )
    @Produces( { TEXT_PLAIN } )
    public String testConnection(@FormParam("connection") String json) {
        logRequestData(httpServletRequest, json);
        DatabaseMeta meta = kettleService.parseJson(json);
        boolean success = meta != null && kettleService.testConnection(meta);
        return success ? "true":"false";
    }

    @POST
    @Path ( "/save" )
    @Consumes( { APPLICATION_FORM_URLENCODED } )
    @Produces( { TEXT_PLAIN } )
    public String save(@FormParam("xml") String xml, @QueryParam("pathId") String pathId) {
        logRequestData(httpServletRequest, xml);
        boolean success = kettleService.save(xml, pathId);
        return success ? "true":"false";
    }

    @POST
    @Path ( "/retrieveSchemas" )
    @Consumes( { APPLICATION_FORM_URLENCODED } )
    @Produces( { APPLICATION_JSON, APPLICATION_XML } )
    public List<String> retrieveSchemas(@FormParam("connection") String json) {
        logRequestData(httpServletRequest, json);
        DatabaseMeta meta = kettleService.parseJson(json);
        return kettleService.retrieveSchemas(meta);
    }

    @POST
    @Path ( "/getDatabaseTables" )
    @Consumes( { APPLICATION_FORM_URLENCODED } )
    @Produces( { APPLICATION_JSON, APPLICATION_XML } )
    public List<String> getDatabaseTables(@FormParam("connection") String json, @QueryParam("schema") String schema) {
        logRequestData(httpServletRequest, json);
        DatabaseMeta meta = kettleService.parseJson(json);
        return kettleService.getDatabaseTables(meta,schema);
    }

    @POST
    @Path ( "/getTableFields" )
    @Consumes( { APPLICATION_FORM_URLENCODED } )
    @Produces( { APPLICATION_JSON, APPLICATION_XML } )
    public List<String> getTableFields(@FormParam("connection") String json,@QueryParam("table") String table) {
        logRequestData(httpServletRequest, json);
        DatabaseMeta meta = kettleService.parseJson(json);
        return kettleService.getTableFields(meta,table);
    }

    @GET
    @Path ( "/getNamedClusters" )
    @Produces( { APPLICATION_JSON, APPLICATION_XML } )
    public List<CustomMetaStoreElement> getNamedClusters() {
        logRequestData(httpServletRequest, "");
        return kettleService.getNamedClusters();
    }

    @POST
    @Path ( "/updateNamedCluster" )
    @Consumes ( { APPLICATION_JSON } )
    @Produces( { TEXT_PLAIN } )
    public String updateNamedCluster(@QueryParam("id")String elementId, CustomMetaStoreElement element) {
        logRequestData(httpServletRequest,toJSon(element));
        boolean success = kettleService.updateNamedCluster(elementId,element);
        return success ? "true":"false";
    }

    @POST
    @Path ( "/createNamedCluster" )
    @Consumes ( { APPLICATION_JSON } )
    @Produces( { TEXT_PLAIN } )
    public String createNamedCluster( CustomMetaStoreElement element ) {
        logRequestData(httpServletRequest,toJSon(element));
        boolean success = kettleService.createNamedCluster(element);
        return success ? "true":"false";
    }

    @GET
    @Path ( "/deleteNamedCluster" )
    @Produces( { TEXT_PLAIN } )
    public String deleteNamedCluster( @QueryParam("id")String elementId ) {
        logRequestData(httpServletRequest,"");
        boolean success = kettleService.deleteNamedCluster(elementId);
        return success ? "true":"false";
    }

    @POST
    @Path ( "/createDatabase" )
    @Consumes( { APPLICATION_FORM_URLENCODED } )
    @Produces( { TEXT_PLAIN } )
    public String createDatabase( @FormParam("connection") String json ) {
        logRequestData(httpServletRequest, json);
        DatabaseMeta meta = kettleService.parseJson(json);
        boolean success = meta != null && kettleService.updateDatabase(meta);
        return success ? "true":"false";
    }

    @POST
    @Path ( "/updateDatabase" )
    @Consumes( { APPLICATION_FORM_URLENCODED } )
    @Produces( { TEXT_PLAIN } )
    public String updateDatabase( @FormParam("connection") String json ) {
        logRequestData(httpServletRequest, json);
        DatabaseMeta meta = kettleService.parseJson(json);
        boolean success = meta != null && kettleService.updateDatabase(meta);
        return success ? "true":"false";
    }

    @GET
    @Path ( "/deleteDatabase" )
    @Produces( { TEXT_PLAIN } )
    public String deleteDatabase( @QueryParam("databaseName")String databaseName ) {
        logRequestData(httpServletRequest,"");
        boolean success = kettleService.deleteDatabase(databaseName);
        return success ? "true":"false";
    }

    @GET
    @Path("/getTables")
    @Produces( {APPLICATION_JSON} )
    public List getTables(@QueryParam("clusterName") String clusterName) {
        return kettleService.getTables(clusterName);
    }

    @GET
    @Path("/getMappingsForTable")
    @Produces( {APPLICATION_JSON} )
    public List getMappingsForTable(@QueryParam("clusterName") String clusterName, @QueryParam("tableName") String tableName) {
        return kettleService.getMappingsForTable(clusterName, tableName);
    }

    @GET
    @Path("/getMapping")
    @Produces( {APPLICATION_JSON})
    public Map getMapping(@QueryParam("clusterName") String clusterName, @QueryParam("tableName") String tableName, @QueryParam("mappingName") String mappingName) {
        return kettleService.getMapping(clusterName, tableName, mappingName);
    }

    @POST
    @Path ( "/saveMapping" )
    @Consumes( { APPLICATION_JSON } )
    @Produces( { TEXT_PLAIN } )
    public String saveMapping( @QueryParam("clusterName") String clusterName, @QueryParam("tableName") String tableName, @QueryParam("mappingName") String mappingName, Map mapping ) {
        logRequestData(httpServletRequest, toJSon(mapping));
        return kettleService.saveMapping(clusterName, tableName, mappingName, mapping);
    }

}
