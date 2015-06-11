"strict mode";
var usuario = {};
var ejercicio = {};
var rutina = {};
var NO_ACTION = 0;
var UPDATE = 1;
var INSERT = 2;
	
$(document).ready(function() 
{
	var action = NO_ACTION;

	$('#nuevo').click(function()
	{
		action = INSERT;
		$("#findUsu").attr("hidden", "true");
		var inputs = nuevo($("#usuInput > div > input"), $("#formUsu"));
		$("#usuario").addClass("active"); // propia de usuario
		$("#admin").removeClass("active"); // propia de usuario
		usuario = undefined; // propia de usuario
		usuario = { // propia de usuario
			"nombre": "", 
			"clave": "",
			"rol": ""
		};
		// $(inputs).attr('onblur', 'checkInputs(this);');
	});

	$('#editar').click(function()
	{
		action = UPDATE;
		var inputs = clearInputs("#usuInput > div > input");
		inputs.attr('onblur', 'checkInputs(this);');
		$("#findUsu").toggle();
		$("#cajaUsu").focus().keyup(function()
		{
			if($('#cajaUsu').val().length > 0)
			{
				$('#btnFind').removeAttr('disabled');
			}
			else
			{
				$('#btnFind').attr('disabled','true');
			}
		});
		$('#btnFind').click(function()
		{
			var nomUsu = $.trim($("#cajaUsu").val());
			if(nomUsu)
			{
				$.getJSON('/getDoc?usuario=' + nomUsu, function(usuario)
				{
					if(usuario.error)
					{
						alert('No se pudo encontrar el usuario.\nRevise el nombre.');
					}
					else
					{
						$("#formUsu").removeClass("toHide");
						$(inputs[0]).val(usuario.nombre);
						$(inputs[1]).val(usuario.clave);
						if(usuario.rol === "usuario")
						{
							$("#usuario").addClass("active");
							$("#admin").removeClass("active");
						}
						else
						{
							$("#admin").addClass("active");
							$("#usuario").removeClass("active");
						}
						$(inputs).prev('span').children('button').removeClass('btn-warning').addClass('btn-success').children('span').removeClass('glyphicon-question-sign').addClass('glyphicon-ok');
						$("#cajaUsu").val("");
						$('#findUsu').attr("hidden", "true");
					}
				});
			}
		});
	});

	$("#guardar").click(function()
	{
		if (action) 
		{
			var url = "/adminUsuario?action=" + action;
			var inputs = $("#usuInput > div > input");
			usuario.nombre = $(inputs[0]).val();
			usuario.clave = $(inputs[1]).val();
			usuario.rol = $("#usuInput .active").children().val();
			var cadena = JSON.stringify(usuario);
			guardar(url, { usuario: cadena }, function(msg)
			{
				if (msg.ok === 1) 
				{
					refreshTable("/admin?usuarios=true&ts=" + $.now(), $("#tablaUsuarios tbody"));
					alert(usuario.nombre + ((action === 1)? " actualizado!" : " agregado!"));
				}
				else
				{
					alert(msg);
				}
			});
		} 
		else
		{
			alert("No se ha seleccionado nuevo/editar");
		}
	});

 	$("#nuevoEjer").click(function()
	{
		action = INSERT;
		$("#cajaEjer, #btnFindEjer").addClass("toHide").val("");
		// $("#btnFindEjer").addClass("toHide");
		var inputs = nuevo($("#inputEjer > div > input"), $("#formEjer"));
		ejercicio = undefined;
		ejercicio = {
			"nombre": "",
			"descripcion": "",
			"imagen": "",
			"tipo": ""
		};
		// $(inputs).attr('onblur', 'checkInputs(this);');
	});

	$("#editarEjer").click(function()
	{
		action = UPDATE;
		var inputs = clearInputs("#inputEjer > div > input");
		inputs.attr('onblur', 'checkInputs(this);');
		$("#cajaEjer").toggle().focus().keyup(function()
		{
			if($('#cajaEjer').val().length > 0)
			{
				$('#btnFindEjer').removeAttr('disabled');
			}
			else
			{
				$('#btnFindEjer').attr('disabled','true');
			}
		});
		$('#btnFindEjer').toggle().click(function()
		{
			var nomEjer = $.trim($("#cajaEjer").val());
			if(nomEjer)
			{
				$.getJSON('/getDoc?ejercicio=' + nomEjer, function(ejercicio)
				{
					if(ejercicio.error)
					{
						alert('No se pudo encontrar el ejercicio.\nPorfavor revise el nombre.');
					}
					else
					{
						$("#formEjer").removeClass("toHide");
						$(inputs[0]).val(ejercicio.nombre);
						$(inputs[1]).val(ejercicio.descripcion);
						$(inputs[2]).val(ejercicio.tipo);
						$(inputs[3]).val(ejercicio.imagen);
						$(inputs).prev('span').children('button').removeClass('btn-warning').addClass('btn-success').children('span').removeClass('glyphicon-question-sign').addClass('glyphicon-ok');
						$("#inputEjer > div > span > span > input").parent().removeClass("btn-warning").addClass("btn-success");
						$("#cajaEjer").val("").toggle();
						$('#btnFindEjer').toggle();
					}
				});
			}
		});
	});

	$("#guardarEjer").click(function()
	{
		if (action) 
		{
			var url = "/adminEjer?action=" + action;
			var inputs = $("#inputEjer > div > input");
			ejercicio.nombre = $(inputs[0]).val();
			ejercicio.descripcion = $(inputs[1]).val();
			ejercicio.tipo = $(inputs[2]).val();
			ejercicio.imagen = "";
			var cadena = JSON.stringify(ejercicio);
			guardar(url, { ejercicio: cadena }, function(msg)
			{
				if (msg.ok === 1) 
				{
					refreshTable("/admin?ejercicios=true&ts=" + $.now(), $("#tablaEjer tbody"));
					alert(ejercicio.nombre + ((action === 1)? " actualizado!" : " agregado!"));
				}
				else
				{
					alert(msg);
				}
			});
		} 
		else
		{
			alert("No se ha seleccionado nuevo/editar");
		}
	});

	$("#nuevaRut").click(function()
	{
		action = INSERT;
		$("#formRut").addClass("toHide");
		var findRut = "#findRut";
		var cajaPaci = "#cajaRutPaci";
		var btnPaci = "#btnFindRutPaci";
		var cajaEjer = "#cajaRutEjer";
		var btnEjer = "#btnFindRutEjer";
		findNecesary(action, findRut, cajaPaci, btnPaci, cajaEjer, btnEjer, function(rutina)
		{
			console.log("en el findNecesary de nueva");
			if (rutina.error) 
			{
				var inputs = nuevo($("#inputRut > div > input"), $("#formRut"));
				$(inputs).val("");
				$("#inputRut > div > textarea").val("").attr('onblur', 'checkInputs(this);');
				rutina = undefined;
				rutina = {
					"obser": "",
					"orden": "",
					"usuario": "",
					"ejer": "",
					"repe": "",
					"tiempo": ""
				};
				$("#formRut").removeClass("toHide");
			}
			else
			{
				alert("El paciente ya tiene la rutina asignada.\n Puede editarla.");
			}
		});
	});

	$("#editarRut").click(function()
	{
		action = UPDATE;
		$("#formRut").addClass("toHide");
		var findRut = "#findRut";
		var cajaPaci = "#cajaRutPaci";
		var btnPaci = "#btnFindRutPaci";
		var cajaEjer = "#cajaRutEjer";
		var btnEjer = "#btnFindRutEjer";
		findNecesary(action, findRut, cajaPaci, btnPaci, cajaEjer, btnEjer, function(rutina)
		{
			if (rutina.error) 
			{
				alert('No se pudo encontrar la rutina.\nPuede que el usuario no la tenga asignada.');
			}
			else
			{
				var inputs = nuevo($("#inputRut > div > input"), $("#formRut"));
				$("#inputRut > div > textarea").val("").attr('onblur', 'checkInputs(this);');
				$("#inputRut > div > textarea").val(rutina.obser);
				$(inputs[0]).val(rutina.orden);
				$(inputs[1]).val(rutina.repe || 0);
				$(inputs[2]).val(rutina.tiempo || 0);
				$(inputs).prev('span').children('button').removeClass('btn-warning').addClass('btn-success').children('span').removeClass('glyphicon-question-sign').addClass('glyphicon-ok');
				$("#formRut").removeClass("toHide");
			}
		});
	});

	$("#guardarRut").click(function()
	{
		if (action)
		{
			var url = "/adminRut?action=" + action;
			var inputs = $("#inputRut > div > input");
			rutina.usuario = $("#cajaRutPaci").val();
			rutina.ejer = $("#cajaRutEjer").val();
			rutina.obser = $("#inputRut > div > textarea").val();
			rutina.orden = $(inputs[0]).val();
			rutina.repe = $(inputs[1]).val();
			rutina.tiempo = $(inputs[2]).val();
			console.log($("#inputRut > div > textarea").val());
			for (var i = 0; i < inputs.length; i++) 
			{
				console.log($(inputs[i]).val());
			}
			var cadena = JSON.stringify(rutina);
			guardar(url, { rutina: cadena }, function(msg)
			{
				if (msg.ok === 1) 
				{
					refreshRutinas($("#cajaRutPaci").val());
					alert("Rutina" + ((action === 1)? " actualizada!" : " agregada!"));
				}
				else
				{
					alert(msg);
				}
			});
		} 
		else
		{
			alert("No se ha seleccionado nuevo/editar");
		}
	});
});

