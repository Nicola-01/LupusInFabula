<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Home page</title>
</head>
<body>
<h1>HOME PAGE</h1>
<a href="<c:url value="/rules"/>"> Rules </a>
<c:import url="/jsp/include/show-message.jsp"/>
<a href="<c:url value="/user/me/friend"/>"> Friend </a>
<c:import url="/jsp/include/show-message.jsp"/>
</body>
</html>
