function testHello()
{
	console.log("hello");	
}

function convertThetaToPentagram(theta)
{
	var point = {};
	point.z = 0;
	
	if (theta >= 8 * Math.PI / 5)
	{
		theta = theta - 8 * Math.PI / 5;
		point.x = -161.803 + 287.914 * theta;
		point.y = 117.557 + -93.545 * theta;
	}
	else if (theta >= 6 * Math.PI / 5)
	{
		theta = theta - 6 * Math.PI / 5;
		point.x = 61.803 + -177.940 * theta;
		point.y = -190.211 + 244.914 * theta;
	}
	else if (theta >= 4 * Math.PI / 5)
	{
		theta = theta - 4 * Math.PI / 5;
		point.x = 61.803;
		point.y = 190.211 + -302.730 * theta;
	}
	else if (theta >= 2 * Math.PI / 5)
	{
		theta = theta - 2 * Math.PI / 5;
		point.x = -161.803 + 177.940 * theta;
		point.y = -117.557 + 244.914 * theta;
	}
	else 
	{
		point.x = 200 - (287.914) * theta;
		point.y = 0 - 93.545 * theta;
	}
	
	return point;
}
