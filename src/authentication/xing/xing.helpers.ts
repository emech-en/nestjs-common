export const XING_LOGIN_HTML = 'XING_LOGIN_HTML';
export const XING_SIGNATURE_SALT = 'XING_SIGNATURE_SALT';

const replace = (key: string, value: string, template: string) => {
  const pattern = '\\[\\[\\[\\[' + key + '\\]\\]\\]\\]';
  const replaceRegex = new RegExp(pattern, 'g');
  return template.replace(replaceRegex, value);
};

export const getXingLoginHtml = (values: {
  consumerKey: string;
  redirectUrl: string;
  buttonText: string;
  linkText: string;
}) => {
  let html = replace('YOUR_CONSUMER_KEY', values.consumerKey, LOGIN_HTML_TEMPLATE);
  html = replace('REDIRECT_URL', values.redirectUrl, html);
  html = replace('BUTTON_TEXT', values.buttonText, html);
  html = replace('LINK_TEXT', values.linkText, html);
  return html;
};

// tslint:disable-next-line:max-line-length
// noinspection ES6ConvertVarToLetConst,JSUnresolvedVariable,JSUnresolvedFunction,JSUnresolvedLibraryURL,JSCheckFunctionSignatures
/**
 * ********************************* *
 * The Xing Login Page Html Template *
 *                                   *
 * PAY ATTENTION TO BACKTICK (` `)   *
 * THIS TEMPLATE IS A STRING HERE    *
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
          var userString = JSON.stringify(user, function(key, value) { return value ? value : "" });
          var url = "[[[[REDIRECT_URL]]]]?user="+userString+"&hash="+hash;
          $("#continueButton").attr('href', url).show();
          $("#fakeLogin").hide();
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

      var onXingAuthLoginIsCalled = false;
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
    <div style="display: none">
      <script type="xing/login">
        {
          "consumer_key": "[[[[YOUR_CONSUMER_KEY]]]]"
        }
      </script>
    </div>

    <div style="position:fixed; width: 100%; height: 100%; top: 0; left: 0;">
      <button id="fakeLogin"
        style="display: none; width: 80%; left: 10%; height: 4em; margin-top: -4em; font-size: 3em; position: absolute; top: 50%"
        onclick="$loginButton.click()">
          [[[[BUTTON_TEXT]]]]
      </button>
      <a id="continueButton"
        style="display: none; width: 80%; left: 10%; height: 4em; margin-top: -4em; font-size: 3em; position: absolute; top: 50%">
         [[[[LINK_TEXT]]]]
      </a>
    </div>

    <script>
      var $loginButton = undefined;
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
              return setTimeout(function() {
                $loginButton = $loginBtn;
                $("#fakeLogin").show();
              }, 10);
            }
          })($iFrame)
        }
      })(document);
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
  </body>
</html>`;
