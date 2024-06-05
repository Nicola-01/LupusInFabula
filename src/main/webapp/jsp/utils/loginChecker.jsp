<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${empty sessionScope.user}">
    <script>
        window.location.href = window.location.origin + "/lupus/login";
    </script>
</c:if>