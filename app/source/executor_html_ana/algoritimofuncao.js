var exec = (function() {
    

    var def = {
        a: 7 * 14,
        fcod: 1.2
    }

   var values = {}
    function _getDividend() {
        var firstValue = 3 / 2;
        var vxd2 = values.vxd * values.vxd;
        var vyd2 = values.vyd * values.vyd;
        var sumValues = vxd2 + vyd2;
        var squareRoot = _getSquareRoot(sumValues);
        var dividend = firstValue * squareRoot;
        return dividend;
    }

    function _calculate() {
        var dividend = _getDividend();
        var result = dividend / def.a;
        return result;
    }

    function _validate() {
        var calc = _calculate();
        var compareValue = 0.15 * def.fcod;

        return (calc <= compareValue) ? 'OK' : 'NOK';
    }

    function _getSquareRoot(value) {
        return Math.sqrt(value);
    }

    function _getValues() {
        values.vxd = document.getElementById('vxd').value;
        values.vyd = document.getElementById('vyd').value;
    }

    function _mountEq() {
        var str1 = String(values.vxd).substr(0, 5);
        var str2 = String(values.vyd).substr(0, 5);

        document.getElementById('divid').innerHTML = '(3/2) x &radic; <t style="border-top: 1px solid;display: inline;">' + str1 + '&sup2; + ' + str2 + '&sup2;</t>';
        document.getElementById('area').innerHTML = '(7 x 14)';
        document.getElementById('left').innerHTML = '<= (0.15 x ' + def.fcod + ')';
	document.getElementById('calc').innerHTML = _calculate() + ' <= ' +  (0.15 * def.fcod);
    }

    function doCalc() {
        _getValues();
        document.getElementById('result').innerHTML = _validate();
        _mountEq();
    }

    return {
        doCalc: doCalc
    }

})();