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
    <title>Lupus in Fabula Roles</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/rules.css">
</head>
<body>
    <div class="row upper">
        <div class="title-row">
            <span style="font-size:30px;cursor:pointer" onclick="openNav('myNavRules')">RULES</span>
        </div>
    </div>

    <div id="myNavRoles" class="overlay roles">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav('myNavRoles')">&times;</a>
        <div class="overlay-content">
            <div class="slideshow-container">

                <c:if test="${not empty roles}">
                    <c:forEach var="roleList" items="${roles}">
                        <c:forEach var="role" items="${roleList}">

                            <div class="mySlides fade">
                                <div>
                                    <!-- <p><c:out value="${role.name}"/></p> -->
                                    <img src="${pageContext.request.contextPath}/media/cards/<c:out value="${role.name}"/>.png" style="width:25%">
                                </div>
                                <div>
                                    <p><c:out value="${role.description}"/></p>
                                    <br>
                                    <p><c:out value="${role.with_who_wins}"/></p>
                                </div>
                            </div>

                        </c:forEach>
                    </c:forEach>
                </c:if>

                <a class="prev" onclick="plusSlides(-1)">❮</a>
                <a class="next" onclick="plusSlides(1)">❯</a>

            </div>
            <br>
            <div style="text-align:center">

                <c:if test="${not empty roles}">
                    <%
                        var totalRole = 0;
                    %>
                    <c:forEach var="roleList" items="${roles}" varStatus="outerLoop">
                        <c:forEach var="role" items="${roleList}" varStatus="innerLoop">
                            <%
                                totalRole++;
                            %>
                            <span class="dot" onclick="currentSlide(<%= totalRole%>)"></span>
                        </c:forEach>
                    </c:forEach>
                </c:if>
                <!-- <span class="dot" onclick="currentSlide(1)"></span>
                <span class="dot" onclick="currentSlide(2)"></span>
                <span class="dot" onclick="currentSlide(3)"></span>
                <span class="dot" onclick="currentSlide(4)"></span> -->

            </div>
        </div>
    </div>

    <div class="row down">
        <div class="title-row">
            <span style="font-size:30px;cursor:pointer" onclick="openNav('myNavRoles')">ROLES</span>
        </div>
    </div>

    <div id="myNavRules" class="overlay rules">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav('myNavRules')">&times;</a>
        <div class="overlay-content">
            <p style="color: white">This game requires at least five participants, one of whom will be the game-master, and the other will get roles
                assigned randomly, for instance by drawing a card. The main roles are wolves and farmers, but other roles are
                used - like medium, knight, werehamster etc - in order to make the game more entertaining, with specific rules
                applying to each character. Each round is divided into two parts: night and day. The first night is used by the
                game-master to know the role assigned to each player and writes them down. During the other nights, all players
                close their eyes and the game-master calls one by one each role that has an ability (e.g. the wolf has the ability to
                kill another player), the player that is called points out to the game-master (i.e. with the finger, without speaking)
                which player is their target (e.g. the wolf A points player B to kill him). After all roles have done their actions, the
                day phase starts. First of all the players can open their eyes, and the game-master says what happened during the
                night (e.g. ”during the night player B died”), after that, the discussion starts, followed by the vote phase, where
                each player votes which player they want to kill.
                N.B. We have extra roles, e.g. the knight, who can protect a player during the night, so for example if the wolf
                and knight target the same player, that person will not die that night, so the game-master will say ”no one died
                during the night”.
            </p>
        </div>
    </div>

    <script>
        function openNav(id) {
            var overlay = document.getElementById(id);
            if (overlay) {
                overlay.style.width = "100%";
            } else {
                console.error("Elemento con ID specificato non trovato");
            }
        }

        function closeNav(id) {
            var overlay = document.getElementById(id);
            if (overlay) {
                overlay.style.width = "0";
            } else {
                console.error("Elemento con ID specificato non trovato");
            }
        }
    </script>

    <script>
        let slideIndex = 1;
        showSlides(slideIndex);

        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        function currentSlide(n) {
            showSlides(slideIndex = n);
        }

        function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            let dots = document.getElementsByClassName("dot");
            if (n > slides.length) {slideIndex = 1}
            if (n < 1) {slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active";
        }
    </script>

</body>
</html>
