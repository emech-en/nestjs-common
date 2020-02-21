export const XING_LOGIN_HTML = 'XING_LOGIN_HTML';
export const XING_SIGNATURE_SALT = 'XING_SIGNATURE_SALT';

export const getXingLoginHtml = (consumerKey: string): string => {
  const pattern = '\\[\\[\\[\\[YOUR_CONSUMER_KEY\\]\\]\\]\\]';
  const replaceRegex = new RegExp(pattern, 'g');
  return LOGIN_HTML_TEMPLATE.replace(replaceRegex, consumerKey);
};

/**
 * ********************************* *
 * The Xing Login Page Html Template *
 *                                   *
 * PAY ATTENTION TO BACKTICK (` `)   *
 * THIS TEMPLATE IS A STRING HERE    *
 *                                   *
 * ToDo: Remove This verifyLogin function
 *                                   *
 * ********************************* *
 */
const LOGIN_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Login with XING</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <meta charset="UTF-8" />
    <script>
      window.verifyLogin = function(success, user, hash) {
        if (success) {
          console.log("sending data for verify", user, hash);
          $.post("verify", {user: user, hash: hash}, function(data) {
            console.log("verify result: ", data);
            console.log(data);
          });
        } else {
          console.log("login failed");
        }
      };

      function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

      function onXingAuthLogin(response) {
        if (window.verifyLogin) {
          if (response.user) {
            window.verifyLogin(true, response.user, getCookie("xing_p_lw_s_[[[[YOUR_CONSUMER_KEY]]]]"));
          } else if (response.error) {
            window.verifyLogin(false, error);
          }
        }
      }
    </script>
  </head>
  <body>
    <script type="xing/login">
      {
        "consumer_key": "[[[[YOUR_CONSUMER_KEY]]]]"
      }
    </script>

    <script>
      (function(d) {
        var js;
        var id = "lwx";
        if (d.getElementById(id)) return;
        js = d.createElement("script");
        js.id = id;
        js.src = "https://www.xing-share.com/plugins/login.js";
        d.getElementsByTagName("head")[0].appendChild(js);
      })(document);
    </script>

    <script>
      (function findIFrame(d) {
        var $iFrame = $("body iframe:first-child");
        if ($iFrame.length === 0) {
          return setTimeout(function() {findIFrame(d)}, 500);
        } else {
          (function doLogin($frame) {
            var $loginBtn = $frame.contents().find("#xing-login");
            if ($loginBtn.length === 0) {
              return setTimeout(function() {doLogin($frame)}, 500);
            } else {
                $loginBtn.click()
            }
          })($iFrame)
        }
      })(document);
    </script>
  </body>
</html>`;
