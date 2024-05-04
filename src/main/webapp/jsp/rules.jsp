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
    <script src="${pageContext.request.contextPath}/js/rules.js"></script>

<%--  BOOTSTRAP  --%>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</head>
<body>
<jsp:include page="include/navbar.jsp"/>



<p class="text-center">GOOD ROLES</p>
<div class="container mt-3 slideshow-container">
        <c:if test="${not empty roles}">
            <c:forEach var="roleList" items="${roles}">
                <c:forEach var="role" items="${roleList}">
                    <c:if test="${role.type eq 0}">
                        <div class="mySlides slide">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:65%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p class="text-center" style="padding:10%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">VILLAGERS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </c:if>
                </c:forEach>
            </c:forEach>
        </c:if>

    <a class="prev" onclick="plusSlides(-1, 0)">❮</a>
    <a class="next" onclick="plusSlides(1, 0)">❯</a>
</div>

<br><br>

<p class="text-center">EVIL ROLES</p>
<div class="container mt-3 slideshow-container">
    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 1}">
                    <div class="mySlides slide2">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:65%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p class="text-center" style="padding:10%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WOLF PACK</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </c:if>
            </c:forEach>
        </c:forEach>
    </c:if>

    <a class="prev" onclick="plusSlides(-1, 1)">❮</a>
    <a class="next" onclick="plusSlides(1, 1)">❯</a>
</div>
<br><br>

<p class="text-center">VICTORY STEALER ROLES</p>
<div class="container mt-3 slideshow-container">
    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 2}">
                    <div class="mySlides slide3">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:65%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p class="text-center" style="padding:10%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">ALONE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </c:if>
            </c:forEach>
        </c:forEach>
    </c:if>

    <a class="prev" onclick="plusSlides(-1, 2)">❮</a>
    <a class="next" onclick="plusSlides(1, 2)">❯</a>
</div>
<br>

<p class="text-center">NEUTRAL ROLES</p>
<div class="container mt-3 slideshow-container">
    <c:if test="${not empty roles}">
        <c:forEach var="roleList" items="${roles}">
            <c:forEach var="role" items="${roleList}">
                <c:if test="${role.type eq 3}">
                    <div class="mySlides slide4">
                        <div class="row">
                            <div class="col-md-5 p-3 d-flex justify-content-center">
                                <!-- <p><c:out value="${role.name}"/></p> -->
                                <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png"
                                     style="width:65%">
                            </div>
                            <div class="row col-md-7 p-4 d-flex justify-content-center">
                                <p class="text-center" style="padding:10%; display: flex; justify-content: center; align-items: center"><c:out value="${role.description}"/></p>
                                <div class="row col">
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <p class="text-center">WINS WITH:</p>
                                    </div>
                                    <div class="col" style="display: flex; justify-content: center; align-items: center">
                                        <c:if test="${role.name eq 'plague spreader'}">
                                            <p class="text-center">VILLAGERS</p>
                                        </c:if>
                                        <c:if test="${role.name eq 'illusionist'}">
                                            <p class="text-center">WOLF PACK</p>
                                        </c:if>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </c:if>
            </c:forEach>
        </c:forEach>
    </c:if>

    <a class="prev" onclick="plusSlides(-1, 3)">❮</a>
    <a class="next" onclick="plusSlides(1, 3)">❯</a>
</div>
<br>

<c:import url="/jsp/include/footer.jsp"/>

</body>
</html>
