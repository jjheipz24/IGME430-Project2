"use strict";

var showError = function showError(message) {
    $("#error").text(message);
    $("#error").fadeIn(400);
};

var sendAjax = function sendAjax(action, data) {
    $.ajax({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: function success(result, status, xhr) {
            $("#error").fadeOut(400);

            window.location = result.redirect;
        },
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);

            showError(messageObj.error);
        }
    });
};

$(document).ready(function () {
    $("#signupForm").on("submit", function (e) {
        e.preventDefault();

        $("#error").fadeOut(400);

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

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        $("#error").fadeOut(400);

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

    $("#changePasswordForm").on("submit", function (e) {
        e.preventDefault();

        $("#error").fadeOut(400);

        if ($("#currentPass").val() == '' || $("#newPass").val() == '' || $("#pass2").val() == '') {
            showError("All fields are required");
            return false;
        }

        if ($("#newPass").val() !== $("#pass2").val()) {
            showError("Passwords do not match");
            return false;
        }

        sendAjax($("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize());

        return false;
    });

    $("#imgUploadForm").on("submit", function (e) {
        e.preventDefault();

        $("#error").fadeOut(400);

        if ($("#currentPass").val() == '' || $("#newPass").val() == '' || $("#pass2").val() == '') {
            showError("All fields are required");
            return false;
        }

        if ($("#userImg").val() == '') {
            showError("Please choose an image to upload");
            return false;
        }

        sendAjax($("#imgUploadForm").attr("action"), $("#imgUploadForm").serialize());

        return false;
    });
});
