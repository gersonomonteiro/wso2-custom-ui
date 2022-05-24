<%@ page import="io.digital101.D101Constants" %>
<%
    if (D101Constants.setAppNameAttr(request) && D101Constants.isSupported(request)) {
        RequestDispatcher dispatcher = request.getRequestDispatcher("mobile_emailotp.jsp");
        dispatcher.forward(request, response);
    } else {
        RequestDispatcher dispatcher = request.getRequestDispatcher("default_emailotp.jsp");
        dispatcher.forward(request, response);
    }
%>