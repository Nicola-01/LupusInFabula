<%--
  Created by IntelliJ IDEA.
  User: Jacopo Momesso
  Date: 07/04/2024
  Time: 17:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Lupus in Fabula Roles</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/card_animation.css">
</head>
<body>
    <div id="myNavRoles" class="overlay">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav('myNavRoles')">&times;</a>
        <div class="overlay-content">
            <p style="color: white">Contenuto delle Roles</p>
        </div>
    </div>
    <div id="myNavRules" class="overlay">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav('myNavRules')">&times;</a>
        <div class="overlay-content">
            <p style="color: white">Contenuto delle Rules</p>
        </div>
    </div>
    <div class="row upper">
        <div class="title-row">
            <span style="font-size:30px;cursor:pointer" onclick="openNav('myNavRules')">RULES</span>
        </div>
    </div>
    <div class="row down">
        <div class="title-row">
            <span style="font-size:30px;cursor:pointer" onclick="openNav('myNavRoles')">ROLES</span>
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

</body>
</html>
