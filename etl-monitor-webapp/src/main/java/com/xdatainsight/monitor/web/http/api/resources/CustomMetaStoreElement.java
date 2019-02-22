package com.xdatainsight.monitor.web.http.api.resources;

import java.util.Map;

/**
 * Created by xiaobaibai on 17-4-13.
 */
public class CustomMetaStoreElement {

    private String id;
    private Map<String,String> attributes;
    private String name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String,String> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String,String> attributes) {
        this.attributes = attributes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
