<?php
/**
 * 
 * @authors Wang Yinkai (15057638632@163.com)
 * @date    2018-12-02 21:57:29
 * @version $Id$
 */
    include('secret.php');
    header("Content-type: text/html; charset=utf-8"); 

    if(!isset($_POST["submit"])){
        exit("错误执行");
    }//判断是否有submit操作

    $name = $_POST["username"];  
    $pwd = $_POST["password"]; 
    $pwd_confirm = $_POST["password_confirm"];

    include('connect.php');//链接数据库
    $sql = "SELECT * FROM user WHERE name = '$name'";
    $sel=mysqli_query($con, $sql);
    $num = mysqli_num_rows($sel);
    if($name == "" || $pwd == "") {  
        echo "<script>alert('信息不能为空，请重新填写');history.go(-1);</script>";  
    }
    else if ((3 > strlen($name)) || (16 < strlen($name))) {  
        echo "<script>alert('用户名3-16位,请重新填写');history.go(-1);</script>";
    }
    else if (0 < $num){
        echo "<script>alert('此用户名已经注册,请重新填写');history.go(-1);</script>"; 
    }
    else if ((6 > strlen($pwd)) || (18 < strlen($pwd))) {  
        echo "<script>alert('密码6-18位,请重新填写');history.go(-1);</script>";
    }
    else if ($pwd != $pwd_confirm) {
        echo "<script>alert('两次输入的密码不一致,请重新填写');history.go(-1);</script>";
    }
    else{
        $secret = encrypt($pwd, 'E');
        $q = "INSERT INTO user ".
        "(name,pwd,secret_id) ".
        "VALUES ".
        "('{$_POST['username']}','{$secret}','{$_POST['secret_key']}')";
        $reslut=mysqli_query($con, $q);//执行sql
    
        if (!$reslut){
            die('Error: ' . mysqli_error($con));//如果sql执行失败输出错误
        }else{
            echo "<script>
                    alert('注册成功!');
                    setTimeout(function(){window.location.href='../index.html';},500);
                </script>";
        }
    }

    mysqli_close($con);//关闭数据库

?>