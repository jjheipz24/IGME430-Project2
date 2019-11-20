//handles all error messages
const showError = (message) => {
    $(".error").text(message);
    $(".error").fadeIn(400);
  }
  
  //handles requests
  const sendAjax = (action, data) => {
    $.ajax({
      cache: false,
      type: "POST",
      url: action,
      data: data,
      dataType: "json",
      success: (result, status, xhr) => {
        $(".error").fadeOut(400);
  
        window.location = result.redirect;
      },
      error: (xhr, status, error) => {
        const messageObj = JSON.parse(xhr.responseText);
  
        showError(messageObj.error);
      }
    });
  }
  
  const fileUpload = (action, data) => {
    $.ajax({
      cache: false,
      type: "POST",
      url: action,
      data: data,
      processData: false,
      contentType: false,
      success: (result, status, xhr) => {
        $(".error").fadeOut(400);
  
        window.location = result.redirect;
      },
      error: (xhr, status, error) => {
        const messageObj = JSON.parse(xhr.responseText);
  
        showError(messageObj.error);
      }
    });
  }