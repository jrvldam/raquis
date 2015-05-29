"strict mode";
var usuarioNuevo = {};
var ejercicioNuevo = {};
var NO_ACTION = 0;
var UPDATE = 1;
var INSERT = 2;
	
$(document).ready(function() 
{
	var action = NO_ACTION;

	$('#nuevo').click(function()
	{
		action = INSERT;
		$("#cajaUsu").addClass("toHide").val("");
		$('#btnFind').addClass('toHide');
		var inputs = $('#usuInput > div > input');
		inputs.val("");
		$("#usuario").addClass("active"); // propia de usuario
		$("#admin").removeClass("active"); // propia de usuario
		usuarioNuevo = undefined; // propia de usuario
		usuarioNuevo = { // propia de usuario
			"nombre": "", 
			"clave": "",
			"rol": ""
		};
		$('#usuInput > div > input').attr('onblur', 'checkInputs(this);');
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
				$.getJSON('/getUsuario?nombre=' + nomUsu, function(usuario)
				{
					if(usuario.error)
					{
						alert('No se pudo encontrar el usuario.\nRevise el nombre.');
					}
					else
					{
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
			var inputs = $("#usuInput > div > input");
			usuarioNuevo.nombre = $(inputs[0]).val();
			usuarioNuevo.clave = $(inputs[1]).val();
			usuarioNuevo.rol = $("#usuInput .active").children().val();

			var cadena = JSON.stringify(usuarioNuevo);
			$.ajax({ method: "POST", url: "/adminUsuario", data: { usuario: cadena, action: action } })
			.fail(function()
			{
				alert("Error en el guardado. (Cli)");
			})
			.done(function(msg)
			{
				alert(msg.toUpperCase());
				refereshTable();
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
		nuevo($("#cajaEjer"), $("#btnFindEjer"), $("#inputEjer > div > input"), $("#formEjer"));
		ejercicioNuevo = undefined;
		ejercicioNuevo = {
			"nombre": "",
			"descripcion": "",
			"imagen": "",
			"tipo": ""
		};
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
				$.getJSON('/adminEjer?nombre=' + nomEjer, function(ejercicio)
				{
					if(ejercicio.error)
					{
						alert('No se pudo encontrar el ejercicio.\nRevise el nombre.');
					}
					else
					{
						$(inputs[0]).val(ejercicio.nombre);
						$(inputs[1]).val(ejercicio.descripcion);
						$(inputs[2]).val(ejercicio.tipo);
						$(inputs[3]).val(ejercicio.imagen);
						$(inputs).prev('span').children('button').removeClass('btn-warning').addClass('btn-success').children('span').removeClass('glyphicon-question-sign').addClass('glyphicon-ok');
						$("#inputRut > div > span > span > input").parent().removeClass("btn-warning").addClass("btn-success");
						$("#cajaEjer").val("").toggle();
						$('#btnFindEjer').toggle();
					}
				});
			}
		});
	});
	
	$("#guardarEjer").click(function(e)
	{
		var datos = null;
		guardar(e, datos);
	});

	$("#nuevoRut").click(function()
	{
		action = INSERT;
		nuevo($("#cajaRut"), $("#btnFindRut"), $("#inputRut > div > input"), $("#formRut"));
		$("#inputRut > div > textarea").attr('onblur', 'checkInputs(this);');
		rutinaNueva = undefined;
		rutinaNueva = {
			"obser": "",
			"orden": "",
			"usuario": "",
			"ejer": "",
			"repe": "",
			"tiempo":""
		};
	});
});

function guardar(e, datos)
{
    e.preventDefault();
    $.ajax(
    {
        type: 'POST',
        url: '/adminEjer',
        data: { img: $('#file').val() },
        success: function(data)
        {
            alert('YUUU');
        }
    });
}
function completeHandler()
{
	alert("yuuuuuu!!");
}
function errorHandler()
{
	alert("pringao!!!");
}

function validateFile()
{
	$(':file').change(function(){
	    var file = this.files[0];
	    var name = file.name;
	    var size = file.size;
	    var type = file.type;
	    //Your validation
	});
}

function nuevo(caja, btnFind, inputs, formulario)
{
	$(caja).addClass("toHide").val("");
	$(btnFind).addClass("toHide");
	inputs.val("");
	inputs.attr('onblur', 'checkInputs(this);');
	$(formulario).removeClass("toHide");
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

function refereshTable()
{
	$("#tablaUsuarios tbody").empty();
	$.getJSON("/admin?tabla=tabla", function(usuarios)
	{
		for (var usuario in usuarios)
		{
			var tr = $("<tr></tr>");
			var nombre = $("<td></td>").text(usuarios[usuario]["nombre"]);
			var clave = $("<td></td>").text(usuarios[usuario]["clave"]);
			var rol = $("<td></td>").text(usuarios[usuario]["rol"]);
			tr.append(nombre, clave, rol);
			$("#tablaUsuarios tbody").append(tr);
		}
	});
	return null;
}