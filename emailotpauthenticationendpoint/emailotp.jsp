<%  
String relyingParty = request.getParameter("relyingParty");

if (relyingParty.equals("8wcd9LFF__m5d279x8vbdF3yPtsa")) {
    RequestDispatcher dispatcher = request.getRequestDispatcher("mobile_emailopt.jsp");
    dispatcher.forward(request, response);
} else {
    RequestDispatcher dispatcher = request.getRequestDispatcher("default_emailotp.jsp");
    dispatcher.forward(request, response);
} 
    %>