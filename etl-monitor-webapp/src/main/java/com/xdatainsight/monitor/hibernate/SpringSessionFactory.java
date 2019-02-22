package com.xdatainsight.monitor.hibernate;

import org.hibernate.SessionFactory;

/**
 * Created by xiaobaibai on 17-4-20.
 */
public class SpringSessionFactory {
    public SessionFactory getSessionFactory() {
        return HibernateUtil.getSessionFactory();
    }
}
