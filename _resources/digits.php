<?php

$d=32;
$x=12;

while ($d >= 0)
{
    echo "\t<rect class=\"binary-digit binary-digit-top binary-digit-".$d."\" x=\"".$x."\" />\n";
    $d--;
    $x+=10;
}
