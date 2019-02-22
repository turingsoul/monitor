package com.xdatainsight.monitor.web.http.api.resources.services;

import com.xdatainsight.monitor.kettle.KettleRepositoryUtil;
import com.xdatainsight.monitor.web.http.api.resources.CustomMetaStoreElement;
import com.xdatainsight.monitor.web.http.api.resources.utils.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.pentaho.di.core.Const;
import org.pentaho.di.core.database.Database;
import org.pentaho.di.core.database.DatabaseMeta;
import org.pentaho.di.core.exception.KettleDatabaseException;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.hadoop.HadoopConfigurationBootstrap;
import org.pentaho.di.core.lifecycle.KettleLifecycleListener;
import org.pentaho.di.core.namedcluster.NamedClusterManager;
import org.pentaho.di.core.namedcluster.model.NamedCluster;
import org.pentaho.di.core.plugins.KettleLifecyclePluginType;
import org.pentaho.di.core.plugins.LifecyclePluginType;
import org.pentaho.di.core.plugins.PluginInterface;
import org.pentaho.di.core.plugins.PluginRegistry;
import org.pentaho.di.core.xml.XMLHandler;
import org.pentaho.di.job.JobMeta;
import org.pentaho.di.repository.Repository;
import org.pentaho.di.repository.RepositoryDirectoryInterface;
import org.pentaho.di.repository.kdr.delegates.metastore.KDBRMetaStoreElement;
import org.pentaho.di.trans.TransMeta;
import org.pentaho.hadoop.shim.HadoopConfiguration;
import org.pentaho.hadoop.shim.HadoopConfigurationLocator;
import org.pentaho.hadoop.shim.api.ActiveHadoopConfigurationLocator;
import org.pentaho.hadoop.shim.spi.HadoopConfigurationProvider;
import org.pentaho.hbase.mapping.MappingAdmin;
import org.pentaho.hbase.shim.api.HBaseValueMeta;
import org.pentaho.hbase.shim.api.Mapping;
import org.pentaho.hbase.shim.spi.HBaseConnection;
import org.pentaho.hbase.shim.spi.HBaseShim;
import org.pentaho.metastore.api.IMetaStoreAttribute;
import org.pentaho.metastore.api.IMetaStoreElement;
import org.pentaho.metastore.api.IMetaStoreElementType;
import org.pentaho.metastore.api.exceptions.MetaStoreException;
import org.pentaho.metastore.util.PentahoDefaults;
import org.w3c.dom.Node;

import java.io.IOException;
import java.util.*;

public class KettleService {
    private Repository repository;
    public KettleService() {}

    public boolean testConnection(DatabaseMeta meta) {

        Database database = new Database( null, meta );
        try {
            database.connect();
            return true;
        } catch (KettleDatabaseException e) {
            return false;
        } finally {
            database.disconnect();
        }


    }

    /**/
    public boolean save(String xml,String pathId) {
        String path = FileUtils.idToPath( pathId );
        String directory = FilenameUtils.getPathNoEndSeparator( path );
        String fileName = FilenameUtils.getBaseName(path);
        String fileExtension = FilenameUtils.getExtension(path);
        Node node;
        try {
            repository = KettleRepositoryUtil.getRepository();
            if (fileExtension.equalsIgnoreCase("ktr")) {
                RepositoryDirectoryInterface dir = repository.loadRepositoryDirectoryTree().findDirectory( directory );
                TransMeta preTrans = repository.loadTransformation(fileName, dir, null, true, null);
                node = XMLHandler.loadXMLString(xml, TransMeta.XML_TAG);
                TransMeta meta = new TransMeta(node,null);
                meta.setRepositoryDirectory(repository.findDirectory(directory));
                meta.setName(fileName);
                meta.setObjectId(preTrans.getObjectId());
                try {
                    List<String> databases = Arrays.asList(meta.getDatabaseNames());
                    for (String name : repository.getDatabaseNames(false)) {
                        if (!databases.contains(name)) {
                            repository.deleteDatabaseMeta(name);
                        }
                    }
                } catch (Throwable ignored) {
                }

                //TODO ENCR PASSWORD
                repository.save(meta,"authored by etl-monitor",null,true);
            } else if (fileExtension.equalsIgnoreCase("kjb") ) {
                RepositoryDirectoryInterface dir = repository.loadRepositoryDirectoryTree().findDirectory( directory );
                JobMeta preJob = repository.loadJob( fileName, dir, null, null );
                node = XMLHandler.loadXMLString(xml, JobMeta.XML_TAG);
                JobMeta meta = new JobMeta(node,null,null);
                meta.setRepositoryDirectory(repository.findDirectory(directory));
                meta.setName(fileName);
                meta.setObjectId(preJob.getObjectId());
                try {
                    List<String> databases = Arrays.asList(meta.getDatabaseNames());
                    for (String name : repository.getDatabaseNames(false)) {
                        if (!databases.contains(name)) {
                            repository.deleteDatabaseMeta(name);
                        }
                    }
                } catch (Throwable ignored) {
                }

                //TODO ENCR PASSWORD
                repository.save(meta,"authored by etl-monitor",null,true);
            }
            return true;


        } catch (Exception e) {
            return false;
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }


    }

