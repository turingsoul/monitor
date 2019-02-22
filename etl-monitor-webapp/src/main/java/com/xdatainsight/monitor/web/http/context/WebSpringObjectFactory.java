package com.xdatainsight.monitor.web.http.context;

import org.pentaho.platform.engine.core.system.objfac.AbstractSpringPentahoObjectFactory;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.context.support.XmlWebApplicationContext;

import javax.servlet.ServletContext;

/**
 * This factory implementation can be used in a web environment in which a Spring {@link WebApplicationContext} has
 * already been created during initialization of the web application. WebSpringObjectFactory will delegate object
 * creation and management to the Spring context. There is one exception to this rule: see
 * {@link AbstractSpringPentahoObjectFactory} for more details.
 * <p>
 * The Spring bean factory supports the binding of objects to particular scopes. See Spring documentation for
 * description of the scope types: singleton, prototype, session, and request. The latter two apply only in a web
 * context.
 *
 * @see AbstractSpringPentahoObjectFactory
 * @see http://static.springframework.org/spring/docs/2.5.x/reference/beans.html#beans-factory-scopes
 */
public class WebSpringObjectFactory extends AbstractSpringPentahoObjectFactory {

    public WebSpringObjectFactory() {
        super( "Main Object Factory" );
    }

    /**
     * Initializes this object factory by setting the internal bean factory to the {@link WebApplicationContext} instance
     * managed by Spring.
     *
     * @param configFile
     *          ignored for this implementation
     * @param context
     *          the {@link ServletContext} under which this system is currently running. This is used to retrieve the
     *          Spring {@link WebApplicationContext}.
     * @throws IllegalArgumentException
     *           if context is not the correct type, only ServletContext is accepted
     */
    public void init( String configFile, Object context ) {
        if ( !( context instanceof ServletContext ) ) {
            String msg ="WebSpringPentahoObjectFactory.ERROR_0001_CONTEXT_NOT_SUPPORTED";
            throw new IllegalArgumentException( msg );
        }

        ServletContext servletContext = (ServletContext) context;

        beanFactory =
                (XmlWebApplicationContext) WebApplicationContextUtils.getRequiredWebApplicationContext( servletContext );
    }
}
