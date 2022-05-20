//====== load script
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
      //IE
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      //Others
      script.onload = function () {
        callback();
      };
    }
  
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  //===========================
  
  // Function defined------------
  //=============================
  
  function checkSessionKey() {
    $.ajax({
      type: "GET",
      url:
        "/logincontext?sessionDataKey=" +
        getParameterByName("sessionDataKey") +
        "&relyingParty=" +
        getParameterByName("relyingParty") +
        "&tenantDomain=" +
        getParameterByName("tenantDomain"),
      success: function (data) {
        if (
          data &&
          data.status == "redirect" &&
          data.redirectUrl &&
          data.redirectUrl.length > 0
        ) {
          window.location.href = data.redirectUrl;
        }
      },
    });
  }
  
  function submitCredentials(e) {
    e.preventDefault();
    var userName = document.getElementById("username");
    userName.value = userName.value.trim();
    if (userName.value) {
      $.ajax({
        type: "GET",
        url:
          "/logincontext?sessionDataKey=" +
          getParameterByName("sessionDataKey") +
          "&relyingParty=" +
          getParameterByName("relyingParty") +
          "&tenantDomain=" +
          getParameterByName("tenantDomain"),
        success: function (data) {
          if (
            data &&
            data.status == "redirect" &&
            data.redirectUrl &&
            data.redirectUrl.length > 0
          ) {
            window.location.href = data.redirectUrl;
          } else {
            document.getElementById("loginForm").submit();
          }
        },
        cache: false,
      });
    }
  }
  
  function goBack() {
    window.history.back();
  }
  
  function myFunction(key, value, name) {
    return getMyFunction(key, value, name);
  }
  
  function handleNoDomain(key, value) {
    return getHandleNoDomain(key, value);
  }
  
  function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  
  function changeUsername(e) {
    document.getElementById("changeUserForm").submit();
  }
  
  //https://is-dev/authenticationendpoint/libs/jquery_1.11.3/jquery-1.11.3.js
  //https://is-dev/authenticationendpoint/libs/bootstrap_3.3.5/js/bootstrap.min.js
  
  // Main Execution
  //===============
  
  loadScript(
    "/emailotpauthenticationendpoint/libs/jquery_1.11.3/jquery-1.11.3.js",
    function () {
      (function ($) {
        loadScript(
          "/emailotpauthenticationendpoint/libs/bootstrap_3.4.1/js/bootstrap.min.js",
          function () {}
        );
        loadScript("https://unpkg.com/@popperjs/core@2", function () {
          loadScript("https://unpkg.com/tippy.js@6", function () {});
        });
  
        $(document).ready(function () {
          $(document).prop("title", "UD Login");
          if ($("#OTPCode").length >= 1) {
            $("#OTPCode").attr("placeholder", "Two-factor code");
          }
          $("#username, #password, #OTPCode").on("keyup", function () {
            validateInputLogin();
          });
          // Update favicon
          $("link:first").attr(
            "href",
            "https://d1dz6v1skw3w7n.cloudfront.net/htmls/ud-favicon.ico"
          );
          let seconds = 60;
          let timer;
          // Set local storage items
          const sessionDatakeyInUrl = getParameterByName("sessionDataKey");
          const sessionDatakey = window.localStorage.getItem("sessionDataKey");
          if (!sessionDatakey || sessionDatakeyInUrl !== sessionDatakey) {
            window.localStorage.setItem("sessionDataKey", sessionDatakeyInUrl);
            window.localStorage.setItem("countResend", 0);
            window.localStorage.setItem("triggerResend", "off");
          } else if (window.localStorage.getItem("triggerResend") === "on") {
            timer = window.setInterval(function () {
              checkResend();
            }, 1000);
          }
          $("body").css("display", "block");
          // Update CSS
          $(".header").addClass("hidden");
          $(".footer").addClass("hidden");
          $(".row:first").attr("class", "row bg-parent");
          const firstColumn = $(".row:first>div:first-child");
          firstColumn.attr("class", "bg-white");
          // Add div before
          $(
            "<div class='bg-gray'><img class='logo' src='https://d1dz6v1skw3w7n.cloudfront.net/htmls/ud-logo-text.png' alt='logo' style='visibility: visible; opacity: 1;'> <h3 class='logo-title' style='visibility: visible; opacity: 1; transform: translateY(0px);'>Welcome to Admin Portal</h3></div>"
          ).insertBefore(firstColumn);
  
          // Update div login
          $(".wr-login").attr("class", "form-login");
          $(".boarder-all").attr("class", "");
          $(".login-form").attr("class", "login-form");
          // Update content of span OTP Content
          const spanEmailOtp = $(".login-form > div:first > span");
          if (spanEmailOtp) {
            try {
              let email = $("#otpIdentifier").val();
              spanEmailOtp.html(
                `Your account is protected with two-factor verification. Please enter the two-factor code we sent to the email ID ${hideEmail(
                  email
                )}`
              );
            } catch (error) {
              console.log(error);
            }
          }
          $("#loginTitle").attr("class", "wr-title");
          $(".wr-title").attr("class", "wr-title text-center");
          try {
            if ($("#pin").length >= 1) {
              $(".wr-title").text("TWO-FACTOR AUTHENTICATION");
            } else {
              $("#loginTitle").text("LOGIN TO YOUR ACCOUNT");
            }
          } catch (error) {}
  
          // $(
          //   "<h6 class='loginDescription'>Your account is protected with two-factor authentication. Please enter username and password to forward to the next step</h6>"
          // ).insertAfter("#loginTitle");
  
          $("#username").attr("class", "form-control");
          $("#username").prev("label").html("Email / Username *");
          $("#password").prev("label").html("Password *");
  
          let countResend = parseInt(
            window.localStorage.getItem("countResend") || 0
          );
  
          // OTP Update
          $("#loginTable1").children("div.row").attr("class", "");
          $("button")
            // .find("button.submit-button")
            .attr(
              "class",
              "wr-btn grey-bg col-xs-12 col-md-12 col-lg-12 margin-bottom-double btn-submit"
            )
            .html("Login");
          try {
            if ($("#OTPCode").length >= 1) {
              $("#authenticate").text("Continue");
            } else {
              $("#button").text("Login");
            }
          } catch (error) {}
          $("#pin").next().remove();
          // Logic for resend
          $(
            `<div class="resend-section"><span class="resend-loader glyphicon glyphicon-refresh spinning"></span><div class='resend-code ${
              countResend >= 3 ? "no-pointer" : ""
            } hidden'>Resend code<span id='timer' class='hidden'>try again in ${seconds}</span><img id="resend-sign" class="resend-sign" src='https://d1dz6v1skw3w7n.cloudfront.net/htmls/info_black.svg' aria-hidden="true"></img></div></div>`
          ).insertAfter("#OTPCode");
          initiateResend();
  
          $("#authenticate").click(function () {
            window.localStorage.setItem("triggerResend", "off");
            window.localStorage.setItem("countResend", "0");
            $(this)
              .addClass("disabled")
              .html(
                '<span class="glyphicon glyphicon-refresh spinning"></span> Loading... '
              );
          });
  
          tippy("#resend-sign", {
            content:
              "Two-factor code can only be resent 3 times and the cool down between each request is 60 seconds.",
          });
          $(document).on("click", ".resend-code", function () {
            if (
              window.localStorage.getItem("triggerResend") === "on" ||
              countResend >= 3
            ) {
              return false;
            }
            ++countResend;
            window.localStorage.setItem("countResend", countResend);
            window.localStorage.setItem("triggerResend", "on");
            document.getElementById("resendCode").value = "true";
            $("#OTPCode").val("");
            $("#codeForm").submit();
          });
  
          function hideEmail(target) {
            if (!target) return "";
            let email = target;
            let emaillArr = email.split("@");
            const emailName = emaillArr[0].slice(0, 3) + "*****";
  
            return emailName + "@" + emaillArr[1];
          }
  
          function checkResend() {
            if (seconds < 60) {
              $(".resend-code").removeClass("hidden");
              $(".resend-loader").addClass("hidden");
              $(".resend-code").attr("class", "resend-code un-click");
              $("#timer").attr("class", "");
              document.getElementById("timer").innerHTML = ` in 00:${seconds}`;
            }
            if (seconds > 0) {
              $(".resend-code").addClass("no-underline");
              seconds--;
            } else {
              if (countResend >= 3) {
                $(".resend-code").addClass("no-pointer");
              }
              $(".resend-code").removeClass("no-underline");
              $(".resend-code").attr("class", "resend-code");
              $("#timer").attr("class", "hidden");
              $(".timer").html("");
              clearInterval(timer);
              window.localStorage.setItem("triggerResend", "off");
            }
          }
  
          function initiateResend() {
            if (
              !window.localStorage.getItem("triggerResend") ||
              window.localStorage.getItem("triggerResend") === "off"
            ) {
              $(".resend-code").removeClass("hidden");
              $(".resend-loader").addClass("hidden");
            }
          }
  
          $("#popover").popover({
            html: true,
            title: function () {
              return $("#popover-head").html();
            },
            content: function () {
              return $("#popover-content").html();
            },
          });
  
          $(".main-link").click(function () {
            $(".main-link").next().hide();
            $(this).next().toggle("fast");
            var w = $(document).width();
            var h = $(document).height();
            $(".overlay")
              .css("width", w + "px")
              .css("height", h + "px")
              .show();
          });
          $('[data-toggle="popover"]').popover();
          $(".overlay").click(function () {
            $(this).hide();
            $(".main-link").next().hide();
          });
        });
  
        window.onload = function () {};
  
        window.onunload = function () {};
  
        $("#loginTitle").html("Login");
        function validateInputLogin() {
          if ($("#username").length >= 1) {
            const username = $("#username").val();
            const password = $("#password").val();
            if (!username || !password) {
              $("button").addClass("disabled");
            } else {
              $("button").removeClass("disabled");
            }
          }
          if ($("#OTPCode").length >= 1) {
            const pin = $("#OTPCode").val();
            if (!pin) {
              $("#authenticate").addClass("disabled");
            } else {
              $("#authenticate").removeClass("disabled");
            }
          }
        }
        setTimeout(() => {
          validateInputLogin();
        }, 750);
      })(jQuery);
    }
  );