    public List<String> retrieveSchemas(DatabaseMeta meta ) {
        List<String> schemas = new ArrayList<>();
        try {
            Database database = new Database( null, meta );
            database.connect();
            Map<String, Collection<String>> tableMap = database.getTableMap( null );

            //database.getSchemas()

            Set<String> schemaNames = tableMap.keySet();
            schemas.addAll( schemaNames );
            database.disconnect();
        } catch ( KettleDatabaseException ignored) {

        }
        return schemas;
    }

    public List<String> getDatabaseTables( DatabaseMeta meta, String schema ) {
        List<String> tables = new ArrayList<>();
        try {
            Database database = new Database( null, meta );
            database.connect();
            String[] tableNames = database.getTablenames( schema, false );
            tables.addAll( Arrays.asList( tableNames ) );
            tables.addAll( Arrays.asList( database.getViews( schema, false ) ) );
            database.disconnect();

        } catch ( KettleDatabaseException ignored) {
        }
        return tables;
    }

    public List<String> getTableFields( DatabaseMeta meta, String table ) {
        try {
            Database database = new Database( null, meta );
            database.connect();

            String query = meta.getSQLQueryFields( table );
            // Setting the query limit to 1 before executing the query
            database.setQueryLimit( 1 );
            database.getRows( query, 1 );
            String[] tableFields = database.getReturnRowMeta().getFieldNames();

            List<String> fields = Arrays.asList( tableFields );
            database.disconnect();
            return fields;
        } catch ( KettleDatabaseException e ) {
            return new ArrayList<>();
        }
    }

    public List<CustomMetaStoreElement> getNamedClusters() {
        //TODO GET element type from big-data-plugin NamedClusterImpl annotation

        IMetaStoreElementType elementType;
        try {
            repository = KettleRepositoryUtil.getRepository();
            elementType = repository.getMetaStore().getElementTypeByName( PentahoDefaults.NAMESPACE, "NamedCluster" );
            ArrayList<CustomMetaStoreElement> list = new ArrayList<>();
            for (IMetaStoreElement element : repository.getMetaStore().getElements(PentahoDefaults.NAMESPACE, elementType)) {
                list.add(fromElement(element));
            }
            return list;
        } catch (Exception e) {
            return new ArrayList<>();
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }

    }

    public boolean updateNamedCluster(String elementId, CustomMetaStoreElement element) {

        IMetaStoreElementType elementType;
        try {
            repository = KettleRepositoryUtil.getRepository();
            elementType = repository.getMetaStore().getElementTypeByName( PentahoDefaults.NAMESPACE, "NamedCluster" );
            repository.getMetaStore().updateElement(PentahoDefaults.NAMESPACE,elementType,elementId,toElement(element));
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }

    }

    public boolean createNamedCluster(CustomMetaStoreElement element) {

        IMetaStoreElementType elementType;
        try {
            repository = KettleRepositoryUtil.getRepository();
            elementType = repository.getMetaStore().getElementTypeByName( PentahoDefaults.NAMESPACE, "NamedCluster" );
            repository.getMetaStore().createElement(PentahoDefaults.NAMESPACE,elementType,toElement(element));
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }

    }

