#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")"
set -e

#mvn $MAVEN_CONFIG dependency:get \
#    -DrepoUrl=https://nexus.101digital.io/repository/all \
#    -DrepositoryId=101digital \
#    -Dartifact=org.wso2.extensions:config-client:1.0.0-SNAPSHOT:jar \
#    -Dtransitive=false \
#    -Ddest=emailotpauthenticationendpoint/WEB-INF/lib/config-client-1.0.0-SNAPSHOT.jar

zip -r -qq authenticationendpoint.zip authenticationendpoint
zip -r -qq emailotpauthenticationendpoint.zip emailotpauthenticationendpoint
 
