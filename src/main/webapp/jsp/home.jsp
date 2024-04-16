<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Home page a a a a a </title>
</head>
<body>
<h1>HOME PAGE</h1>
<a href="<c:url value="/rules"/>"> Rules </a>

<a href="<c:url value="/login"/>"> Login </a>

<h1>Logs</h1>
<a href="<c:url value="/user/user1/logs"/>"> Logs </a>

<h1>Statistics</h1>
<a href="<c:url value="/user/user1/statistics"/>"> Statistics </a>


<c:import url="/jsp/include/show-message.jsp"/>


</body>
</html>
