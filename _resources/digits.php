    <!-- Top Digits -->
<?php /*<gradientRect class="binary-digit binary-digit-top binary-digit-border" x="0" />*/ ?>
<?php
    $d=32;
    $x=22;
    while ($d >= 0)
    {
        echo "		<gradientRect id=\"binary-digit-top-".$d."\" class=\"binary-digit binary-digit-top\" x=\"".$x."\" />\n";
        $d--;
        $x+=9;
    }
?>
<?php /* <gradientRect class="binary-digit binary-digit-bottom binary-digit-border" x="332" /> */ ?>

<?php exit; ?>

    <!-- Bottom Digits -->
<?php /*<gradientRect class="binary-digit binary-digit-top binary-digit-border" x="0" />*/ ?>
<?php
        $d=32;
        $x=12;
        while ($d >= 0)
        {
            echo "		<gradientRect id=\"binary-digit-bottom-".$d."\" class=\"binary-digit binary-digit-bottom\" x=\"".$x."\" />\n";
            $d--;
            $x+=10;
        }
?>
<?php /* <gradientRect class="binary-digit binary-digit-bottom binary-digit-border" x="332" /> */ ?>
