var barraProgre = 0;
function iniPar (btn, bar, span, tiempo) 
{
	if ($(btn).hasClass('parar'))
	{
		clearInterval(barraProgre);
		$(btn).removeClass('parar').addClass('btn-success').text('iniciar');
	}
	else
	{
		$(btn).addClass('parar').removeClass('btn-success').text('parar');
		var tiempo = parseInt(tiempo);
		var progresoPorcen = 0;
		var progresoTiempo = 0;
		var control = 0;
		var incremento = (100 / tiempo) / 3;
		barraProgre = setInterval(function()
		{
			progresoPorcen = +(progresoPorcen += incremento).toFixed(2);
			// ACTUALIZA LA BARRA DE PROGRESO
			$(bar).attr("style", ("width:" + progresoPorcen + "%"));
			$(bar).attr("aria-valuenow", progresoPorcen)
			// ACTUALIZA TIMEPO EN LA BARRA
			if (control === 3) 
			{
				progresoTiempo++;
				$(span).text(progresoTiempo + ' s');
				control = 0;
			}
			// console.log(progresoPorcen + '%')
			// COMPRUEBA FIN DE CICLO
			if(progresoTiempo >= tiempo) 
			{
				clearInterval(barraProgre);
				$(btn).removeClass('parar').addClass('btn-success').text('iniciar');
			}
			control++
		}, 333);
	}
}