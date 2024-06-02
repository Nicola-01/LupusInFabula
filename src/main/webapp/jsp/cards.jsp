<%--
  Created by IntelliJ IDEA.
  User: michele
  Date: 02/06/2024
  Time: 13:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Lupus In Fabula - Cards backings</title>
    <c:import url="/jsp/include/head.jsp"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/common.css">
</head>


<body class="d-flex flex-column">
<jsp:include page="/jsp/include/navbar.jsp"/>


<main class="container flex-grow-1" id="main_class">
    <div class="row mb-2">
        <div class="col-9">
            <h1 class="mb-0">Cards backing of <b>${sessionScope.user.getUsername()}</b></h1>
        </div>
    </div>

    <div class="container">
        <h1>Select an Image</h1>
        <form id="imageForm">
            <div class="row">
                <c:forEach var="image" items="${imageList}">
                    <div class="col-md-4 text-center">
                        <img src="${pageContext.request.contextPath}/media/cards/card_back/${image}" class="img-fluid" alt="img_${image}">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="selectedImage" value="${image}">
                        </div>
                    </div>
                </c:forEach>
            </div>
            <button type="button" class="btn btn-primary" onclick="setImageCookie()">Submit</button>
        </form>
    </div>

</main>


<c:import url="/jsp/include/footer.jsp"/>
<c:import url="/jsp/include/foot.jsp"/>

<script>
    function setImageCookie()
    {
        const selectedImage = document.querySelector('input[name="selectedImage"]:checked').value;
        if (selectedImage) {
            document.cookie = "selectedImage=" + selectedImage + "; path=/; max-age=" + (60 * 60 * 24 * 365); // 1 year
            alert("Image selected: " + selectedImage);
        } else {
            alert("Please select an image.");
        }
    }

    function getCookie(name)
    {
        let cookieArr = document.cookie.split(";");
        for(let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");
            if(name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }


    let selectedImage = getCookie("selectedImage");
    if (selectedImage)
    {
        console.log("Selected image:", selectedImage);
    }
</script>

</body>
</html>