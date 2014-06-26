/**
 * Code for regression extracted from jqplot.trendline.js
 *
 * Version: 1.0.0a_r701
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can
 * choose the license that best suits your project and use it accordingly.
 *
 **/
function regression(x, y, typ) {
	var type = (typ == null) ? 'linear' : typ,
		N = x.length,
		slope,
		intercept,
		SX = 0,
		SY = 0,
		SXX = 0,
		SXY = 0,
		SYY = 0,
		Y = [],
		X = [];

	if (type == 'linear') {
		X = x;
		Y = y;
	} else if (type == 'exp' || type == 'exponential') {
		for (var i = 0; i < y.length; i++) {
			// ignore points <= 0, log undefined.
			if (y[i] <= 0) {
				N--;
			} else {
				X.push(x[i]);
				Y.push(Math.log(y[i]));
			}
		}
	}

	for (var i = 0; i < N; i++) {
		SX = SX + X[i];
		SY = SY + Y[i];
		SXY = SXY + X[i] * Y[i];
		SXX = SXX + X[i] * X[i];
		SYY = SYY + Y[i] * Y[i];
	}

	slope = (N * SXY - SX * SY) / (N * SXX - SX * SX);
	intercept = (SY - slope * SX) / N;

	return [slope, intercept];
}

function linearRegression(X, Y) {
	var ret = regression(X, Y, 'linear');
	return [ret[0], ret[1]];
}

function expRegression(X, Y) {
	var x = X,
		y = Y,
		ret = regression(x, y, 'exp'),
		base = Math.exp(ret[0]),
		coeff = Math.exp(ret[1]);
	return [base, coeff];
}

function fitData(data, typ) {
	var type = (typ == null) ? 'linear' : typ,
		ret,
		res,
		x = [],
		y = [],
		ypred = [];

	for (var i = 0; i < data.length; i++) {
		if (data[i] != null && data[i][0] != null && data[i][1] != null) {
			x.push(data[i][0]);
			y.push(data[i][1]);
		}
	}

	if (type == 'linear' || type == 'category') {
		if (type == 'category') {
			var categories = x;
			x = [];
			for (var n = 0, l = categories.length; n < l; ++n) {
				x.push(n);
			}
		}

		ret = linearRegression(x, y, type);

		for (var i = 0; i < x.length; i++) {
			res = ret[0] * x[i] + ret[1];
			if (type == 'category') {
				ypred.push([categories[i], res]);
			} else  {
				ypred.push([x[i], res]);
			}
		}
	} else if (type == 'exp' || type == 'exponential') {
		ret = expRegression(x, y);
		for (var i = 0; i < x.length; i++) {
			res = ret[1] * Math.pow(ret[0], x[i]);
			ypred.push([x[i], res]);
		}
	}
	return {
		data: ypred,
		slope: ret[0],
		intercept: ret[1]
	};
}