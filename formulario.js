// ============================================
// SOUNDWAVE MAR - FORMULARIO PREMIUM
// REGLA IMPORTANTE:
// LOS 2 BLOQUES DE FECHA SOLO SE VINCULAN SI ERES MAYOR DE 18 AÑOS
// Si eres menor de 18 -> NO se vincula, el bloque 2 queda vacío y bloqueado
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // 1. AGARRAR TODO DEL HTML
  const formulario = document.getElementById("formulario");
  const mensajeGeneral = document.getElementById("mensaje-general");

  // Bloque 1 - Selects
  const diaSel = document.getElementById("diaNacimiento");
  const mesSel = document.getElementById("mesNacimiento");
  const anioSel = document.getElementById("anioNacimiento");
  const edadPreview = document.getElementById("edadPreview");

  // Bloque 2 - Solo +18
  const fechaInput = document.getElementById("fechaNacimiento");
  const edadInput = document.getElementById("edad");

  // Cuenta
  const cuentaInput = document.getElementById("cuentaBancaria");
  const contador = document.getElementById("contadorCuenta");
  const progreso = document.getElementById("progresoCuenta");

  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  meses.forEach((m, i) => {
    const o = document.createElement("option");
    o.value = i + 1;
    o.textContent = m;
    mesSel.appendChild(o);
  });

  // Años: solo hasta hace 18 años, para que ya desde el inicio sea +18
  const anioActual = new Date().getFullYear();
  for (let a = anioActual - 18; a >= 1920; a--) {
    const o = document.createElement("option");
    o.value = a;
    o.textContent = a;
    anioSel.appendChild(o);
  }

  // 2. FECHA Y EDAD
  function llenarDias() {
    const mes = parseInt(mesSel.value);
    const anio = parseInt(anioSel.value) || anioActual;
    const diasEnMes = mes ? new Date(anio, mes, 0).getDate() : 31;
    const actual = diaSel.value;
    diaSel.innerHTML = '<option value="">Día</option>';
    for (let d = 1; d <= diasEnMes; d++) {
      const o = document.createElement("option");
      o.value = d;
      o.textContent = d;
      diaSel.appendChild(o);
    }
    if (actual && actual <= diasEnMes) diaSel.value = actual;
  }
  llenarDias();

  function calcularEdad(yyyy, mm, dd) {
    const hoy = new Date();
    const nac = new Date(yyyy, mm - 1, dd);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }

  // Desvincular: borrar bloque 2 y bloquearlo
  function desvincular() {
    fechaInput.value = "";
    edadInput.value = "";
    fechaInput.classList.add("bloqueado");
    edadInput.classList.add("bloqueado");
    fechaInput.classList.remove("correcto");
    edadInput.classList.remove("correcto");
  }

  // Vincular: llenar bloque 2 solo si eres +18
  function vincularSiEsMayor() {
    // Si no hay fecha completa, no hay nada que vincular
    if (!diaSel.value || !mesSel.value || !anioSel.value) {
      desvincular();
      edadPreview.textContent = "Tu edad se calculará automáticamente • Solo mayores de 18 años";
      return false;
    }

    const dd = String(diaSel.value).padStart(2, '0');
    const mm = String(mesSel.value).padStart(2, '0');
    const yyyy = anioSel.value;
    const edad = calcularEdad(yyyy, mesSel.value, diaSel.value);

    // REGLA: SOLO +18 SE VINCULA
    if (edad < 18) {
      desvincular();
      edadPreview.innerHTML = `Naciste el <b>${dd} de ${meses[mesSel.value-1]} de ${yyyy}</b> • Tienes <b>${edad} años</b> • <b style="color:#ff7b7b">Eres menor de edad, NO se vincula. Solo +18 se vincula.</b>`;
      return false;
    }

    // SI ES +18, SÍ SE VINCULA
    fechaInput.value = `${yyyy}-${mm}-${dd}`;
    edadInput.value = edad + " años";
    fechaInput.classList.remove("bloqueado");
    edadInput.classList.remove("bloqueado");
    edadPreview.innerHTML = `Naciste el <b>${dd} de ${meses[mesSel.value-1]} de ${yyyy}</b> • Tienes <b>${edad} años</b> • <b style="color:#4ade80">✓ Mayor de edad, vinculado</b>`;
    return true;
  }

  function sincronizar() {
    const vinculado = vincularSiEsMayor();
    pintarCampo("fechaNacimiento", true);
    pintarCampo("edad", true);
    return vinculado;
  }

  mesSel.addEventListener("change", () => { llenarDias(); sincronizar(); });
  anioSel.addEventListener("change", () => { llenarDias(); sincronizar(); });
  diaSel.addEventListener("change", sincronizar);

  // El bloque 2 NO se puede editar a mano si eres menor, solo se llena solo si eres +18
  // Si intentas escribirlo, se vuelve a sincronizar y se borra si eres menor
  fechaInput.addEventListener("change", () => { sincronizar(); });
  fechaInput.addEventListener("input", () => { sincronizar(); });

  // 3. CUENTA - 16 DÍGITOS
  function formatearCuenta() {
    let soloNumeros = cuentaInput.value.replace(/\D/g, '').slice(0, 16);
    cuentaInput.dataset.valor = soloNumeros;
    cuentaInput.value = soloNumeros.replace(/(\d{4})(?=\d)/g, '$1 ');
    const total = soloNumeros.length;
    contador.textContent = `${total} / 16`;
    progreso.style.width = (total / 16 * 100) + '%';
    contador.classList.toggle('completo', total === 16);
    progreso.classList.toggle('completo', total === 16);
  }
  cuentaInput.addEventListener('input', () => { formatearCuenta(); pintarCampo('cuentaBancaria', true); });

  // 4. VALIDACIONES
  const campos = [
    { id: "nombre", etiqueta: "Nombre" },
    { id: "apellidoPaterno", etiqueta: "Apellido paterno" },
    { id: "apellidoMaterno", etiqueta: "Apellido materno" },
    { id: "email", etiqueta: "Email" },
    { id: "fechaNacimiento", etiqueta: "Fecha de nacimiento" },
    { id: "edad", etiqueta: "Edad" },
    { id: "cuentaBancaria", etiqueta: "Número de cuenta bancaria" }
  ];

  const regexNombre = /^[A-ZÁÉÍÓÚÑÜ ]+$/;

  function validarCampo(id, valor) {
    const texto = (valor || "").trim();
    if (texto === "") return { valido: false, mensaje: "Este campo es obligatorio *" };

    if (id === "nombre" || id === "apellidoPaterno" || id === "apellidoMaterno") {
      if (!regexNombre.test(valor)) return { valido: false, mensaje: "Solo letras y espacios" };
      if (valor !== texto) return { valido: false, mensaje: "Sin espacios al inicio o al final" };
      return { valido: true, mensaje: "" };
    }

    if (id === "email") {
      if (/\s/.test(valor)) return { valido: false, mensaje: "Email incorrecto: sin espacios" };
      if (!/^[^\s@]+@[^\s@]+\.com$/.test(valor)) return { valido: false, mensaje: "Email incorrecto: debe tener @ y terminar en .com" };
      return { valido: true, mensaje: "" };
    }

    if (id === "fechaNacimiento") {
      if (!diaSel.value || !mesSel.value || !anioSel.value) return { valido: false, mensaje: "Elige día, mes y año" };
      const fecha = new Date(texto);
      const hoy = new Date();
      if (isNaN(fecha.getTime())) return { valido: false, mensaje: "Elige una fecha válida" };
      if (fecha > hoy) return { valido: false, mensaje: "La fecha no puede ser futura" };
      const edad = calcularEdad(anioSel.value, mesSel.value, diaSel.value);
      // SOLO +18 SE PUEDE VINCULAR Y VALIDAR
      if (edad < 18) return { valido: false, mensaje: `Solo se vincula para mayores de 18. Tienes ${edad} años` };
      const fechaDeSelects = `${anioSel.value}-${String(mesSel.value).padStart(2,'0')}-${String(diaSel.value).padStart(2,'0')}`;
      if (texto !== fechaDeSelects) return { valido: false, mensaje: "Las 2 fechas deben coincidir y ser +18" };
      return { valido: true, mensaje: "" };
    }

    if (id === "edad") {
      const edadNum = parseInt(valor);
      if (isNaN(edadNum)) return { valido: false, mensaje: "Solo se vincula para mayores de 18 años" };
      if (edadNum < 18) return { valido: false, mensaje: `Solo se vincula para mayores de 18. Tienes ${edadNum} años` };
      return { valido: true, mensaje: "" };
    }

    if (id === "cuentaBancaria") {
      const soloNumeros = (cuentaInput.dataset.valor || valor.replace(/\D/g, ''));
      if (!/^\d+$/.test(soloNumeros)) return { valido: false, mensaje: "Solo números" };
      if (soloNumeros.length < 16) return { valido: false, mensaje: `Te faltan ${16 - soloNumeros.length} dígitos, deben ser 16 exactos` };
      if (!/^\d{16}$/.test(soloNumeros)) return { valido: false, mensaje: "Deben ser exactamente 16 dígitos" };
      return { valido: true, mensaje: "" };
    }

    return { valido: true, mensaje: "" };
  }

  // 5. PINTAR - VERDE / ROJO
  function pintarCampo(id, mostrarMensaje = true) {
    let input = document.getElementById(id);
    const errorEl = document.getElementById("error-" + id);
    if (!input || !errorEl) return { valido: false, mensaje: "" };
    const resultado = validarCampo(id, input.value);

    if (id === "fechaNacimiento") {
      [diaSel, mesSel, anioSel].forEach(s => {
        s.classList.remove("correcto", "incorrecto");
        if (input.value === "") { if (mostrarMensaje) s.classList.add("incorrecto"); }
        else if (resultado.valido) s.classList.add("correcto");
        else if (mostrarMensaje) s.classList.add("incorrecto");
      });
      input.classList.remove("correcto", "incorrecto");
      if (resultado.valido) input.classList.add("correcto");
      else if (mostrarMensaje && input.value !== "") input.classList.add("incorrecto");
      errorEl.textContent = resultado.valido ? "" : resultado.mensaje;
      errorEl.classList.toggle("visible", !resultado.valido && mostrarMensaje);
      return resultado;
    }

    if (id === "edad") {
      input.classList.remove("correcto", "incorrecto");
      if (input.value === "") {
        if (mostrarMensaje) { input.classList.add("incorrecto"); errorEl.textContent = resultado.mensaje; errorEl.classList.add("visible"); }
        return resultado;
      }
      if (resultado.valido) { input.classList.add("correcto"); errorEl.textContent = ""; errorEl.classList.remove("visible"); }
      else { input.classList.add("incorrecto"); if (mostrarMensaje) { errorEl.textContent = resultado.mensaje; errorEl.classList.add("visible"); } }
      return resultado;
    }

    input.classList.remove("correcto", "incorrecto");
    const valorReal = id === "cuentaBancaria" ? (input.dataset.valor || "") : input.value;
    if (valorReal === "") {
      if (mostrarMensaje) { input.classList.add("incorrecto"); errorEl.textContent = resultado.mensaje; errorEl.classList.add("visible"); }
      else { errorEl.textContent = ""; errorEl.classList.remove("visible"); }
      return resultado;
    }
    if (resultado.valido) { input.classList.add("correcto"); errorEl.textContent = ""; errorEl.classList.remove("visible"); }
    else { input.classList.add("incorrecto"); if (mostrarMensaje) { errorEl.textContent = resultado.mensaje; errorEl.classList.add("visible"); } }
    return resultado;
  }

  campos.forEach(c => {
    if (c.id === "fechaNacimiento" || c.id === "cuentaBancaria" || c.id === "edad") return;
    const input = document.getElementById(c.id);
    if (!input) return;
    input.addEventListener("input", () => {
      if (input.value === "") {
        input.classList.remove("correcto", "incorrecto");
        const e = document.getElementById("error-" + c.id);
        e.textContent = ""; e.classList.remove("visible");
        return;
      }
      pintarCampo(c.id, true);
    });
    input.addEventListener("blur", () => pintarCampo(c.id, true));
  });

  // 6. ENVIAR
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    formatearCuenta();
    sincronizar();

    let todo = true;
    let errores = [];
    campos.forEach(c => {
      const r = pintarCampo(c.id, true);
      if (!r.valido) { todo = false; errores.push(c.etiqueta + ": " + r.mensaje); }
    });

    mensajeGeneral.className = "mensaje-general";
    if (todo) {
      mensajeGeneral.innerHTML = "✓ VALIDACIÓN EXITOSA<br>¡Bienvenidos a Premium!";
      mensajeGeneral.classList.add("exito");
    } else {
      mensajeGeneral.innerHTML = "Hay datos por corregir, revisa los campos marcados<br>" + errores.join("<br>");
      mensajeGeneral.classList.add("error");
    }
  });

});