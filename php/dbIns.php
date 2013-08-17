<?php

$sql=$_GET["q"];
$sql=str_replace("\'","'",$sql);
$sql=str_replace('\"','"',$sql);
$con=mysqli_connect('205.178.146.107','fitk','Flatron1','fitk');
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

mysqli_query($con,$sql);


mysqli_close($con);
?>