function soloNumeros(e)
{
	var valor = (e.charCode);
	if ((valor > 47 && valor < 58) || valor === 0) 
	{
		return true;
	}
	else
	{
		return false;
	}
}

function valName(e)
{
	if (/[^\$:;%&#@!,|/ª=º\[\]{}\\()\+<>*"'?\^]/g.test(String.fromCharCode(e.charCode))) 
	{
		return true;
	}
	else
	{
		return false;
	}
}

function findNecesary(action, findRut, cajaPaci, btnPaci, cajaEjer, btnEjer, callback)
{
	console.log(action);
	$(findRut).removeAttr("hidden");
	$(cajaPaci).removeAttr("disabled").val("");
	$(cajaEjer).removeAttr("disabled").val("");
	$(cajaPaci).focus().keyup(function()
	{
		if($(cajaPaci).val().length > 0)
		{
			$(btnPaci).removeAttr('disabled');
		}
		else
		{
			$(btnPaci).attr('disabled','true');
		}
	});

	$(btnPaci).click(function()
	{
		var nomUsu = $.trim($(cajaPaci).val());
		if(nomUsu)
		{
			$.getJSON('/getDoc?usuario=' + nomUsu, function(_usuario)
			{
				if(_usuario.error)
				{
					alert('No se pudo encontrar el usuario.\nRevise el nombre.');
				}
				else
				{
					$(cajaPaci).attr("disabled", "true"); // BLOQUEA LA CAJA DE PACIENTE
					refreshRutinas(nomUsu); // CARGA O REFRESCA LA TABLA DE RUTINAS DEL PACIENTE
					
					$(cajaEjer).focus().keyup(function()
					{
						if($(cajaEjer).val().length > 0)
						{
							$(btnEjer).removeAttr('disabled');
						}
						else
						{
							$(btnEjer).attr('disabled','true');
						}
					});
					$(btnEjer).click(function()
					{
						var nomEjer = $.trim($(cajaEjer).val());
						if(nomEjer)
						{
							$.getJSON('/getDoc?ejercicio=' + nomEjer, function(_ejercicio)
							{
								if(_ejercicio.error)
								{
									alert('No se pudo encontrar el ejercicio.\nRevise el nombre.');
								}
								else
								{
									$(cajaEjer).attr("disabled", "true"); // BLOQUEA LA CAJA DE EJERCICIO

									$.getJSON("/getDoc?usuario=" + $("#cajaRutPaci").val() + "&ejercicio=" + $("#cajaRutEjer").val(), function(rutina)
									{
										if (action === 1) 
										{
											return callback(rutina);
										}
										else if (action === 2)
										{
											return callback(rutina);
										}
										else
										{
											alert("ERROR EN EL EL RETORNO DEL GET-JSONDESPUES DE USUARIO...");
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

function guardar(url, datos, callback)
{
    $.ajax({ method: "POST", url: url, data: datos })
    .fail(function()
    {
    	alert("Error en el guardado. (Cli)");
    })
    .done(function(msg)
    {
    	return callback(msg);
    });
}

function refreshTable(uri, tBody)
{
	$(tBody).empty();
	$.getJSON(uri, function(coleccion)
	{
		for (var doc in coleccion)
		{
			var tr = $("<tr></tr>");
			for (var item in coleccion[doc])
			{
				if (item != "_id") 
				{
					tr.append($("<td></td>").text(coleccion[doc][item]));
				}
			}
			$(tBody).append(tr);
		}
	});
}

function refreshRutinas(nomUsu)
{
	$.getJSON("/admin?rutinas=" + nomUsu + "&ts" + $.now(), function(rutinas)
	{
		$("#tablaRut tbody").empty();

		for (var rutina in rutinas)
		{
			var tr = $("<tr></tr>");
			
			tr.append($("<td></td>").text(rutinas[rutina].orden));
			tr.append($("<td></td>").text(rutinas[rutina].obser));
			tr.append($("<td></td>").text(rutinas[rutina].ejer));
			tr.append($("<td></td>").text(rutinas[rutina].repe));
			tr.append($("<td></td>").text(rutinas[rutina].tiempo));

			$("#tablaRut tbody").append(tr);
		}
	});
}

function nuevo(inputs, formulario)
{
	clearInputs(inputs);
	inputs.attr('onblur', 'checkInputs(this);');
	$(formulario).removeClass("toHide");
	return $(inputs);
}

function checkInputs(elem)
{
	if ($(elem).val() === "" || $(elem).val() === 'undefined') 
	{
		$(elem).prev('span').children('button').removeClass('btn-success').addClass('btn-warning').children('span').removeClass('glyphicon-ok').addClass('glyphicon-question-sign');
	}
	else
	{
		$(elem).prev('span').children('button').removeClass('btn-warning').addClass('btn-success').children('span').removeClass('glyphicon-question-sign').addClass('glyphicon-ok');
	}
}

function clearInputs(inputs)
{
	$(inputs).val("").prev('span').children('button').removeClass('btn-success').addClass('btn-warning').children('span').removeClass('glyphicon-ok').addClass('glyphicon-question-sign');
	return $(inputs);
}

// function validateFile()
// {
// 	$(':file').change(function(){
// 	    var file = this.files[0];
// 	    var name = file.name;
// 	    var size = file.size;
// 	    var type = file.type;
// 	    //Your validation
// 	});
// }
// 
// 
// 
