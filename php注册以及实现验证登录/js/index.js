/**
 * 
 * @authors Wang Yinkai (15057638632@163.com)
 * @date    2018-12-02 20:42:56
 * @version $Id$
 */

(function() {

    if (!String.prototype.trim) {
        (function() {

            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }

    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function(inputEl) {

        if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input--filled');
        }


        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
            classie.remove(ev.target.parentNode, 'input--filled');
        }
    }
})();

$(function() {
    $('#login #login-password').focus(function() {
        $('.login-owl').addClass('password');
    }).blur(function() {
        $('.login-owl').removeClass('password');
    });
    $('#login #register-password').focus(function() {
        $('.register-owl').addClass('password');
    }).blur(function() {
        $('.register-owl').removeClass('password');
    });
    $('#login #register-repassword').focus(function() {
        $('.register-owl').addClass('password');
    }).blur(function() {
        $('.register-owl').removeClass('password');
    });
});

function goto_register() {
    $("#register-username").val("");
    $("#register-password").val("");
    $("#register-repassword").val("");
    $("#register-code").val("");
    $("#tab-2").prop("checked", true);
}

function goto_login() {
    $("#login-username").val("");
    $("#login-password").val("");
    $("#tab-1").prop("checked", true);
}


