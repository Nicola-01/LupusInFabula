<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/pageNotFound.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/pageNotFound.js"></script>

    <c:import url="/jsp/include/head.jsp"/>
    <title>Lupus - page not found</title>
</head>
<body>

<div class="stars">
    <c:forEach var="i" begin="1" end="150">
        <div class='star'></div>
    </c:forEach>
</div>

<div class='title'>404</div>
<div class='gravestones'>
    <div class='cross'></div>
    <div class='cross'></div>
    <div class='cross'></div>
</div>
<div class='bottompatch'>
    <c:forEach var="i" begin="1" end="100">
        <div class='patch'></div>
    </c:forEach>
</div>

<div class='trees'>
    <c:forEach var="i" begin="1" end="25">
        <div class='tree'></div>
    </c:forEach>
</div>

<div class='msg'>
    This page doesn't exist.
</div>
<div class='crypt'>
    <div class='roof'></div>
    <div class='body'>
        <div class='door'></div>
    </div>
</div>
<div class='fogRed'></div>
<div class='fogOrange'></div>
<div class='moon'></div>

</body>
</html>
