<%--
  Created by IntelliJ IDEA.
  User: Jacopo
  Date: 11/04/2024
  Time: 11:11
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <c:if test="${not empty roles}">
        <table>
            <thead>
                <tr>
                    <th>Name</th><th>Type</th><th>With who wins</th><th>Description</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="roleList" items="${roles}">
                    <c:forEach var="role" items="${roleList}">
                        <tr>
                            <td><c:out value="${role.name}"/></td>
                            <td><c:out value="${role.type}"/></td>
                            <td><c:out value="${role.with_who_wins}"/></td>
                            <td><c:out value="${role.description}"/></td>
                        </tr>
                    </c:forEach>
                </c:forEach>
            </tbody>
        </table>
    </c:if>
</body>
</html>
