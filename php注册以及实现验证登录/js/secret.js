/**
 * 
 * @authors Wang Yinkai (15057638632@163.com)
 * @date    2018-12-02 21:14:10
 * @version $Id$
 */


! function main() {
    var $qrcode = document.getElementById('qrcode');
    var $secret = document.getElementById('secret');
    var $totp = document.getElementById('totp');
    var $ttl = document.getElementById('ttl');

    var key = TOTP.randomKey();
    var totp = new TOTP(key);

    // $secret.innerHTML = key;
    $secret.value = key;

    function refreshCode() {
        $totp.innerHTML = totp.genOTP();
    }

    function startInterval() {
        setInterval(function() {
            var ttl = Math.floor(Date.now() / 1000 % 30);
            $ttl.innerHTML = 30 - ttl;
            if (ttl === 0) {
                refreshCode();
            }
        }, 1000);
    }

    /**
     * 将时间同步到整秒, 再开始轮询
     */
    function sync2NextSecond() {
        var ms2NextSecond = 1000 - (Date.now() % 1000);
        setTimeout(startInterval, ms2NextSecond);
    }

    sync2NextSecond();
    refreshCode();

}();

document.onkeydown = function() {
    if ((event.keyCode == 116) || (event.ctrlKey && event.keyCode == 82)) {
        event.keyCode = 0;
        event.returnValue = false;
    }
}