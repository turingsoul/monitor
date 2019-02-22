package com.xdatainsight.monitor.kettle;

import org.apache.log4j.Appender;
import org.apache.log4j.Layout;
import org.apache.log4j.spi.ErrorHandler;
import org.apache.log4j.spi.Filter;
import org.apache.log4j.spi.LoggingEvent;
import org.pentaho.di.core.logging.DefaultLogLevel;
import org.pentaho.di.core.logging.KettleLoggingEvent;
import org.pentaho.di.core.logging.LoggingBuffer;

import sun.reflect.generics.reflectiveObjects.NotImplementedException;

public class LoggingBufferAppender implements Appender {
    private final LoggingBuffer loggingBuffer;

    public LoggingBufferAppender(LoggingBuffer loggingBuffer) {
        this.loggingBuffer = loggingBuffer;
    }

    @Override
    public void addFilter(Filter arg0) {
        throw new NotImplementedException();
    }

    @Override
    public void clearFilters() {
        throw new NotImplementedException();
    }

    @Override
    public void close() {
        throw new NotImplementedException();
    }

    @Override
    public void doAppend(LoggingEvent event) {
        KettleLoggingEvent kle = new KettleLoggingEvent(event.getMessage(), System.currentTimeMillis(), DefaultLogLevel.getLogLevel());
        loggingBuffer.doAppend(kle);
    }

    @Override
    public ErrorHandler getErrorHandler() {
        throw new NotImplementedException();
    }

    @Override
    public Filter getFilter() {
        throw new NotImplementedException();
    }

    @Override
    public Layout getLayout() {
        throw new NotImplementedException();
    }

    @Override
    public String getName() {
        return loggingBuffer.getName();
    }

    @Override
    public boolean requiresLayout() {
        return false;
    }

    @Override
    public void setErrorHandler(ErrorHandler errorHandler) {
        throw new NotImplementedException();
    }

    @Override
    public void setLayout(Layout layout) {
        throw new NotImplementedException();
    }

    @Override
    public void setName(String name) {
        loggingBuffer.setName(name);
    }
}
