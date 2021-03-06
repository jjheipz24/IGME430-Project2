"use strict";

//handles all error messages
var showError = function showError(message) {
  $(".error").text(message);
  $(".error").fadeIn(400);
};

//handles requests
var sendAjax = function sendAjax(action, data) {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: function success(result, status, xhr) {
      $(".error").fadeOut(400);

      window.location = result.redirect;
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      showError(messageObj.error);
    }
  });
};

var fileUpload = function fileUpload(action, data) {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    processData: false,
    contentType: false,
    success: function success(result, status, xhr) {
      $(".error").fadeOut(400);

      window.location = result.redirect;
    },
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);

      showError(messageObj.error);
    }
  });
};

$(document).ready(function () {
  //handles requests on the signup form after submit clicked
  //shows error messages depending on the error
  $("#signupForm").on("submit", function (e) {
    e.preventDefault();

    $(".error").fadeOut(400);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      showError("All fields are required");
      return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
      showError("Passwords do not match");
      return false;
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  //handles requests on the login form after submit clicked
  //shows error messages depending on the error
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    $(".error").fadeOut(400);

    if ($("#user").val() == '') {
      showError("Username is required");
      return false;
    }

    if ($("#pass").val() == '') {
      showError("Password is required");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });

  //handles requests on the change password form after submit clicked
  //shows error messages depending on the error
  $("#changePasswordForm").on("submit", function (e) {
    e.preventDefault();

    $(".error").fadeOut(400);

    if ($("#currentPass").val() == '' || $("#newPass").val() == '' || $("#pass2").val() == '') {
      showError("All fields are required");
      return false;
    }

    if ($("#newPass").val() !== $("#pass2").val()) {
      showError("Passwords don't match");
      return false;
    }

    sendAjax($("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize());

    return false;
  });

  //handles requests on the image upload form after submit clicked
  //shows error messages depending on the error
  $("#imgUploadForm").on("submit", function (e) {
    e.preventDefault();

    $(".error").fadeOut(400);

    if ($("#userImg").val() == '') {
      showError("Please select an image");
      return false;
    }

    fileUpload($("#imgUploadForm").attr("action"), new FormData($("#imgUploadForm")[0]));

    return false;
  });
});
