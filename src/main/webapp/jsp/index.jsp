<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>JSP - Hello World</title>
</head>
<body>
<h1><%= "Hello World!" %></h1>
<br/>
<a href="hello-servlet">Servlet 1</a>
<br>
<a href="helloworld2">Servlet 2</a>
<br>
<a href="${pageContext.request.contextPath}/jsp/roles.jsp">Roles</a>
<br>
<form action="addPlayer">
  <input type="text" id="usernameID" name="username" value="username"><br>
  <input type="text" id="emailID" name="email" value="email@email.com"><br>
  <input type="text" id="passwordID" name="password" value="password"><br><br>
  <input type="submit" formmethod="post" value="AddPlayer">
</form>
<br>
<a href="getPlayer">GetPlayer</a>
</body>
</html>