# wso2-custom-ui

# Build docker images
```
COPY  --chown=wso2carbon:wso2 ./authenticationendpoint.zip  /tmp/
RUN   unzip -qq /tmp/authenticationendpoint.zip  -d ${WSO2_SERVER_HOME}/repository/deployment/server/webapps/authenticationendpoint

COPY  --chown=wso2carbon:wso2 ./emailotpauthenticationendpoint.zip  /tmp/
RUN   unzip -qq /tmp/emailotpauthenticationendpoint.zip  -d ${WSO2_SERVER_HOME}/repository/deployment/server/webapps/emailotpauthenticationendpoint

```


