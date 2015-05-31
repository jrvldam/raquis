"strict mode";
var usuario = {};
var ejercicio = {};
var NO_ACTION = 0;
var UPDATE = 1;
var INSERT = 2;
	
$(document).ready(function() 
{
	var action = NO_ACTION;

	$('#nuevo').click(function()
	{
		action = INSERT;
		var inputs = nuevo($("#usuInput > div > input"), $("#formUsu"));
		$("#cajaUsu").val("").addClass("toHide");
		$("#btnFind").addClass("toHide");
		$("#usuario").addClass("active"); // propia de usuario
		$("#admin").removeClass("active"); // propia de usuario
		usuario = undefined; // propia de usuario
		usuario = { // propia de usuario
			"nombre": "", 
			"clave": "",
			"rol": ""
		};
		$(inputs).attr('onblur', 'checkInputs(this);');
	});

	$('#editar').click(function()
	{
		action = UPDATE;
		var inputs = clearInputs("#usuInput > div > input");
		inputs.attr('onblur', 'checkInputs(this);');
		$("#cajaUsu").toggle().focus().keyup(function()
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
		$('#btnFind').toggle().click(function()
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
						$("#cajaUsu").val("").toggle();
						$('#btnFind').toggle();
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
		$(inputs).attr('onblur', 'checkInputs(this);');
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
						alert('No se pudo encontrar el ejercicio.\nRevise el nombre.');
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
});

function guardar(url, datos, callback)
{
    // e.preventDefault();
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

// function completeHandler()
// {
// 	alert("yuuuuuu!!");
// }
// function errorHandler()
// {
// 	alert("pringao!!!");
// }

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
	// $("#nuevoRut").click(function()
	// {
	// 	action = INSERT;
	// 	nuevo($("#cajaRut"), $("#btnFindRut"), $("#inputRut > div > input"), $("#formRut"));
	// 	$("#inputRut > div > textarea").attr('onblur', 'checkInputs(this);');
	// 	rutinaNueva = undefined;
	// 	rutinaNueva = {
	// 		"obser": "",
	// 		"orden": "",
	// 		"usuario": "",
	// 		"ejer": "",
	// 		"repe": "",
	// 		"tiempo":""
	// 	};
	// });