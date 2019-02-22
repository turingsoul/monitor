package com.xdatainsight.monitor.web.http.filters;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

/**
 * Looks at the <code>context-param</code> named <code>encoding</code> in <code>web.xml</code> for its encoding
 * selection. If not found, falls back to method used by superclass. Finally, defaults to <code>UTF-8</code>.
 *
 */
public class AwareCharacterEncodingFilter extends SetCharacterEncodingFilter {

    // ~ Static fields/initializers ============================================

    private static final Log logger = LogFactory.getLog( AwareCharacterEncodingFilter.class );

    public static final String INIT_PARAM_ENCODING = "encoding"; //$NON-NLS-1$

    public static final String DEFAULT_CHAR_ENCODING = "UTF-8"; //$NON-NLS-1$

    // ~ Instance fields =======================================================

    // ~ Constructors ==========================================================

    public AwareCharacterEncodingFilter() {
        super();
    }

    // ~ Methods ===============================================================

    @Override
    protected String selectEncoding( final ServletRequest request ) {
        if ( request instanceof HttpServletRequest ) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String enc =
                    httpRequest.getSession( true ).getServletContext().getInitParameter(
                            AwareCharacterEncodingFilter.INIT_PARAM_ENCODING );
            if ( StringUtils.isNotBlank( enc ) ) {
                if ( AwareCharacterEncodingFilter.logger.isDebugEnabled() ) {
                    AwareCharacterEncodingFilter.logger.debug( "AwareCharacterEncodingFilter.ENCODING_IN_CTX" );
                }
                return enc;
            }
        }
        String enc = super.selectEncoding( request );
        if ( StringUtils.isNotBlank( enc ) ) {
            if ( AwareCharacterEncodingFilter.logger.isDebugEnabled() ) {
                AwareCharacterEncodingFilter.logger.debug( "AwareCharacterEncodingFilter.ENCODING_IN_FILTER_INIT" );
            }
            return enc;
        } else {
            if ( AwareCharacterEncodingFilter.logger.isWarnEnabled() ) {
                AwareCharacterEncodingFilter.logger.warn( "AwareCharacterEncodingFilter.COULD_NOT_FIND_ENCODING" );
            }
            return AwareCharacterEncodingFilter.DEFAULT_CHAR_ENCODING;
        }
    }

}
