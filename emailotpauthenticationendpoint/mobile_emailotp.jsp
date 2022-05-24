<!--
 ~ Copyright (c) 2020, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 ~
 ~ WSO2 Inc. licenses this file to you under the Apache License,
 ~ Version 2.0 (the "License"); you may not use this file except
 ~ in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~ http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing,
 ~ software distributed under the License is distributed on an
 ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 ~ KIND, either express or implied. See the License for the
 ~ specific language governing permissions and limitations
 ~ under the License.
 -->

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ include file="includes/localize.jsp" %>
<%
    request.getSession().invalidate();
    String queryString = request.getQueryString();
    Map<String, String> idpAuthenticatorMapping = null;
    if (request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP) != null) {
        idpAuthenticatorMapping = (Map<String, String>) request.getAttribute(Constants.IDP_AUTHENTICATOR_MAP);
    }

    String errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"error.retry");
    String authenticationFailed = "false";

    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";

        if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);

            if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
                errorMessage = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,"error.retry");
            }
        }
    }
%>
<html>
    <head>
        <!-- header -->
        <jsp:include page="extensions/mobile_header.jsp"/>
    </head>

    <body class="email-otp-portal-layout" style="display: none">

        <main class="center-segment">
            <div class="row ui container medium center aligned middle aligned">
                
                <div class="ui segment">
                    <!-- page content -->
                    <div class="form-login">
                        <div>
                            <h2 class="wr-title text-center">TWO-FACTOR AUTHENTICATION</h2>
                        </div>
                        <div class="ui divider hidden"></div>
                        <%
                            if ("true".equals(authenticationFailed)) {
                        %>
                        <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%>
                        </div>
                        <div class="ui divider hidden"></div>
                        <% } %>
                        <div id="alertDiv"></div>
                        <div class="segment-form login-form">
                            <form class="ui large form" id="codeForm" name="codeForm" action="../commonauth" method="POST">
                                <%
                                    String loginFailed = request.getParameter("authFailure");
                                    if (loginFailed != null && "true".equals(loginFailed)) {
                                        String authFailureMsg = request.getParameter("authFailureMsg");
                                        if (authFailureMsg != null && "login.fail.message".equals(authFailureMsg)) {
                                %>
                                <div class="ui negative message"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error.retry")%></div>
                                <div class="ui divider hidden"></div>
                                <% }
                                } %>
                                <% if (request.getParameter("screenValue") != null) { %>
                                <div class="field">
                                    <label for="OTPCode">Your account is protected with two-factor verification. Please enter the two-factor code we sent to the email ID
                                        (<%=Encode.forHtmlContent(request.getParameter("screenValue"))%>)
                                    </label>
                                    <input type="text" id='OTPCode' name="OTPCode" c size='30' class="form-control"/>
                                <% } else { %>
                                <div class="field">
                                    <label for="OTPCode">Your account is protected with two-factor verification. Please enter the two-factor code we sent to the email ID:</label>
                                    <input type="text" id='OTPCode' name="OTPCode" size='30'/>
                                        <% } %>
                                </div>
                                <input type="hidden" name="sessionDataKey"
                                    value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                                <input type='hidden' name='resendCode' id='resendCode' value='false'/>

                                <div class="ui divider hidden"></div>
                                <div class="align-right buttons">
                                    <a class="ui button link-button" id="resend">
                                        <div class="resend-code">Resend code<span id="timer" class="hidden">try again in 60</span><img class="resend-sign" src="https://d1dz6v1skw3w7n.cloudfront.net/htmls/info_black.svg" aria-hidden="true"></div>
                                    </a>
                                </div>

                                <div class="align-right buttons">

                                    <input type="button" name="authenticate" id="authenticate" value="Continue"
                                        class="wr-btn grey-bg col-xs-12 col-md-12 col-lg-12 margin-bottom-double btn-submit disabled two-factor-button" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>


        <script type="text/javascript">
            window.jqueryReady =  window.jqueryReady || [];
            window.jqueryReady.push(function ($) {
                $(document).ready(function () {
                    $('#authenticate').click(function () {
                        var code = document.getElementById("OTPCode").value;
                        if (code == "") {
                            document.getElementById('alertDiv').innerHTML
                                = '<div id="error-msg" class="ui negative message"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error.enter.code")%></div>'
                                + '<div class="ui divider hidden"></div>';
                        } else {
                            if ($('#codeForm').data("submitted") === true) {
                                console.warn("Prevented a possible double submit event");
                            } else {
                                $('#codeForm').data("submitted", true);
                                $('#codeForm').submit();
                            }
                        }
                    });
                });
                $(document).ready(function () {
                    $('#resend').click(function () {
                        document.getElementById("resendCode").value = "true";
                        $('#codeForm').submit();
                    });

                    $('#OTPCode').on('keyup', function(e) {
                        $(this).val($(this).val().replace(/[^0-9]/g, ''));
                        console.log(this.value.length)
                        if (this.value.length ===6) {
                           $('#authenticate').removeClass("disabled")
                        } else {
                            $('#authenticate').addClass("disabled")
                        }
                    });
                });
            })
        </script>
    </body>
</html>
