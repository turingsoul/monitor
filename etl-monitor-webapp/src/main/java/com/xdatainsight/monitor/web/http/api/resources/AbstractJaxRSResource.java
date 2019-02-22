package com.xdatainsight.monitor.web.http.api.resources;

import com.sun.jersey.core.header.QualitySourceMediaType;
import com.xdatainsight.monitor.hibernate.HibernateUtil;
import com.xdatainsight.monitor.web.http.api.resources.services.kettlelog.entities.OperationlogEntity;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.pentaho.platform.engine.core.system.PentahoSessionHolder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static javax.ws.rs.core.MediaType.APPLICATION_XML_TYPE;
import static javax.ws.rs.core.MediaType.TEXT_HTML_TYPE;

public abstract class AbstractJaxRSResource {

    /**
     * Quality of service set high to overcome bad Accept header precedence in Webkit and IE browsers. This will make
     *
     * annotations work properly in jersey
     */
    private static final Log logger = LogFactory.getLog( AbstractJaxRSResource.class );

    protected List<MediaType> acceptableMediaTypes;

    @Context
    protected HttpServletRequest httpServletRequest;

    @Context
    protected HttpServletResponse httpServletResponse;

    // @Context
    // protected Request jaxRsRequest;

    @Context
    public void setHttpHeaders( HttpHeaders httpHeaders ) {
        List<MediaType> mediaTypes = httpHeaders.getAcceptableMediaTypes();
        int htmlPos = -1;
        int xmlPos = -1;

        for ( int i = 0; i < mediaTypes.size(); i++ ) {
            MediaType t = mediaTypes.get( i );
            if ( t.getSubtype().equals( APPLICATION_XML_TYPE.getSubtype() ) ) {
                xmlPos = i;
            }
            if ( t.getSubtype().equals( TEXT_HTML_TYPE.getSubtype() ) ) {
                htmlPos = i;
            }
        }

        //
        // If both html and xml media types are requested, make sure html
        // takes precedence over xml. This is to correct Webkit (Safari and Chrome),
        // and IE browsers faulty default HTTP Accept header.
        if ( htmlPos > -1 && xmlPos > -1 && xmlPos < htmlPos ) {

            MediaType origHtmlMediaType = mediaTypes.remove( htmlPos );

            Map<String, String> params = new HashMap<>(origHtmlMediaType.getParameters());
            params.put( "q", "2.0" );

            QualitySourceMediaType newhtmlMediaType =
                    new QualitySourceMediaType( origHtmlMediaType.getType(), origHtmlMediaType.getSubtype(), 2000, params );

            // reinsert ahead of xml and with increased qos value
            mediaTypes.add( xmlPos, newhtmlMediaType );

            // VariantListBuilder vlb = Variant.VariantListBuilder.newInstance();
            // for(MediaType m : mediaTypes) {
            // vlb.mediaTypes(m).add();
            // }
            //
            // Variant variant = jaxRsRequest.selectVariant(vlb.build());

            logger.info(
                    "Bad Accept header detected by browser, mime type order rewritten as " + mediaTypes.toString() ); //$NON-NLS-1$
        }
        acceptableMediaTypes = mediaTypes;
    }

    /**
     * Log JaxRs Request into DataBase
     */
    public void logRequestData(HttpServletRequest httpServletRequest,String data) {
        Session session;
        Transaction tx = null;
        try {
            OperationlogEntity logEntity = new OperationlogEntity();
            logEntity.setUrl(httpServletRequest.getRequestURI());  //Request uri
            logEntity.setAction(httpServletRequest.getMethod());  //Request method eg. GET, POST
            logEntity.setAddTime(new Date());
            logEntity.setIpAddr(httpServletRequest.getRemoteAddr()); //Request ip address
            logEntity.setUserId(PentahoSessionHolder.getSession().getName());   //Request user name
            logEntity.setSessionId(PentahoSessionHolder.getSession().getId());   //Request session id
            logEntity.setObjectType(mapClassName(this.getClass().getName()));        //Request class name
            logEntity.setObject(httpServletRequest.getQueryString());  //Request path param
            logEntity.setContents(data);     //Request content

            session = HibernateUtil.getSession();
            tx = session.beginTransaction();
            session.save(logEntity);
            tx.commit();
        } catch (Throwable e) {
            logger.warn("ERROR WHEN SET OPERATION LOG",e);
            if(tx != null) {
                tx.rollback();
            }
        }

    }

    public static String toJSon(Object object) {
       ObjectMapper objectMapper = new ObjectMapper();

        try {
            return objectMapper.writeValueAsString(object);
        } catch (Throwable e) {
            logger.error("ERROR WHEN SET OPERATION LOG",e);
        }

        return "";
    }

    private String mapClassName(String className) {
        switch (className) {
            case "com.xdatainsight.monitor.web.http.api.resources.KettleResource":
                return "Kettle";
            case "com.xdatainsight.monitor.web.http.api.resources.FileResource":
                return "文件";
            case "com.xdatainsight.monitor.web.http.api.resources.KettleLogResource":
                return "日志";
            case "com.xdatainsight.monitor.web.http.api.resources.SchedulerResource":
                return "计划";
            case "com.xdatainsight.monitor.web.http.api.resources.UserRoleDaoResource":
                return "用户";
            default:
                return "";
        }

    }

}
