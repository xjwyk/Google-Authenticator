<?php
/**
 * 
 * @authors Wang Yinkai (15057638632@163.com)
 * @date    2018-12-03 21:55:24
 * @version $Id$
 */
    header("Content-type: text/html; charset=utf-8"); 

    if(!isset($_POST["submit"])){
        exit("错误执行");
    }//判断是否有submit操作

    $name = $_POST["username"];
    $password = $_POST["password"];
    $code = $_POST["code"];

    include('connect.php');//链接数据库

    // 验证填写信息是否合乎规范
    if($name == "" || $password == "" || $code == "") {
        echo "<script>alert('信息不能为空，请重新填写');history.go(-1);</script>";  
    }
    else {  
        mysqli_query($con,"SET NAMES UTF8");  // 设定字符集

        $query = "select * from user where name = '{$_POST['username']}' and pwd = '{$_POST['password']}'";
        $result = mysqli_query($con, $query);  
 
        if (!$result) {
            echo "Error: ".mysqli_error($con);
            exit();
        }
        $rows = mysqli_fetch_array($result, MYSQLI_ASSOC);
        $num = mysqli_num_rows($result);
        if (1 ==  $num){
            echo "<script type='text/javascript' src='../js/totp.min.js'></script>";
            echo "<script>
                var key = '".$rows["secret_id"]."';
                var totp = new TOTP(key);
                if(".$_POST["code"]." == totp.genOTP()) {
                    alert('登录成功');history.go(-1);
                }
                else{
                    alert('登录失败');history.go(-1);
                }</script>";
        }
        mysqli_free_result($result);
    }
    mysqli_close($con);
?>
