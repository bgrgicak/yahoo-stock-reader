<?php
$sql=$_GET["q"];
$sql=str_replace("\'","'",$sql);
$sql=str_replace('\"','"',$sql);
$con = mysqli_connect('205.178.146.107','fitk','Flatron1','fitk');
if (!$con)
  {
  die('Could not connect: ' . mysqli_error($con));
  }

$result = mysqli_query($con,$sql);


while($row = mysqli_fetch_array($result))
  {
	  $data[]=$row;
  }
mysqli_close($con);
echo json_encode($data);
?>
