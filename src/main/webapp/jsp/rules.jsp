<%--
  Created by IntelliJ IDEA.
  User: Jacopo Momesso
  Date: 07/04/2024
  Time: 17:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Lupus in Fabula - Rules</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/rules.css">
<%--    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/homepage.css">--%>
    <script src="${pageContext.request.contextPath}/js/rules.js"></script>
</head>
<body>
<jsp:include page="include/navbar.jsp"/>

<p>GOOD ROLES</p>
<div class="slideshow-container">

    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 0}">
                    <div class="mySlides slide">

                        <!-- <p><c:out value="${role.name}"/></p> -->
                        <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                             style="width:25%">

<%--                        <div>--%>
<%--                            <p><c:out value="${role.description}"/></p>--%>
<%--                            <br>--%>
<%--                            <p><c:out value="${role.with_who_wins}"/></p>--%>
<%--                        </div>--%>
                    </div>
                </c:if>
            </c:forEach>
        </c:forEach>
    </c:if>

    <a class="prev" onclick="plusSlides(-1, 0)">❮</a>
    <a class="next" onclick="plusSlides(1, 0)">❯</a>

</div>
<br><br>

<p>EVIL ROLES</p>
<div class="slideshow-container">

    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 1}">
                    <div class="mySlides slide2">

                        <!-- <p><c:out value="${role.name}"/></p> -->
                        <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                             style="width:25%">
<%--                        <div>--%>
<%--                            <p><c:out value="${role.description}"/></p>--%>
<%--                            <br>--%>
<%--                            <p><c:out value="${role.with_who_wins}"/></p>--%>
<%--                        </div>--%>
                    </div>
                </c:if>
            </c:forEach>
        </c:forEach>
    </c:if>

    <a class="prev" onclick="plusSlides(-1, 1)">❮</a>
    <a class="next" onclick="plusSlides(1, 1)">❯</a>

</div>
<br><br>

<p>VICTORY STEALER ROLES</p>
<div class="slideshow-container">

    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 2}">
                    <div class="mySlides slide3">

                        <!-- <p><c:out value="${role.name}"/></p> -->
                        <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                             style="width:25%">

<%--                        <div>--%>
<%--                            <p><c:out value="${role.description}"/></p>--%>
<%--                            <br>--%>
<%--                            <p><c:out value="${role.with_who_wins}"/></p>--%>
<%--                        </div>--%>
                    </div>
                </c:if>
            </c:forEach>
        </c:forEach>
    </c:if>

    <a class="prev" onclick="plusSlides(-1, 2)">❮</a>
    <a class="next" onclick="plusSlides(1, 2)">❯</a>

</div>
<br>

<p>NEUTRAL ROLES</p>
<div class="slideshow-container">

    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 3}">
                    <div class="mySlides slide4">

                        <!-- <p><c:out value="${role.name}"/></p> -->
                        <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                             style="width:25%">

                            <%--                        <div>--%>
                            <%--                            <p><c:out value="${role.description}"/></p>--%>
                            <%--                            <br>--%>
                            <%--                            <p><c:out value="${role.with_who_wins}"/></p>--%>
                            <%--                        </div>--%>
                    </div>
                </c:if>
            </c:forEach>
        </c:forEach>
    </c:if>

    <a class="prev" onclick="plusSlides(-1, 3)">❮</a>
    <a class="next" onclick="plusSlides(1, 3)">❯</a>

</div>
<br>

<%--<div style="text-align:center">--%>

<%--    <c:if test="${not empty roles}">--%>
<%--        <%--%>
<%--            var totalRole = 0;--%>
<%--        %>--%>
<%--        <c:forEach var="roleList" items="${roles}" varStatus="outerLoop">--%>
<%--            <c:forEach var="role" items="${roleList}" varStatus="innerLoop">--%>
<%--                <%--%>
<%--                    totalRole++;--%>
<%--                %>--%>
<%--                <span class="dot" onclick="currentSlide(<%= totalRole%>)"></span>--%>
<%--            </c:forEach>--%>
<%--        </c:forEach>--%>
<%--    </c:if>--%>

<%--</div>--%>


<c:import url="/jsp/include/footer.jsp"/>

</body>
</html>