    public boolean deleteNamedCluster(String elementId) {

        IMetaStoreElementType elementType;
        try {
            repository = KettleRepositoryUtil.getRepository();
            elementType = repository.getMetaStore().getElementTypeByName( PentahoDefaults.NAMESPACE, "NamedCluster" );
            repository.getMetaStore().deleteElement(PentahoDefaults.NAMESPACE,elementType,elementId);
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }

    }

    public boolean updateDatabase(DatabaseMeta meta) {
        try {
            repository = KettleRepositoryUtil.getRepository();
            repository.save(meta,"authored by etl-monitor",null,true);
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }
    }

    public boolean deleteDatabase(String databaseName) {
        try {
            repository = KettleRepositoryUtil.getRepository();
            repository.deleteDatabaseMeta(databaseName);
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }
    }

    public DatabaseMeta parseJson(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode rootNode = objectMapper.readTree(json);
            String name = rootNode.path("name").asText();
            String server = rootNode.path("server").asText();
            String type = rootNode.path("type").asText();
            String access = rootNode.path("access").asText();
            String database = rootNode.path("database").asText();
            String port = rootNode.path("port").asText();
            String username = rootNode.path("username").asText();
            String password = rootNode.path("password").asText();
            String servername = rootNode.path("servername").asText();
            String data_tablespace = rootNode.path("data_tablespace").asText();
            String index_tablespace = rootNode.path("index_tablespace").asText();

            Properties attributes = new Properties();
            JsonNode attributeNode = rootNode.path("attributes").path("attribute");
            if (attributeNode.isArray()) {
                for (JsonNode jsonNode : attributeNode) {
                    String code = jsonNode.path("code").asText();
                    String attribute = jsonNode.path("attribute").asText();
                    attributes.put(code,attribute);
                }
            }

            DatabaseMeta meta = new DatabaseMeta();
            meta.setName(name);
            meta.setHostname(server);
            meta.setDatabaseType(type);
            if(access.equalsIgnoreCase("native")) {
                meta.setAccessType(DatabaseMeta.TYPE_ACCESS_NATIVE);
            } else if (access.equalsIgnoreCase("jndi")) {
                meta.setAccessType(DatabaseMeta.TYPE_ACCESS_JNDI);
            } else if (access.equalsIgnoreCase("odbc")) {
                meta.setAccessType(DatabaseMeta.TYPE_ACCESS_ODBC);
            } else if (access.equalsIgnoreCase("plugin")) {
                meta.setAccessType(DatabaseMeta.TYPE_ACCESS_PLUGIN);
            } else if (access.equalsIgnoreCase("oci")) {
                meta.setAccessType(DatabaseMeta.TYPE_ACCESS_OCI);
            }
            meta.setDBName(database);
            meta.setDBPort(port);
            meta.setUsername(username);
            meta.setPassword(password);
            meta.setServername(servername);
            meta.setDataTablespace(data_tablespace);
            meta.setIndexTablespace(index_tablespace);
            meta.setAttributes(attributes);

            return meta;

        } catch (IOException e) {

            return null;
        }
    }

    private CustomMetaStoreElement fromElement(IMetaStoreElement element) {
        CustomMetaStoreElement customElement = new CustomMetaStoreElement();

        customElement.setId(element.getId());
        customElement.setName(element.getName());
        Map<String,String> attributes = new HashMap<>();

        for (IMetaStoreAttribute attribute : element.getChildren()) {
            attributes.put(attribute.getId(),attribute.getValue() == null? "":attribute.getValue().toString());
        }

        customElement.setAttributes(attributes);

        return customElement;
    }

    private IMetaStoreElement toElement(CustomMetaStoreElement element) {
        IMetaStoreElement metaStoreElement = new KDBRMetaStoreElement();
        metaStoreElement.setName(element.getName());
        for (String s : element.getAttributes().keySet()) {
            IMetaStoreAttribute attribute = new KDBRMetaStoreElement();
            attribute.setId(s);
            attribute.setValue(element.getAttributes().get(s));
            metaStoreElement.addChild(attribute);
        }


        return metaStoreElement;
    }

    private Object getHBaseConnection(String clusterName) throws Exception {

        try {
            repository = KettleRepositoryUtil.getRepository();
            NamedCluster namedCluster = NamedClusterManager.getInstance().read(clusterName, repository.getMetaStore());
            String zookeeperHost = "";
            String zookeeperPort = "";

            if ( namedCluster != null ) {
                zookeeperHost = namedCluster.getZooKeeperHost();
                zookeeperPort = namedCluster.getZooKeeperPort();
            }

            Properties connProps = new Properties();
            connProps.setProperty( HBaseConnection.ZOOKEEPER_QUORUM_KEY, zookeeperHost );
            connProps.setProperty( HBaseConnection.ZOOKEEPER_PORT_KEY, zookeeperPort );

            PluginInterface hadoopPlugin = PluginRegistry.getInstance().getPlugin(KettleLifecyclePluginType.class,HadoopConfigurationBootstrap.PLUGIN_ID);
            Class<HadoopConfigurationBootstrap> aa = PluginRegistry.getInstance().getClass(hadoopPlugin, HadoopConfigurationBootstrap.class.getName());

            Object provider = aa.getDeclaredMethod("getHadoopConfigurationProvider").invoke(null);
            Object activeConfiguration = provider.getClass().getDeclaredMethod("getActiveConfiguration").invoke(provider);
            Object hBaseShim = activeConfiguration.getClass().getDeclaredMethod("getHBaseShim").invoke(activeConfiguration);
            Object hBaseConnection = hBaseShim.getClass().getDeclaredMethod("getHBaseConnection").invoke(hBaseShim);
            hBaseConnection.getClass().getMethod("configureConnection", Properties.class, List.class).invoke(hBaseConnection,connProps,null);

            return hBaseConnection;
        } finally {
            if (repository != null) {
                repository.disconnect();
            }
        }
    }

    public List getTables(String clusterName) {
        try {
            Object hbAdmin = getHBaseConnection(clusterName);
            hbAdmin.getClass().getMethod("checkHBaseAvailable").invoke(hbAdmin);

            return ((List) hbAdmin.getClass().getMethod("listTableNames").invoke(hbAdmin));
        } catch (Exception e) {
            return new ArrayList();
        }

    }

    public List getMappingsForTable(String clusterName, String tableName) {
        try {
            Object hbAdmin = getHBaseConnection(clusterName);
            hbAdmin.getClass().getMethod("checkHBaseAvailable").invoke(hbAdmin);

            Class m_adminClass = Class.forName("org.pentaho.hbase.mapping.MappingAdmin",true,hbAdmin.getClass().getClassLoader());
            Object m_admin = m_adminClass.newInstance();
            m_admin.getClass().getMethod("setConnection",Class.forName("org.pentaho.hbase.shim.spi.HBaseConnection",true, hbAdmin.getClass().getClassLoader())).invoke(m_admin, hbAdmin);
            return ((List) m_admin.getClass().getMethod("getMappingNames", String.class).invoke(m_admin, tableName));
        } catch (Exception e) {
            return new ArrayList();
        }
    }

    public Map getMapping(String clusterName, String tableName, String mappingName) {
        try {
            Object hbAdmin = getHBaseConnection(clusterName);
            hbAdmin.getClass().getMethod("checkHBaseAvailable").invoke(hbAdmin);

            Class m_adminClass = Class.forName("org.pentaho.hbase.mapping.MappingAdmin",true,hbAdmin.getClass().getClassLoader());
            Object m_admin = m_adminClass.newInstance();
            m_admin.getClass().getMethod("setConnection",Class.forName("org.pentaho.hbase.shim.spi.HBaseConnection",true, hbAdmin.getClass().getClassLoader())).invoke(m_admin, hbAdmin);
            Object mapping = m_admin.getClass().getMethod("getMapping",String.class,String.class).invoke(m_admin, tableName, mappingName);
            Map originMap =  ((Map) mapping.getClass().getMethod("getMappedColumns").invoke(mapping));

            Map<String,Map> returnMap = new HashMap();
            Map<String, Object> keyMap = new HashMap<>();
            keyMap.put("name",mapping.getClass().getMethod("getKeyName").invoke(mapping));
            keyMap.put("typeDesc",mapping.getClass().getMethod("getKeyType").invoke(mapping).toString());
            keyMap.put("columnFamily",mapping.getClass().getMethod("getTupleFamilies").invoke(mapping));
            keyMap.put("columnName","");
            keyMap.put("key",true);
            keyMap.put("alias",mapping.getClass().getMethod("getKeyName").invoke(mapping));
            returnMap.put(mapping.getClass().getMethod("getKeyName").invoke(mapping).toString(), keyMap);
            for (Object o : originMap.keySet()) {
                Object meta = originMap.get(o);
                Map<String, Object> columnMap = new HashMap<>();
                columnMap.put("name",meta.getClass().getMethod("getAlias").invoke(meta));
                columnMap.put("alias",meta.getClass().getMethod("getAlias").invoke(meta));
                columnMap.put("typeDesc",meta.getClass().getMethod("getHBaseTypeDesc").invoke(meta));
                columnMap.put("columnFamily",meta.getClass().getMethod("getColumnFamily").invoke(meta));
                columnMap.put("columnName",meta.getClass().getMethod("getColumnName").invoke(meta));
                columnMap.put("key",meta.getClass().getMethod("isKey").invoke(meta));
                returnMap.put(meta.getClass().getMethod("getAlias").invoke(meta).toString(),columnMap);
            }
            return returnMap;
        } catch (Exception e) {
            return null;
        }
    }

    public String saveMapping(String clusterName, String tableName, String mappingName, Map mapping) {
        try {
            Object hbAdmin = getHBaseConnection(clusterName);
            hbAdmin.getClass().getMethod("checkHBaseAvailable").invoke(hbAdmin);

            Class m_adminClass = Class.forName("org.pentaho.hbase.mapping.MappingAdmin",true,hbAdmin.getClass().getClassLoader());
            Object m_admin = m_adminClass.newInstance();
            m_admin.getClass().getMethod("setConnection",Class.forName("org.pentaho.hbase.shim.spi.HBaseConnection",true, hbAdmin.getClass().getClassLoader())).invoke(m_admin, hbAdmin);
            Object map = getMapping(tableName,mappingName,mapping,hbAdmin.getClass().getClassLoader());
            m_admin.getClass().getMethod("putMapping",Class.forName("org.pentaho.hbase.shim.api.Mapping",true, hbAdmin.getClass().getClassLoader()),boolean.class).invoke(m_admin,map,true);
            return "true";
        } catch (Exception e) {
            return e.getMessage();
        }

    }

    public Object getMapping( String tableName, String mappingName, Map mapping, ClassLoader classloader ) throws Exception {

        if ( !Const.isEmpty( tableName.trim() ) ) {
            tableName = tableName.trim();
            if ( tableName.indexOf( '@' ) > 0 ) {
                tableName = tableName.substring( 0, tableName.indexOf( '@' ) );
            }
        } else {
            throw new Exception("tableName Empty");
        }

        Class mappingClass = Class.forName("org.pentaho.hbase.shim.api.Mapping",true,classloader);
        Object map = mappingClass.newInstance();

        map.getClass().getMethod("setTableName",String.class).invoke(map,tableName);
        map.getClass().getMethod("setMappingName",String.class).invoke(map,mappingName);

        boolean keyDefined = false;
        boolean moreThanOneKey = false;
        List<String> missingFamilies = new ArrayList<>();
        List<String> missingColumnNames = new ArrayList<>();
        List<String> missingTypes = new ArrayList<>();

        int nrNonEmpty = mapping.size();

        // is the mapping a tuple mapping?
        boolean isTupleMapping = false;
        int tupleIdCount = 0;
        if ( nrNonEmpty == 5 ) {

            for (Object o : mapping.keySet()) {
                Map map1 = ((Map) mapping.get(o));
                if ( map1.get("alias").toString().equals( "KEY" )
                        || map1.get("alias").toString().equals( "Family" )
                        || map1.get("alias").toString().equals( "Column" )
                        || map1.get("alias").toString().equals( "Value" )
                        || map1.get("alias").toString().equals( "Timestamp" ) ) {
                    tupleIdCount++;
                }
            }
        }

        if ( tupleIdCount == 5 ) {
            isTupleMapping = true;
            map.getClass().getMethod("setTupleMapping", boolean.class).invoke(map, isTupleMapping);
        }

        for ( Object o : mapping.keySet() ) {
            Map map1 = ((Map) mapping.get(o));
            boolean isKey;
            String alias = null;
            if ( !Const.isEmpty( map1.get("alias").toString() ) ) {
                alias = map1.get("alias").toString().trim();
            }

            //isKey
            isKey = ((boolean) map1.get("key"));

            if ( isKey && keyDefined ) {
                // more than one key, break here
                moreThanOneKey = true;
                break;
            }
            if ( isKey ) {
                keyDefined = true;
            }

            // String family = null;
            String family = "";
            if ( !Const.isEmpty( map1.get("columnFamily").toString() ) ) {
                family = map1.get("columnFamily").toString();
            } else {
                if ( !isKey && !isTupleMapping ) {
                    missingFamilies.add( alias );
                }
            }
            // String colName = null;
            String colName = "";
            if ( !Const.isEmpty( map1.get("columnName").toString() ) ) {
                colName = map1.get("columnName").toString();
            } else {
                if ( !isKey && !isTupleMapping ) {
                    missingColumnNames.add( alias );
                }
            }
            String type = null;
            if ( !Const.isEmpty( map1.get("typeDesc").toString() ) ) {
                type = map1.get("typeDesc").toString();
            } else {
                missingTypes.add( alias );
            }

            // only add if we have all data and its all correct
            if ( isKey && !moreThanOneKey ) {
                if ( Const.isEmpty( alias ) ) {
                    // pop up an error dialog - key must have an alias because it does not
                    // belong to a column family or have a column name
                    throw new Exception("NoAliasForKey");
                }

                if ( Const.isEmpty( type ) ) {
                    // pop up an error dialog - must have a type for the key
                    throw new Exception("NoTypeForKey");
                }

                if ( moreThanOneKey ) {
                    // popup an error and then return
                    throw new Exception("MoreThanOneKey");
                }

                if ( isTupleMapping ) {
                    map.getClass().getMethod("setKeyName", String.class).invoke(map, alias);
                    map.getClass().getMethod("setTupleFamilies", String.class).invoke(map, family);
                } else {
                    map.getClass().getMethod("setKeyName", String.class).invoke(map, alias);
                }
                try {
                    map.getClass().getMethod("setKeyTypeAsString", String.class).invoke(map, type);
                } catch ( Exception ex ) {
                    // Ignore
                }
            } else {
                // don't bother adding if there are any errors
                if ( missingFamilies.size() == 0 && missingColumnNames.size() == 0 && missingTypes.size() == 0 ) {
                    String combinedName = family + HBaseValueMeta.SEPARATOR + colName;
                    if ( !Const.isEmpty( alias ) ) {
                        combinedName += ( HBaseValueMeta.SEPARATOR + alias );
                    } else {
                        // just use the column name as the alias
                        combinedName += ( HBaseValueMeta.SEPARATOR + colName );
                    }
                    Class valueMeta = Class.forName("org.pentaho.hbase.shim.api.HBaseValueMeta",true,classloader);
                    Object vm = valueMeta.getConstructor(String.class,int.class,int.class,int.class).newInstance(combinedName, 0, -1, -1);
                    try {
                        vm.getClass().getMethod("setHBaseTypeFromString",String.class).invoke(vm,type);
                    } catch ( IllegalArgumentException e ) {
                        // TODO pop up an error dialog for this one
                        throw new Exception("setHBaseTypeFromString error");
                    }

                    try {
                        map.getClass().getMethod("addMappedColumn", valueMeta,boolean.class).invoke(map, vm,isTupleMapping);
                    } catch ( Exception ex ) {
                        throw new Exception("DuplicateColumn");
                    }
                }
            }
        }

        // now check for any errors in our Lists
        if ( !keyDefined ) {
            throw new Exception("NoKeyDefined");
        }

        if ( missingFamilies.size() > 0 || missingColumnNames.size() > 0 || missingTypes.size() > 0 ) {
            StringBuffer buff = new StringBuffer();
            buff.append(  "IssuesPreventingSaving" + ":\n\n" );
            if ( missingFamilies.size() > 0 ) {
                buff.append(  "FamilyIssue"  + ":\n" );
                buff.append( missingFamilies.toString() ).append( "\n\n" );
            }
            if ( missingColumnNames.size() > 0 ) {
                buff.append( "ColumnIssue"  + ":\n" );
                buff.append( missingColumnNames.toString() ).append( "\n\n" );
            }
            if ( missingTypes.size() > 0 ) {
                buff.append( "TypeIssue"  + ":\n" );
                buff.append( missingTypes.toString() ).append( "\n\n" );
            }

            throw new Exception(buff.toString());
        }

        return map;
    }

}
