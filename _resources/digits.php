    <!-- Top Digits -->
    <rect class="binary-digit binary-digit-top binary-digit-border" x="0" />
<?php
    $d=32;
    $x=12;
    while ($d >= 0)
    {
        echo "		<rect id=\"binary-digit-top-".$d."\" class=\"binary-digit binary-digit-top\" x=\"".$x."\" />\n";
        $d--;
        $x+=10;
    }
?>
    <rect class="binary-digit binary-digit-top binary-digit-border" x="344" />

    <!-- Bottom Digits -->
    <rect class="binary-digit binary-digit-bottom binary-digit-border" x="0" />
<?php
        $d=32;
        $x=12;
        while ($d >= 0)
        {
            echo "		<rect id=\"binary-digit-bottom-".$d."\" class=\"binary-digit binary-digit-bottom\" x=\"".$x."\" />\n";
            $d--;
            $x+=10;
        }
?>
    <rect class="binary-digit binary-digit-bottom binary-digit-border" x="344" />
