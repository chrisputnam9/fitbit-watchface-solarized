<?php
	$y_map = [ 40, 30, 20, 12, 6, 2, ];
?>
	<!-- Top Digits -->
<?php
    $d=32;
    $x=22;
    while ($d >= 0)
    {
		$y = 0;
		if (isset($y_map[$d])) {
			$y = $y_map[$d];
		} elseif (isset($y_map[(32-$d)])) {
			$y = $y_map[32-$d];
		}

        echo '    <gradientRect id="binary-digit-top-'.$d.'" class="binary-digit binary-digit-top" x="'.$x.'" y="'.$y.'" />' . "\n";
        $d--;
        $x+=9;
    }
?>

    <!-- Bottom Digits -->
<?php
	$d=32;
	$x=22;
	while ($d >= 0)
	{
		$y = 0;
		if (isset($y_map[$d])) {
			$y = $y_map[$d];
		} elseif (isset($y_map[(32-$d)])) {
			$y = $y_map[32-$d];
		}

		$y+= 20;

        echo '    <gradientRect id="binary-digit-bottom-'.$d.'" class="binary-digit binary-digit-bottom" x="'.$x.'" y="100%-'.$y.'" />' . "\n";
		$d--;
		$x+=9;
	}
?>
