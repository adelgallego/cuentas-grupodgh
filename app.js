(() => {
  const STORAGE_KEY = 'cuenta-clara-v1';
  const CHATURBATE_CREDENTIALS_KEY = 'grupodgh-chaturbate-credentials-v1';
  const CHATURBATE_WORKER_KEY = 'grupodgh-chaturbate-worker-url-v1';
  const STRIPCHAT_STUDIO_KEY = 'grupodgh-stripchat-studio-credentials-v1';
  const STRIPCHAT_MODELS_KEY = 'grupodgh-stripchat-model-credentials-v1';
  const STRIPCHAT_WORKER_KEY = 'grupodgh-stripchat-worker-url-v1';
  const CLOUD_CONFIG_KEY = 'grupodgh-cloud-config-v1';
  const CLOUD_SESSION_KEY = 'grupodgh-cloud-session-v1';
  const THEME_KEY = 'cuenta-clara-theme';
  const TIFFANY_SHARE_MIGRATION_KEY = 'grupodgh-tiffany-share-80-v1';
  const TWL_OWNER_FEE_RATE = 0.10;
  const USDT_STRIPCHAT_FEE_RATE = 0.01;
  const USDT_STRIPCHAT_MODEL_SHARE = 80;
  const BANTOKENS_WEEKLY_FEE_USD = 11.88;
  const TRM_RATE_URL = './data/bantokens-trm.json';
  const ACCENT_KEY = 'grupodgh-accent-color';
  const TEXT_SIZE_KEY = 'grupodgh-text-size';
  let appLanguage = 'es';
  try { appLanguage = localStorage.getItem('grupodgh-language') === 'en' ? 'en' : 'es'; } catch { /* Keep Spanish when browser storage is unavailable. */ }
  const translationPairs = [
    ['GRUPODGH — ingresos por tokens', 'GRUPODGH — token income'], ['GRUPODGH, inicio', 'GRUPODGH, home'], ['Navegación principal', 'Main navigation'], ['Administración', 'Administration'], ['ADMINISTRACIÓN', 'ADMINISTRATION'], ['Resumen', 'Overview'], ['Registrar ingresos', 'Record income'], ['Modelos', 'Models'], ['Equipo', 'Team'], ['TU EQUIPO', 'YOUR TEAM'], ['Administra tus modelos, porcentajes y sincronizaciones.', 'Manage your models, shares, and sync connections.'], ['Modelos registradas', 'Registered models'], ['Gestiona perfiles, porcentajes y accesos sincronizados.', 'Manage profiles, shares, and synced accounts.'],
    ['Nube y sincronización', 'Cloud and sync'], ['Inicia sesión en la nube para mantener tus cambios sincronizados entre dispositivos.', 'Sign in to the cloud to keep your changes synced across devices.'], ['Administrador', 'Administrator'], ['Estado de la cuenta', 'Account status'], ['Sin conectar', 'Not connected'],
    ['Ajustar tamaño de letra', 'Adjust text size'], ['Tamaño de letra', 'Text size'], ['Amplía los textos y controles de la app.', 'Enlarge the app text and controls.'], ['Restablecer', 'Reset'], ['Personalizar color principal', 'Customize accent color'], ['Activar modo oscuro', 'Enable dark mode'], ['Desactivar modo oscuro', 'Disable dark mode'],
    ['TU NEGOCIO, EN ORDEN', 'YOUR BUSINESS, ORGANIZED'], ['Resumen de ingresos', 'Income overview'], ['Controla tokens, conversiones y repartos en un solo lugar.', 'Track tokens, conversions, and payouts in one place.'], ['Tasas de conversión', 'Conversion rates'], ['USD que recibes por cada token', 'USD received per token'], ['Información sobre la tasa BANTOKENS', 'About the BANTOKENS rate'], ['La tasa usa la TRM de Wilkinsonpc menos $50 COP por USD.', 'The rate uses Wilkinsonpc’s TRM minus COP 50 per USD.'],
    ['Esta tasa actualiza los ingresos BANTOKENS de la semana actual. Las semanas anteriores conservan su tasa.', 'This rate updates BANTOKENS income for the current week. Previous weeks keep their rate.'], ['Esta tasa actualiza los ingresos TWL de la semana actual. Las semanas anteriores conservan su tasa.', 'This rate updates TWL income for the current week. Previous weeks keep their rate.'], ['Esta tasa actualiza los ingresos USDT de la semana actual. Las semanas anteriores conservan su tasa.', 'This rate updates USDT income for the current week. Previous weeks keep their rate.'], ['● Guardado', '● Saved'],
    ['Respaldo y transferencia de datos', 'Data backup and transfer'], ['Respaldo de datos', 'Data backup'], ['Transfiere modelos, ingresos y tasas entre la app local y la versión web.', 'Transfer models, income, and rates between the local app and web version.'], ['Descargar respaldo', 'Download backup'], ['Importar respaldo', 'Import backup'], ['Resumen de ingresos', 'Income summary'], ['INGRESOS REGISTRADOS', 'RECORDED INCOME'], ['tokens', 'tokens'], ['En la semana seleccionada', 'For the selected week'], ['VALOR TOTAL', 'TOTAL VALUE'], ['PARA LAS MODELOS', 'MODEL PAYOUTS'], ['TU PARTE NETA', 'YOUR NET SHARE'], ['Descuentos', 'Deductions'], ['semanal', 'weekly'],
    ['Liquidación semanal por modelo', 'Weekly payout by model'], ['Semana actual · lunes a domingo', 'Current week · Monday to Sunday'], ['Consultar semana', 'Select week'], ['MODELO', 'MODEL'], ['PÁGINA', 'PLATFORM'], ['MONETIZADORA', 'PROVIDER'], ['TOKENS EN LA SEMANA', 'WEEKLY TOKENS'], ['MODELO · USD', 'MODEL · USD'], ['MODELO · COP', 'MODEL · COP'], ['RETENCIÓN MONETIZADORA · USD / COP', 'PROVIDER DEDUCTION · USD / COP'], ['TU NETO · USD', 'YOUR NET · USD'], ['TU NETO · COP', 'YOUR NET · COP'], ['Aún no hay ingresos esta semana', 'No income recorded this week yet'], ['Al registrar lecturas, aquí verás el pago por modelo, página y monetizadora.', 'Once you record readings, payouts by model, platform, and provider will appear here.'],
    ['Histórico semanal', 'Weekly history'], ['Cada semana se conserva por separado; el total reúne todo el historial.', 'Each week is kept separate; the total combines the full history.'], ['SEMANA', 'WEEK'], ['TOKENS', 'TOKENS'], ['TOTAL · USD', 'TOTAL · USD'], ['Aún no hay semanas registradas', 'No weeks recorded yet'], ['Al ingresar ingresos, cada semana aparecerá aquí y se sumará al acumulado histórico.', 'Each week will appear here as you record income and will be added to the historical total.'],
    ['Ingresos recientes', 'Recent income'], ['Detalle de los registros por modelo', 'Income entries by model'], ['Filtrar página', 'Filter by platform'], ['Todas las páginas', 'All platforms'], ['Filtrar monetizadora', 'Filter by provider'], ['Todas las monetizadoras', 'All providers'], ['Filtrar modelo', 'Filter by model'], ['Todas las modelos', 'All models'], ['Filtrar periodo', 'Filter by period'], ['Semana seleccionada', 'Selected week'], ['Todo el tiempo', 'All time'], ['Este mes', 'This month'], ['Últimos 7 días', 'Last 7 days'], ['FECHA', 'DATE'], ['TOKENS DEL DÍA', 'DAILY TOKENS'], ['ACUMULADO SEMANAL', 'WEEKLY TOTAL'], ['VALOR USD', 'VALUE · USD'], ['MODELO · USD / COP', 'MODEL · USD / COP'], ['RETENCIÓN MONETIZADORA · USD / COP', 'PROVIDER DEDUCTION · USD / COP'], ['TU NETO · USD / COP', 'YOUR NET · USD / COP'], ['Aún no hay ingresos', 'No income recorded yet'], ['Registra el acumulado semanal para calcular los tokens de cada día.', 'Enter the weekly total to calculate tokens earned each day.'], ['Registrar ingreso', 'Record income'], ['Gestionar', 'Manage'], ['Modelos registradas', 'Registered models'], ['Agrega tus modelos para comenzar.', 'Add models to get started.'], ['Agregar modelo', 'Add model'],
    ['NUEVO MOVIMIENTO', 'NEW ENTRY'], ['Ingresa los tokens ganados por una modelo.', 'Enter the tokens earned by a model.'], ['Página', 'Platform'], ['Monetizadora', 'Provider'], ['Modelo', 'Model'], ['Selecciona un modelo', 'Select a model'], ['Fecha', 'Date'], ['Tokens acumulados en la semana', 'Weekly accumulated tokens'], ['Escribe el acumulado que muestra la página. Se resta la lectura anterior de esta modelo y página (semana de lunes a domingo).', 'Enter the total shown on the platform. The previous reading for this model and platform (Monday through Sunday) is subtracted.'], ['Configura las tasas de conversión para ver el cálculo estimado.', 'Set conversion rates to see the estimated calculation.'], ['Guardar ingreso', 'Save income'], ['Cancelar edición', 'Cancel editing'], ['EQUIPO', 'TEAM'], ['Agrega cada modelo una vez y define su porcentaje para cada página.', 'Add each model once and set its share for each platform.'], ['Nombre de la modelo', 'Model name'], ['Stripchat · COP menos/USD', 'Stripchat · COP deduction/USD'], ['Chaturbate · COP menos/USD', 'Chaturbate · COP deduction/USD'], ['La misma modelo estará disponible en ambas páginas. El registro usa los porcentajes y el descuento de la página elegida.', 'The model will be available on both platforms. Each entry uses the share and deduction set for the selected platform.'], ['Cancelar', 'Cancel'], ['Los valores son estimados según las tasas que configures.', 'Values are estimates based on the rates you set.'], ['Confirmar importación', 'Confirm import'], ['Esto reemplazará los datos guardados en esta versión de la app.', 'This will replace the data stored in this version of the app.'], ['Importar y aplicar', 'Import and apply'],
    ['Guardar cambios', 'Save changes'], ['Editar modelo', 'Edit model'], ['Eliminar modelo', 'Delete model'], ['Editar ingreso', 'Edit income'], ['Eliminar ingreso', 'Delete income'], ['Tiene ingresos registrados', 'Has recorded income'], ['No se puede eliminar porque tiene ingresos registrados', 'Cannot delete because this model has recorded income'], ['· con movimientos', '· has entries'], ['Todas', 'All'], ['Configura las tasas', 'Set the rates'], ['Configura la tasa COP/USD', 'Set the COP/USD rate'], ['Configura la tasa COP/USD de esta monetizadora', 'Set this provider’s COP/USD rate'], ['Detalle', 'Details'], ['Ver semana →', 'View week →'], ['· actual', '· current'], ['ACUMULADO HISTÓRICO', 'HISTORICAL TOTAL'], ['TOTAL SEMANAL', 'WEEKLY TOTAL'], ['Primera lectura de esta modelo y página en la semana: el acumulado completo se contará como tokens del día.', 'First reading for this model and platform this week: the full total will count as today’s tokens.'], ['Tokens registrados antes', 'Previously recorded tokens'], ['Última lectura', 'Previous reading'], ['Actualizando ingreso.', 'Updating income.'], ['Tokens del día estimados:', 'Estimated tokens today:'], ['Acumulado semanal:', 'Weekly total:'], ['· Acumulado:', '· Weekly total:'], ['Configura las tasas para calcular el dinero.', 'Set the rates to calculate the payout.'], ['Total del día:', 'Daily total:'], ['Modelo (', 'Model ('], [' · paga ', ' · payout '], ['Tu parte neta:', 'Your net share:'], ['BANTOKENS descuenta ', 'BANTOKENS deducts '], [' de la deducción semanal de ', ' from the weekly deduction of '], [' de Tiffany; los ', ' for Tiffany; the remaining '], [' restantes se reparten según el porcentaje de ella.', ' is split according to her share.'], ['TWL retiene ', 'TWL withholds '], [' del total.', ' from the total.'], ['USDT descuenta primero ', 'USDT deducts '], [' (1%); los ', ' (1%) first; the remaining '], [' restantes se reparten ', ' is split '], [' para ella y ', ' to her and '], [' para ti.', ' to you.'], ['Los ', 'The '], ['tokens del día', 'tokens today'],
    ['Histórico completo', 'Full history'], ['Desde el inicio del mes', 'Since the start of this month'], ['Lunes a domingo', 'Monday through Sunday'], ['· TWL retiene 10% del total y luego se calcula tu restante.', '· TWL withholds 10% of the total before your share is calculated.'], ['Tasa editada manualmente; se sincroniza desde la TRM al abrir la versión web.', 'Rate edited manually; it syncs from the TRM when the web app opens.'], ['TRM ', 'TRM '], ['Usando la última tasa guardada; no se pudo actualizar la TRM.', 'Using the last saved rate; the TRM could not be updated.'], ['TRM − $50 · se actualizará en la versión web.', 'TRM − COP 50 · will update in the web version.'], ['Editar', 'Edit'], ['BANTOKENS · $11,88/sem por modelo', 'BANTOKENS · $11.88/wk per model'], ['Modelo actualizada. Los ingresos anteriores conservan sus valores.', 'Model updated. Previous income entries keep their saved values.'], ['Modelo agregada.', 'Model added.'], ['Ingreso eliminado.', 'Income entry deleted.'],
    ['Escribe el nombre de la modelo.', 'Enter the model name.'], ['Usa porcentajes entre 0 y 100 para ambas páginas.', 'Enter percentages from 0 to 100 for both platforms.'], ['Los descuentos en pesos deben ser números iguales o mayores a cero.', 'Deductions in pesos must be numbers greater than or equal to zero.'], ['Cada descuento debe ser menor que las tasas COP/USD configuradas.', 'Each deduction must be lower than the configured COP/USD rates.'], ['No se encontró la modelo para editar.', 'Could not find the model to edit.'], ['Modelo actualizada.', 'Model updated.'], ['Modelo agregada.', 'Model added.'], ['Selecciona una modelo e ingresa el acumulado semanal de tokens.', 'Select a model and enter its weekly token total.'], ['No se encontró el ingreso que estabas editando.', 'Could not find the income entry you were editing.'], ['Configura las tasas de conversión para esta página y monetizadora antes de registrar ingresos.', 'Set conversion rates for this platform and provider before recording income.'], ['Ya existe una lectura para esa modelo, página y fecha. Edita ese registro para evitar duplicados.', 'A reading already exists for this model, platform, and date. Edit that entry to avoid duplicates.'], ['El acumulado no puede ser menor que la última lectura de esta semana (', 'The total cannot be lower than this week’s previous reading ('], [' tokens).', ' tokens).'], ['El acumulado supera la lectura posterior del ', 'The total exceeds the later reading on '], ['Esta modelo no tiene un porcentaje configurado. Agrégala de nuevo con página y porcentaje.', 'This model has no share configured. Add it again with a platform and share.'], ['El descuento por dólar debe ser menor que la tasa COP/USD de esta monetizadora.', 'The deduction per dollar must be lower than this provider’s COP/USD rate.'], ['Ingreso actualizado', 'Income updated'], ['Ingreso guardado', 'Income saved'], [': ', ': '], [' tokens del día.', ' tokens today.'], ['No se puede eliminar una modelo con ingresos registrados.', 'Cannot delete a model with recorded income.'], ['No se encontró la modelo de este ingreso.', 'Could not find the model for this income entry.'], ['Modelo eliminada.', 'Model deleted.'], ['Respaldo descargado.', 'Backup downloaded.'], ['Ese archivo no es un respaldo válido de GRUPODGH.', 'That file is not a valid GRUPODGH backup.'], ['Archivo: ', 'File: '], ['. Se importarán ', '. The import will include '], [' modelos, ', ' models, '], [' ingresos y sus tasas.', ' income entries and their rates.'], ['No se pudo importar. Revisa que el archivo sea un respaldo válido.', 'Could not import. Check that the file is a valid backup.'], ['Respaldo importado. Recargando la app…', 'Backup imported. Reloading the app…'], ['Anterior', 'Legacy'], ['$11,88 semanal', '$11.88 weekly'], ['lunes', 'Monday'], ['martes', 'Tuesday'], ['miércoles', 'Wednesday'], ['jueves', 'Thursday'], ['viernes', 'Friday'], ['sábado', 'Saturday'], ['domingo', 'Sunday'], ['enero', 'January'], ['febrero', 'February'], ['marzo', 'March'], ['abril', 'April'], ['mayo', 'May'], ['junio', 'June'], ['julio', 'July'], ['agosto', 'August'], ['septiembre', 'September'], ['octubre', 'October'], ['noviembre', 'November'], ['diciembre', 'December'], ['No se pudo guardar el respaldo en este navegador.', 'Could not save the backup in this browser.'], ['Ej. 3.147', 'e.g. 3,147'], ['Ej. 25000', 'e.g. 25,000'], ['Ej. 100', 'e.g. 100'], ['Ej. 150', 'e.g. 150'], ['0,05', '0.05']
  ];
  translationPairs.push(['Información sobre descuentos', 'Deduction details'], ['BANTOKENS · $11,88/sem de la modelo', 'BANTOKENS · $11.88/wk deducted from the model'], [' de la parte que le corresponde a la modelo tras aplicar su porcentaje (', ' from the model share after applying her percentage ('], ['descontado de la parte de cada modelo', 'deducted from each model share']);
  translationPairs.push(['Si la app se cierra, las ganancias desde la última lectura se sumarán al próximo día que se sincronice.', 'If the app closes, earnings since the last reading will be added to the next synced day.'], ['Despliega ', 'Deploy '], ['. Si la app se cierra, las ganancias desde la última lectura se sumarán al próximo día sincronizado; si atraviesa el reinicio del lunes, ese saldo semanal perdido no se puede recuperar desde la API.', '. If the app closes, earnings since the last reading will be added to the next synced day; if the Monday reset passes, that lost weekly balance cannot be recovered from the API.'], ['Sincronización de Chaturbate', 'Chaturbate sync'], ['Consulta el saldo semanal de cada cuenta y guarda una lectura diaria mientras la app esté abierta.', 'Checks each account’s weekly balance and saves a daily reading while the app is open.'], ['Sin configurar', 'Not configured'], ['El contador de Chaturbate se reinicia los lunes a las 00:00. La app consulta cada 5 minutos. Configura un proxy propio de Cloudflare Worker y las credenciales API de cada modelo. Las credenciales se guardan en este navegador y, al iniciar sesión, también se sincronizan con tu cuenta de nube. No se incluyen en respaldos.', 'Chaturbate’s counter resets Mondays at 00:00. The app checks every 5 minutes. Set up your own Cloudflare Worker proxy and each model’s API credentials. Credentials are stored in this browser and sync to your cloud account after you sign in. They are not included in backups.'], ['URL de tu Worker', 'Your Worker URL'], ['Selecciona un modelo', 'Select a model'], ['Usuario de Chaturbate', 'Chaturbate username'], ['API Auth Token', 'API Auth Token'], ['Monetizadora', 'Provider'], ['Guardar conexión', 'Save connection'], ['Sincronizar ahora', 'Sync now'], ['Desconectar modelo', 'Disconnect model'], ['Conectada', 'Connected'], ['Sincronizado', 'Synced'], ['Error de sincronización', 'Sync error'], ['Faltan las tasas USD/token o COP/USD para ', 'USD/token or COP/USD rates are missing for '], ['No hay una conexión guardada para esta modelo.', 'There is no saved connection for this model.'], ['El Worker debe usar una URL HTTPS terminada en /stats.', 'The Worker URL must use HTTPS and end in /stats.'], ['La API no devolvió token_balance válido.', 'The API did not return a valid token_balance.'], ['Conexión eliminada de este navegador.', 'Connection removed from this browser.'], ['Sincronización automática activa · cada 5 min', 'Automatic sync active · every 5 min'], ['La app debe estar abierta para registrar lecturas.', 'The app must stay open to record readings.']);  translationPairs.push(['Sincronización de Stripchat', 'Stripchat sync'], ['Consulta las ganancias semanales de las modelos de tu Studio y guarda lecturas diarias.', 'Checks your Studio models’ weekly earnings and saves daily readings.'], ['La API de Studio requiere una clave creada por Stripchat y que cada modelo pertenezca a tu Studio. La clave se guarda en este navegador y, al iniciar sesión, también se sincroniza con tu cuenta de nube; se envía por HTTPS a tu Worker y no se incluye en respaldos. La app consulta cada 5 minutos mientras está abierta.', 'The Studio API requires a key issued by Stripchat and each model to belong to your Studio. The key is stored in this browser and syncs to your cloud account after you sign in; it is sent over HTTPS to your Worker and is not included in backups. The app checks every 5 minutes while open.'], ['Usuario de Studio', 'Studio username'], ['Modelo', 'Model'], ['Usuario de la modelo en Stripchat', 'Model username on Stripchat'], ['API-Key de Studio', 'Studio API key'], ['Guardar conexión', 'Save connection'], ['Sincronizar ahora', 'Sync now'], ['Desconectar modelo', 'Disconnect model'], ['Borrar clave del Studio', 'Clear Studio key'], ['Crea o consulta la API-Key en ', 'Create or view the API key at '], ['Stripchat Studio', 'Stripchat Studio'], ['. El Worker también debe actualizarse para habilitar la ruta ', '. The Worker also needs an update to enable the route '], ['. El Worker también debe actualizarse para habilitar la ruta ', '. The Worker also needs an update to enable the route '], ['. Necesitas una URL HTTPS terminada en /stripchat/stats.', '. You need an HTTPS URL ending in /stripchat/stats.'], ['La API-Key y el usuario de Studio son obligatorios.', 'The Studio API key and Studio username are required.'], ['Configura el rango USD/token o COP/USD para ', 'Set the USD/token or COP/USD rate for '], ['Conexión de Stripchat guardada en este navegador.', 'Stripchat connection saved in this browser.'], ['Conexión de Stripchat eliminada para esta modelo.', 'Stripchat connection removed for this model.'], ['Clave de Studio eliminada de este navegador.', 'Studio key removed from this browser.'], ['No hay modelos de Stripchat conectadas.', 'No Stripchat models are connected.'], ['Stripchat sincronizado ', 'Stripchat synced '], ['Error de sincronización de Stripchat · ', 'Stripchat sync error · '], ['Modelo de Stripchat no encontrada.', 'Stripchat model not found.'], ['La API no devolvió totalEarnings válido.', 'The API did not return a valid totalEarnings value.']);  translationPairs.push(['Sincronizar esta modelo automáticamente', 'Automatically sync this model'], ['Sincronizada', 'Synced'], ['No sincronizada', 'Not synced'], ['Sincronizar modelos conectadas', 'Sync connected models'], ['La API requiere una clave de Studio y que cada modelo pertenezca al Studio indicado. Usuario de Stripchat, usuario de Studio y API-Key se guardan en este navegador y, al iniciar sesión, también se sincronizan con tu cuenta de nube. Se envían por HTTPS y no se incluyen en respaldos. La app consulta cada 5 minutos mientras está abierta.', 'The API requires a Studio key and each model to belong to the specified Studio. Stripchat username, Studio username, and API key are stored in this browser and sync to your cloud account after you sign in. They are sent over HTTPS and are not included in backups. The app checks every 5 minutes while open.'], ['Configura la conexión de cada modelo al agregarla o editarla. Crea o consulta la API-Key en ', 'Configure each model’s connection when adding or editing it. Create or view the API key at '], ['Completa el usuario de Stripchat, usuario de Studio y API-Key para activar la sincronización.', 'Enter the Stripchat username, Studio username, and API key to enable syncing.'], ['Falta usuario o API-Key del Studio.', 'Studio username or API key is missing.'], ['Deja en blanco para conservar la clave guardada', 'Leave blank to keep the saved key']);  translationPairs.push(['Pendiente', 'Pending'], ['Error', 'Error']);  translationPairs.push(['Actívala solo si tienes acceso al Studio de esta modelo. Si pertenece a otro Studio y no tienes su API-Key, deja la sincronización desactivada.', 'Enable it only if you have access to this model’s Studio. If she belongs to another Studio and you do not have its API key, leave syncing disabled.'], ['. El Worker debe tener habilitada la ruta ', '. The Worker must have the route enabled '], ['Consulta las ganancias semanales de los modelos en los Studios configurados y guarda lecturas diarias.', 'Checks weekly earnings for models in the configured Studios and saves daily readings.']);  translationPairs.push(['La conexión se guarda en este dispositivo y, al iniciar sesión, también en la nube. Configura un Worker de Cloudflare para habilitar la sincronización automática.', 'The connection is saved on this device and in the cloud after you sign in. Configure a Cloudflare Worker to enable automatic syncing.'], ['Completa la URL del Worker, el usuario y el API Auth Token de Chaturbate.', 'Enter the Worker URL, username, and Chaturbate API Auth Token.'], ['Completa la URL del Worker, el usuario, el Studio y el API-Key de Stripchat.', 'Enter the Worker URL, username, Studio, and Stripchat API key.']);  translationPairs.push(['El contador se reinicia los lunes a las 00:00; la app consulta cada 5 minutos mientras está abierta. Las credenciales se guardan en este dispositivo y en la nube al iniciar sesión; no se incluyen en los respaldos. Configura un Worker de Cloudflare.', 'The counter resets Mondays at 00:00; the app checks every 5 minutes while open. Credentials are stored on this device and in the cloud after you sign in; they are not included in backups. Configure a Cloudflare Worker.'], ['La API-Key se guarda en este dispositivo y en la nube al iniciar sesión, se envía por HTTPS y no se incluye en los respaldos. Crea o consulta tu clave en ', 'The API key is stored on this device and in the cloud after you sign in, sent over HTTPS, and not included in backups. Create or view your key at ']);  translationPairs.push(['El saldo semanal de Stripchat se reinicia cada lunes a las 00:00 UTC.', 'Stripchat’s weekly balance resets every Monday at 00:00 UTC.']);
  translationPairs.push(['Ajustes', 'Settings'], ['PREFERENCIAS', 'PREFERENCES'], ['Administra tasas, almacenamiento, respaldos y apariencia de la aplicación.', 'Manage rates, cloud storage, backups, and app appearance.'], ['Apariencia', 'Appearance'], ['Personaliza cómo se ve la aplicación en este dispositivo.', 'Customize how the app looks on this device.'], ['Tema', 'Theme'], ['Cambia entre modo claro y oscuro.', 'Switch between light and dark mode.'], ['Color principal', 'Accent color'], ['Elige el color de los controles y acentos.', 'Choose the color used for controls and accents.']);
  translationPairs.push(['Semana actual', 'Current week'], ['Lunes 00:00 UTC – domingo 23:59 UTC', 'Monday 00:00 UTC – Sunday 23:59 UTC'], ['Escribe el acumulado que muestra la página. La app resta la lectura anterior de esta página.', 'Enter the total shown on the platform. The app subtracts the previous reading for this platform.']);
  translationPairs.push(['Stripchat: lunes 00:00 UTC · Chaturbate: lunes 00:00 hora local', 'Stripchat: Monday 00:00 UTC · Chaturbate: Monday 00:00 local time']);
  const compileTranslations = (pairs) => {
    const values = new Map(pairs);
    const alternatives = [...values.keys()]
      .sort((a, b) => b.length - a.length)
      .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return { values, pattern: new RegExp(alternatives.join('|'), 'g') };
  };
  translationPairs.push(['Almacenamiento en la nube', 'Cloud storage'], ['Configura Supabase para sincronizar tus datos entre dispositivos.', 'Set up Supabase to sync your data across devices.'], ['Configurar Supabase en este dispositivo', 'Configure Supabase on this device'], ['URL del proyecto', 'Project URL'], ['Publishable key', 'Publishable key'], ['Correo electrónico', 'Email address'], ['Contraseña', 'Password'], ['Iniciar sesión', 'Sign in'], ['Crear cuenta', 'Create account'], ['Cerrar sesión', 'Sign out'], ['Continuar con GitHub', 'Continue with GitHub'], ['GitHub debe habilitarse como proveedor en Supabase antes de usar esta opción.', 'GitHub must be enabled as a provider in Supabase before using this option.'], ['Recargar desde la nube', 'Reload from cloud'], ['Subir datos de este dispositivo', 'Upload this device’s data'], ['Preparando conexión a la nube…', 'Connecting to cloud…'], ['Sesión iniciada como ', 'Signed in as '], [' · Sincronizado ', ' · Synced '], ['No se pudo conectar con la nube: ', 'Could not connect to cloud: '], ['Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.', 'Account created. Check your email to confirm, then sign in.'], ['Sesión cerrada. Los datos de este dispositivo siguen disponibles.', 'Signed out. This device’s data remains available.'], ['Hay cambios más recientes en la nube. Recarga la nube o sube explícitamente los datos de este dispositivo.', 'There are newer cloud changes. Reload from cloud or explicitly upload this device’s data.'], ['No se encontró una configuración para la nube. Primero conecta Supabase.', 'Cloud is not configured. Connect Supabase first.'], ['La sesión expiró. Inicia sesión nuevamente.', 'Your session expired. Please sign in again.'], ['Sin conectar', 'Not connected'], ['Ingresa tu correo y contraseña.', 'Enter your email and password.'], ['La cuenta debe confirmarse por correo antes de iniciar sesión.', 'Confirm your account by email before signing in.'], ['Inicia sesión con GitHub desde la versión web publicada por HTTPS.', 'Sign in with GitHub from the published HTTPS app.'], ['La redirección de GitHub no incluyó un código de autorización.', 'The GitHub redirect did not include an authorization code.'], ['Esa cuenta de GRUPODGH aún no existe. Pulsa Crear cuenta o usa Continuar con GitHub.', 'That GRUPODGH account does not exist yet. Click Create account or use Continue with GitHub.']);
  translationPairs.push(['● Pendiente de nube', '● Cloud pending'], ['● Nube sincronizada', '● Cloud synced'], ['● Conflicto nube', '● Cloud conflict'], ['● Error en nube', '● Cloud error']);
  translationPairs.push(['La semana nueva se muestra el lunes a las 00:00 hora local', 'The new week is shown at 12:00 a.m. local time on Monday']);
  const translations = {
    en: compileTranslations(translationPairs),
    es: compileTranslations(translationPairs.map(([spanish, english]) => [english, spanish])),
  };
  const translateValue = (value) => {
    let result = String(value);
    if (appLanguage === 'en') result = result.replace(/Ya existe (.+) en el equipo\./g, 'The team already has $1.');
    else result = result.replace(/The team already has (.+)\./g, 'Ya existe $1 en el equipo.');
    const { values, pattern } = translations[appLanguage];
    return result.replace(pattern, (match) => values.get(match));
  };
  const locale = () => appLanguage === 'en' ? 'en-US' : 'es-CO';
  const translateTextNode = (node) => {
    const translated = translateValue(node.nodeValue);
    if (translated !== node.nodeValue) node.nodeValue = translated;
  };
  const translatableElements = 'input,button,label,section,nav,a,[data-label]';
  const translateAttributes = (root) => {
    const elements = [];
    if (root.nodeType === Node.ELEMENT_NODE && root.matches(translatableElements)) elements.push(root);
    if (root.querySelectorAll) elements.push(...root.querySelectorAll(translatableElements));
    for (const element of elements) {
      for (const attribute of ['aria-label', 'title', 'placeholder', 'data-label']) {
        if (!element.hasAttribute(attribute)) continue;
        const current = element.getAttribute(attribute);
        const translated = translateValue(current);
        if (translated !== current) element.setAttribute(attribute, translated);
      }
    }
  };
  const translateSubtree = (root) => {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (!root.querySelectorAll) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    translateAttributes(root);
  };
  function translatePage() {
    document.documentElement.lang = appLanguage;
    translateSubtree(document.body);
    const translatedTitle = translateValue('GRUPODGH — ingresos por tokens');
    if (document.title !== translatedTitle) document.title = translatedTitle;
    const toggle = document.querySelector('#languageToggle');
    if (toggle) {
      const label = appLanguage === 'en' ? 'ES' : 'EN';
      const title = appLanguage === 'en' ? 'Cambiar a español' : 'Switch to English';
      if (toggle.textContent !== label) toggle.textContent = label;
      if (toggle.title !== title) toggle.title = title;
      if (toggle.getAttribute('aria-label') !== title) toggle.setAttribute('aria-label', title);
    }
  }
  const languageObserver = new MutationObserver((records) => {
    if (appLanguage !== 'en') return;
    for (const record of records) {
      if (record.type === 'characterData') translateTextNode(record.target);
      else for (const addedNode of record.addedNodes) translateSubtree(addedNode);
    }
  });
  languageObserver.observe(document.body, { childList: true, characterData: true, subtree: true });
  document.querySelector('#languageToggle')?.addEventListener('click', () => {
    appLanguage = appLanguage === 'es' ? 'en' : 'es';
    try { localStorage.setItem('grupodgh-language', appLanguage); } catch { /* Language remains active for this session. */ }
    render();
    translatePage();
    languageObserver.takeRecords();
    $('#today').textContent = new Date().toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  });
  const $ = (selector) => document.querySelector(selector);
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem(THEME_KEY) || 'light'; } catch { /* Keep the default theme when browser storage is unavailable. */ }
  document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
  let savedTextSize = 100;
  try {
    const storedTextSize = Number(localStorage.getItem(TEXT_SIZE_KEY));
    if ([100, 110, 120, 130, 140].includes(storedTextSize)) savedTextSize = storedTextSize;
  } catch { /* Keep the default text size when browser storage is unavailable. */ }
  document.documentElement.style.setProperty('--app-zoom', String(savedTextSize / 100));
  let savedAccent = '';
  try {
    const storedAccent = localStorage.getItem(ACCENT_KEY) || '';
    if (/^#[\da-f]{6}$/i.test(storedAccent)) savedAccent = storedAccent;
  } catch { /* Keep the default accent when browser storage is unavailable. */ }
  const hexRgb = (hex) => hex.match(/[\da-f]{2}/gi).map((part) => parseInt(part, 16));
  const rgbHex = (rgb) => `#${rgb.map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`;
  const blendHex = (front, back, amount) => rgbHex(hexRgb(front).map((value, index) => value * amount + hexRgb(back)[index] * (1 - amount)));
  function applyAccentColor(color) {
    const root = document.documentElement;
    const dark = root.dataset.theme === 'dark';
    const surface = dark ? '#1b2330' : '#ffffff';
    const rgb = hexRgb(color);
    root.style.setProperty('--user-accent', color);
    root.style.setProperty('--user-accent-dark', blendHex(color, dark ? '#0b1020' : '#172033', 0.2));
    root.style.setProperty('--user-accent-soft', blendHex(color, surface, dark ? 0.2 : 0.1));
    root.style.setProperty('--user-accent-softer', blendHex(color, surface, dark ? 0.12 : 0.05));
    root.style.setProperty('--user-accent-border', blendHex(color, dark ? '#303949' : '#e9edf3', dark ? 0.58 : 0.28));
    root.style.setProperty('--user-accent-focus', blendHex(color, dark ? '#c0b5ff' : '#a497ec', 0.45));
    root.style.setProperty('--user-accent-glow', `rgba(${rgb.join(', ')}, .14)`);
    root.style.setProperty('--user-accent-contrast', rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 > 158 ? '#172033' : '#ffffff');
    const swatch = $('#accentSwatch');
    if (swatch) swatch.style.backgroundColor = color;
  }
  if (savedAccent) applyAccentColor(savedAccent);
  const defaults = { rates: { usdPerToken: { stripchat: 0.05, chaturbate: 0.05 }, copPerUsdByProvider: { bantokens: '', twl: '', usdt: '' } }, models: [], entries: [] };
  const modelIdRemap = {};
  let state;
  try {
    state = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    const oldRates = state.rates || {};
    const legacyTokensPerUsd = Number(oldRates.tokensPerUsd) || 0;
    const legacyCopPerUsd = oldRates.copPerUsd ?? '';
    state.rates = { ...defaults.rates, ...oldRates };
    state.rates.usdPerToken = oldRates.usdPerToken && typeof oldRates.usdPerToken === 'object'
      ? { ...defaults.rates.usdPerToken, ...oldRates.usdPerToken }
      : { stripchat: legacyTokensPerUsd > 0 ? 1 / legacyTokensPerUsd : 0.05, chaturbate: legacyTokensPerUsd > 0 ? 1 / legacyTokensPerUsd : 0.05 };
    state.rates.copPerUsdByProvider = oldRates.copPerUsdByProvider && typeof oldRates.copPerUsdByProvider === 'object'
      ? { ...defaults.rates.copPerUsdByProvider, ...oldRates.copPerUsdByProvider }
      : { bantokens: legacyCopPerUsd, twl: legacyCopPerUsd };
    const importedModels = Array.isArray(state.models) ? state.models : [];
    const modelsByName = new Map();
    state.models = [];
    for (const source of importedModels) {
      const platform = source.platform || 'both';
      const oldShare = Number(source.sharePct);
      const percentages = source.sharePctByPlatform && typeof source.sharePctByPlatform === 'object'
        ? { stripchat: Number(source.sharePctByPlatform.stripchat) || 0, chaturbate: Number(source.sharePctByPlatform.chaturbate) || 0 }
        : {
            stripchat: platform === 'chaturbate' ? 0 : (Number.isFinite(oldShare) ? oldShare : 0),
            chaturbate: platform === 'stripchat' ? 0 : (Number.isFinite(oldShare) ? oldShare : 0),
          };
      const oldDiscount = Number(source.copDiscountPerUsd) || 0;
      const discounts = source.copDiscountByPlatform && typeof source.copDiscountByPlatform === 'object'
        ? { stripchat: Number(source.copDiscountByPlatform.stripchat) || 0, chaturbate: Number(source.copDiscountByPlatform.chaturbate) || 0 }
        : {
            stripchat: platform === 'chaturbate' ? 0 : oldDiscount,
            chaturbate: platform === 'stripchat' ? 0 : oldDiscount,
          };
      const normalized = { ...source, platform: 'both', sharePctByPlatform: percentages };
      normalized.copDiscountByPlatform = discounts;
      const key = String(normalized.name || '').trim().toLocaleLowerCase();
      const existing = modelsByName.get(key);
      if (!existing) {
        state.models.push(normalized);
        modelsByName.set(key, normalized);
        modelIdRemap[normalized.id] = normalized.id;
      } else {
        if (platform === 'stripchat') existing.sharePctByPlatform.stripchat = percentages.stripchat;
        else if (platform === 'chaturbate') existing.sharePctByPlatform.chaturbate = percentages.chaturbate;
        else {
          existing.sharePctByPlatform.stripchat = percentages.stripchat;
          existing.sharePctByPlatform.chaturbate = percentages.chaturbate;
        }
        if (platform === 'stripchat') existing.copDiscountByPlatform.stripchat = discounts.stripchat;
        else if (platform === 'chaturbate') existing.copDiscountByPlatform.chaturbate = discounts.chaturbate;
        else {
          existing.copDiscountByPlatform.stripchat = discounts.stripchat;
          existing.copDiscountByPlatform.chaturbate = discounts.chaturbate;
        }
        modelIdRemap[normalized.id] = existing.id;
      }
    }
    state.entries = Array.isArray(state.entries) ? state.entries : [];
    state.entries = state.entries.map((entry) => ({
      ...entry,
      modelId: modelIdRemap[entry.modelId] || entry.modelId,
      platform: entry.platform || 'legacy',
      provider: entry.provider || 'legacy',
      usdPerToken: Number(entry.usdPerToken) || ((Number(entry.tokensPerUsd) || 0) > 0 ? 1 / Number(entry.tokensPerUsd) : undefined),
      copDiscountPerUsd: Number(entry.copDiscountPerUsd) || 0,
    }));
    if (localStorage.getItem(TIFFANY_SHARE_MIGRATION_KEY) !== 'done') {
      const tiffany = state.models.find((model) => String(model.name || '').toLocaleLowerCase().replace(/[^a-z0-9]/g, '') === 'tiffanysims');
      if (tiffany) {
        tiffany.sharePctByPlatform = { ...tiffany.sharePctByPlatform, stripchat: 80, chaturbate: 80 };
        state.entries = state.entries.map((entry) => entry.modelId === tiffany.id ? { ...entry, sharePct: 80 } : entry);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          localStorage.setItem(TIFFANY_SHARE_MIGRATION_KEY, 'done');
        } catch { /* Keep the in-memory correction if browser storage is unavailable. */ }
      }
    }
  } catch { state = structuredClone(defaults); }

  const number = (v) => Number(v) || 0;
  const fmt = (v, digits = 2) => new Intl.NumberFormat(locale(), { maximumFractionDigits: digits }).format(number(v));
  const usd = (v) => '$' + fmt(v, 2);
  const cop = (v) => '$' + fmt(v, 0) + ' COP';
  let lastTrmFetchedAt = '';
  const syncBantokensTrm = async () => {
    const note = $('#bantokensRateNote');
    try {
      if (!['http:', 'https:'].includes(window.location.protocol)) throw new Error('La sincronización requiere la versión web.');
      const response = await fetch(`${TRM_RATE_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo consultar la TRM.');
      const rate = await response.json();
      const trm = Number(rate.trmRate);
      const bantokensRate = Number(rate.bantokensRate);
      if (!Number.isFinite(trm) || trm <= 50 || !Number.isFinite(bantokensRate) || bantokensRate <= 0 || Math.abs(bantokensRate - (trm - 50)) > 0.01) throw new Error('La tasa TRM recibida no es válida.');
      const dateText = rate.validDate ? ` · ${rate.validDate}` : '';
      note.textContent = `TRM ${fmt(trm, 2)} − $50 = ${fmt(bantokensRate, 2)} COP${dateText}`;
      if (rate.fetchedAt !== lastTrmFetchedAt || number(state.rates.copPerUsdByProvider.bantokens) !== bantokensRate) {
        lastTrmFetchedAt = rate.fetchedAt || '';
        state.rates.copPerUsdByProvider.bantokens = bantokensRate;
        $('#copPerUsdBantokens').value = bantokensRate;
        persist();
        render();
      }
    } catch {
      note.textContent = number(state.rates.copPerUsdByProvider.bantokens) > 0
        ? 'Usando la última tasa guardada; no se pudo actualizar la TRM.'
        : 'TRM − $50 · se actualizará en la versión web.';
    }
  };
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const weekKey = (dateValue) => {
    const date = new Date(`${dateValue}T00:00:00`);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const stripchatWeekKey = (instant = new Date()) => {
    const monday = new Date(instant);
    monday.setUTCHours(0, 0, 0, 0);
    monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
    return monday.toISOString().slice(0, 10);
  };
  const entryWeekKey = (entry) => entry.platform === 'stripchat'
    ? `sc:${entry.stripchatWeekKey || entry.reportWeekKey || reportWeekKey(entry)}`
    : weekKey(entry.date);
  const reportWeekKeyForDate = (date, instant, platform = 'chaturbate') => platform === 'stripchat'
    ? stripchatWeekKey(instant || new Date(`${date}T12:00:00`))
    : weekKey(date);
  const reportWeekKey = (entry) => entry.reportWeekKey || (entry.platform === 'stripchat' && entry.createdAt
    ? stripchatWeekKey(new Date(entry.createdAt))
    : reportWeekKeyForDate(entry.date, undefined, entry.platform));
  const currentReportWeekKey = (platform) => platform === 'stripchat' ? stripchatWeekKey() : weekKey(todayISO());
  let selectedWeek = 'current';
  const entryMatchesSelectedWeek = (entry) => selectedWeek === 'current'
    ? reportWeekKey(entry) === weekKey(todayISO())
    : reportWeekKey(entry) === selectedWeek;
  const weekRangeLabel = (key) => {
    const monday = new Date(`${key}T00:00:00Z`);
    const sunday = new Date(monday);
    sunday.setUTCDate(sunday.getUTCDate() + 6);
    const dateLabel = (date) => date.toLocaleDateString(locale(), { day: 'numeric', month: 'short', timeZone: 'UTC' });
    return `${dateLabel(monday)} – ${dateLabel(sunday)}, ${sunday.getUTCFullYear()}`;
  };
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const modelById = (id) => state.models.find((m) => m.id === id);
  const ratesReady = (platform = $('#entryPlatform')?.value || 'stripchat', provider = $('#entryProvider')?.value || 'bantokens') => number(state.rates.usdPerToken[platform]) > 0 && number(state.rates.copPerUsdByProvider[provider]) > 0;
  const tokenUsd = (tokens, platform) => number(tokens) * number(state.rates.usdPerToken[platform]);
  const previousWeeklyReading = (modelId, platform, date, excludeId = '', targetWeek = weekKey(date)) => {
    const currentReading = excludeId ? state.entries.find((entry) => entry.id === excludeId) : undefined;
    const snapshots = state.entries
      .filter((entry) => entry.id !== excludeId && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === modelId && entry.platform === platform && (entry.date < date || (entry.date === date && currentReading && number(entry.createdAt) < number(currentReading.createdAt))) && entryWeekKey(entry) === targetWeek)
      .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
    if (snapshots.length) return snapshots.reduce((highest, reading) => !highest || number(reading.weeklyTokens) > number(highest.weeklyTokens) ? reading : highest, undefined);
    const earlierDailyLogs = state.entries.filter((entry) => entry.id !== excludeId && (entry.weeklyTokens === undefined || entry.weeklyTokens === null) && entry.modelId === modelId && entry.platform === platform && entry.date <= date && entryWeekKey(entry) === targetWeek);
    if (!earlierDailyLogs.length) return undefined;
    return { weeklyTokens: earlierDailyLogs.reduce((sum, entry) => sum + number(entry.tokens), 0), date: earlierDailyLogs.map((entry) => entry.date).sort().at(-1), legacy: true };
  };
  const entryTokens = (entry) => {
    if (entry.weeklyTokens === undefined || entry.weeklyTokens === null) return number(entry.tokens);
    const previous = previousWeeklyReading(entry.modelId, entry.platform, entry.date, entry.id, entryWeekKey(entry));
    return Math.max(0, number(entry.weeklyTokens) - number(previous?.weeklyTokens));
  };
  const entryUsd = (entry) => entryTokens(entry) * (number(entry.usdPerToken) || number(state.rates.usdPerToken[entry.platform]) || 0);
  const entryCopRate = (entry) => {
    const currentRate = number(state.rates.copPerUsdByProvider[entry.provider]);
    const recordedRate = number(entry.copPerUsd);
    if (reportWeekKey(entry) === currentReportWeekKey(entry.platform) && currentRate > 0) return currentRate;
    return recordedRate || currentRate || number(state.rates.copPerUsd);
  };
  const entryModelCopRate = (entry) => Math.max(0, entryCopRate(entry) - number(entry.copDiscountPerUsd));
  const entryOwnerFeeRate = (provider, platform) => provider === 'twl' ? TWL_OWNER_FEE_RATE : provider === 'usdt' && platform === 'stripchat' ? USDT_STRIPCHAT_FEE_RATE : 0;
  const bantokensWeeklyGross = (modelId, targetWeek, excludeId = '') => state.entries
    .filter((entry) => entry.id !== excludeId && entry.modelId === modelId && entry.provider === 'bantokens' && weekKey(entry.date) === targetWeek)
    .reduce((sum, entry) => sum + entryUsd(entry) * entrySharePct(entry) / 100, 0);
  const bantokensWeeklyFeeShare = (entry, modelGross = entryUsd(entry) * entrySharePct(entry) / 100, excludeId = '') => {
    const cohortGross = bantokensWeeklyGross(entry.modelId, weekKey(entry.date), excludeId) + modelGross;
    return cohortGross > 0 ? Math.min(BANTOKENS_WEEKLY_FEE_USD, cohortGross) * modelGross / cohortGross : 0;
  };
  const entryOwnerFeeLabel = (provider, platform) => provider === 'twl' ? 'TWL · 10%' : provider === 'usdt' && platform === 'stripchat' ? 'USDT Stripchat · 1%' : provider === 'bantokens' ? 'BANTOKENS · $11,88/sem de la modelo' : '';
  const entryOwnerFeeUsd = (entry) => entry.provider === 'bantokens' ? bantokensWeeklyFeeShare(entry, entryUsd(entry) * entrySharePct(entry) / 100, entry.id) : entryUsd(entry) * entryOwnerFeeRate(entry.provider, entry.platform);
  const entryOwnerFeeCop = (entry) => entryOwnerFeeUsd(entry) * (entry.provider === 'bantokens' ? entryModelCopRate(entry) : entryCopRate(entry));
  const entryShareBaseUsd = (entry, gross = entryUsd(entry)) => entry.provider === 'usdt' && entry.platform === 'stripchat' ? gross * (1 - USDT_STRIPCHAT_FEE_RATE) : gross;
  const entrySharePct = (entry) => entry.provider === 'usdt' && entry.platform === 'stripchat' ? USDT_STRIPCHAT_MODEL_SHARE : number(entry.sharePct);
  const entryModelUsd = (entry) => entry.provider === 'bantokens' ? Math.max(0, entryUsd(entry) * entrySharePct(entry) / 100 - entryOwnerFeeUsd(entry)) : entryShareBaseUsd(entry) * entrySharePct(entry) / 100;
  const entryModelCop = (entry) => entryModelUsd(entry) * entryModelCopRate(entry);
  const entryOwnerUsd = (entry) => entryUsd(entry) - entryModelUsd(entry) - entryOwnerFeeUsd(entry);
  const entryOwnerCop = (entry) => entryUsd(entry) * entryCopRate(entry) - entryModelCop(entry) - entryOwnerFeeCop(entry);
  function persist() {
    if (!cloudSession) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $('#saveIndicator').textContent = cloudSession ? '● Pendiente de nube' : '● Guardado';
    scheduleCloudSave();
  }
  function flash(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(flash.timer);
    flash.timer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  let cloudConfig = {};
  let cloudSession = null;
  let cloudUpdatedAt = null;
  let cloudDirty = false;
  let cloudConflict = false;
  let cloudSaveTimer = 0;
  let cloudSyncing = false;
  let cloudMutationVersion = 0;
  let cloudLoading = false;
  let cloudAuthClientInstance = null;
  let cloudAuthClientTag = '';
  let cloudWorkerUrls = {
    chaturbate: localStorage.getItem(CHATURBATE_WORKER_KEY) || '',
    stripchat: localStorage.getItem(STRIPCHAT_WORKER_KEY) || '',
  };
  try { cloudConfig = JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY) || '{}') || {}; } catch { cloudConfig = {}; }
  try { cloudSession = JSON.parse(localStorage.getItem(CLOUD_SESSION_KEY) || 'null'); } catch { cloudSession = null; }
  function normalizeChaturbateReportWeeks() {
    let changed = false;
    for (const entry of state.entries) {
      if (entry.platform !== 'chaturbate') continue;
      const localWeek = weekKey(entry.date);
      if (entry.reportWeekKey !== localWeek) {
        entry.reportWeekKey = localWeek;
        changed = true;
      }
    }
    return changed;
  }
  if (normalizeChaturbateReportWeeks() && !cloudSession) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  function cloudStatus(message, isError = false) {
    const status = $('#cloudStatus');
    if (!status) return;
    status.textContent = translateValue(message);
    status.dataset.state = isError ? 'error' : 'ok';
  }
  function cloudSetButtons(signedIn) {
    $('#cloudSignIn').hidden = signedIn;
    $('#cloudSignUp').hidden = signedIn;
    $('#cloudSignInGithub').hidden = signedIn;
    $('#cloudSignOut').hidden = !signedIn;
    $('#cloudEmail').disabled = signedIn;
    $('#cloudPassword').disabled = signedIn;
    $('#cloudRefresh').hidden = !cloudConflict;
    $('#cloudOverwrite').hidden = !cloudConflict;
    const account = $('#cloudAccountLabel');
    if (account) account.textContent = signedIn ? (cloudSession?.user?.email || 'Conectada') : 'Sin conectar';
  }
  function cloudConfiguration() {
    const projectUrl = String($('#cloudProjectUrl') ? $('#cloudProjectUrl').value : cloudConfig.projectUrl || '').trim().replace(/\/$/, '');
    const publicKey = String($('#cloudPublicKey') ? $('#cloudPublicKey').value : cloudConfig.publicKey || '').trim();
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(projectUrl) || !publicKey) throw new Error('No se encontró una configuración para la nube. Primero conecta Supabase.');
    cloudConfig = { projectUrl, publicKey };
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cloudConfig));
    return cloudConfig;
  }
  function cloudAuthClient() {
    const config = cloudConfiguration();
    if (!window.supabase?.createClient) throw new Error('No se pudo cargar el cliente de autenticación de Supabase. Recarga la app e inténtalo de nuevo.');
    const tag = `${config.projectUrl}|${config.publicKey}`;
    if (!cloudAuthClientInstance || cloudAuthClientTag !== tag) {
      cloudAuthClientInstance = window.supabase.createClient(config.projectUrl, config.publicKey, {
        auth: { storageKey: CLOUD_SESSION_KEY, persistSession: true, autoRefreshToken: false, detectSessionInUrl: true, flowType: 'pkce' },
      });
      cloudAuthClientTag = tag;
    }
    return cloudAuthClientInstance;
  }
  function cloudSaveSession() {
    if (cloudSession) localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(cloudSession));
    else localStorage.removeItem(CLOUD_SESSION_KEY);
  }
  async function cloudAuth(path, payload) {
    const config = cloudConfiguration();
    const response = await fetch(`${config.projectUrl}/auth/v1/${path}`, {
      method: 'POST', headers: { apikey: config.publicKey, 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.msg || result.message || result.error_description || result.error || `HTTP ${response.status}`);
    return result;
  }
  async function cloudRequest(path, options = {}, retry = true) {
    const config = cloudConfiguration();
    if (!cloudSession?.access_token) throw new Error('La sesión expiró. Inicia sesión nuevamente.');
    const response = await fetch(`${config.projectUrl}/rest/v1/${path}`, {
      ...options,
      headers: { apikey: config.publicKey, Authorization: `Bearer ${cloudSession.access_token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    if (response.status === 401 && retry && cloudSession.refresh_token) {
      const refreshed = await cloudAuth('token?grant_type=refresh_token', { refresh_token: cloudSession.refresh_token });
      cloudSession = refreshed; cloudSaveSession();
      return cloudRequest(path, options, false);
    }
    const result = await response.json().catch(() => null);
    if (!response.ok) throw new Error(result?.message || result?.hint || result?.details || `HTTP ${response.status}`);
    return result;
  }
  function cloudSnapshot() {
    return {
      appState: state,
      chaturbateCredentials: typeof chaturbateCredentials === 'undefined' ? {} : chaturbateCredentials,
      chaturbateWorkerUrl: cloudWorkerUrls.chaturbate,
      stripchatCredentials: typeof stripchatModelCredentials === 'undefined' ? {} : stripchatModelCredentials,
      stripchatWorkerUrl: cloudWorkerUrls.stripchat,
      stripchatStudioCredentials: typeof stripchatStudioCredentials === 'undefined' ? {} : stripchatStudioCredentials,
    };
  }
  function cloudApplySnapshot(snapshot) {
    if (!snapshot?.appState || !Array.isArray(snapshot.appState.models) || !Array.isArray(snapshot.appState.entries)) throw new Error('Los datos de la nube no tienen el formato esperado.');
    state = snapshot.appState;
    if (normalizeChaturbateReportWeeks()) cloudDirty = true;
    localStorage.removeItem(STORAGE_KEY);
    if (!cloudSession) {
      localStorage.setItem(CHATURBATE_CREDENTIALS_KEY, JSON.stringify(snapshot.chaturbateCredentials || {}));
      localStorage.setItem(STRIPCHAT_MODELS_KEY, JSON.stringify(snapshot.stripchatCredentials || {}));
      localStorage.setItem(CHATURBATE_WORKER_KEY, snapshot.chaturbateWorkerUrl || '');
      localStorage.setItem(STRIPCHAT_WORKER_KEY, snapshot.stripchatWorkerUrl || '');
    }
    cloudWorkerUrls = { chaturbate: snapshot.chaturbateWorkerUrl || '', stripchat: snapshot.stripchatWorkerUrl || '' };
    chaturbateCredentials = snapshot.chaturbateCredentials || {};
    stripchatModelCredentials = snapshot.stripchatCredentials || {};
    stripchatStudioCredentials = snapshot.stripchatStudioCredentials || {};
    if (cloudSession) {
      localStorage.removeItem(CHATURBATE_CREDENTIALS_KEY);
      localStorage.removeItem(STRIPCHAT_MODELS_KEY);
      localStorage.removeItem(STRIPCHAT_STUDIO_KEY);
      localStorage.removeItem(CHATURBATE_WORKER_KEY);
      localStorage.removeItem(STRIPCHAT_WORKER_KEY);
    }
    cloudDirty = false; cloudConflict = false;
    $('#cloudRefresh').hidden = true; $('#cloudOverwrite').hidden = true;
    $('#saveIndicator').textContent = '● Nube sincronizada';
    render();
    if (appLanguage === 'en') translatePage();
    if (['http:', 'https:'].includes(window.location.protocol)) setTimeout(() => { syncChaturbateAccounts(); syncStripchatModels(); }, 250);
  }
  async function cloudRead() {
    return cloudRequest(`user_app_state?select=data,revision&user_id=eq.${encodeURIComponent(cloudSession.user.id)}&limit=1`, { method: 'GET' });
  }
  function cloudConflictState() {
    cloudConflict = true;
    cloudSetButtons(true);
    $('#saveIndicator').textContent = '● Conflicto nube';
    cloudStatus('Hay cambios más recientes en la nube. Recarga la nube o sube explícitamente los datos de este dispositivo.', true);
  }
  async function cloudSave(force = false) {
    if (!cloudSession || cloudSyncing || cloudLoading || (cloudConflict && !force)) return;
    cloudSyncing = true;
    const saveVersion = cloudMutationVersion;
    cloudDirty = false;
    try {
      const data = cloudSnapshot();
      const query = `user_id=eq.${encodeURIComponent(cloudSession.user.id)}`;
      let rows;
      if (!cloudUpdatedAt) {
        const response = await cloudRequest('user_app_state', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ user_id: cloudSession.user.id, data, revision: 1 }) });
        rows = Array.isArray(response) ? response : [];
      } else {
        const compare = force ? '' : `&revision=eq.${encodeURIComponent(cloudUpdatedAt)}`;
        rows = await cloudRequest(`user_app_state?${query}${compare}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ data, revision: Number(cloudUpdatedAt) + 1 }) });
      }
      if (!rows?.length) {
        const latest = await cloudRead();
        if (latest?.length) { cloudUpdatedAt = latest[0].revision; cloudDirty = true; cloudConflictState(); return; }
        cloudUpdatedAt = null;
        throw new Error('No se encontró el registro de nube para esta cuenta. Inicia sesión de nuevo para volver a sincronizar.');
      }
      cloudUpdatedAt = rows[0].revision;
      cloudDirty = cloudMutationVersion !== saveVersion; cloudConflict = false;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CHATURBATE_CREDENTIALS_KEY);
      localStorage.removeItem(STRIPCHAT_MODELS_KEY);
      localStorage.removeItem(STRIPCHAT_STUDIO_KEY);
      localStorage.removeItem(CHATURBATE_WORKER_KEY);
      localStorage.removeItem(STRIPCHAT_WORKER_KEY);
      cloudSetButtons(true);
      $('#saveIndicator').textContent = cloudDirty ? '● Pendiente de nube' : '● Nube sincronizada';
      cloudStatus(`Sesión iniciada como ${cloudSession.user.email || 'usuario'} · Sincronizado ${new Date().toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' })}`);
    } catch (error) {
      cloudDirty = true;
      $('#saveIndicator').textContent = '● Error en nube';
      cloudStatus(`No se pudo conectar con la nube: ${error.message}`, true);
    } finally {
      cloudSyncing = false;
      if (cloudDirty && !cloudConflict) { clearTimeout(cloudSaveTimer); cloudSaveTimer = setTimeout(() => cloudSave(), 700); }
    }
  }
  function scheduleCloudSave() {
    if (!cloudSession) return;
    cloudMutationVersion += 1;
    cloudDirty = true;
    $('#saveIndicator').textContent = '● Pendiente de nube';
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(() => cloudSave(), 700);
  }
  async function cloudLoadOrSeed() {
    cloudStatus('Preparando conexión a la nube…');
    cloudSetButtons(true);
    cloudLoading = true;
    let shouldSeed = false;
    try {
      const rows = await cloudRead();
      if (rows?.length) {
        cloudUpdatedAt = rows[0].revision;
        cloudApplySnapshot(rows[0].data);
        cloudStatus(`Sesión iniciada como ${cloudSession.user.email || 'usuario'} · Sincronizado ${new Date().toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' })}`);
      } else {
        cloudUpdatedAt = null;
        cloudDirty = true;
        shouldSeed = true;
      }
    } finally { cloudLoading = false; }
    if (shouldSeed) await cloudSave();
    else if (cloudDirty) { clearTimeout(cloudSaveTimer); cloudSaveTimer = setTimeout(() => cloudSave(), 700); }
  }
  async function cloudSignIn(signUp = false) {
    try {
      cloudConfiguration();
      const email = $('#cloudEmail').value.trim();
      const password = $('#cloudPassword').value;
      if (!email || !password) throw new Error('Ingresa tu correo y contraseña.');
      if (signUp) {
        await cloudAuth('signup', { email, password });
        cloudStatus('Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.');
        return;
      }
      cloudSession = await cloudAuth('token?grant_type=password', { email, password });
      if (!cloudSession.access_token || !cloudSession.user?.id) throw new Error('La cuenta debe confirmarse por correo antes de iniciar sesión.');
      cloudSaveSession();
      await cloudLoadOrSeed();
    } catch (error) {
      const message = /invalid login credentials/i.test(error.message) ? 'Esa cuenta de GRUPODGH aún no existe. Pulsa Crear cuenta o usa Continuar con GitHub.' : error.message;
      cloudStatus(`No se pudo conectar con la nube: ${message}`, true);
    }
  }
  function clearCloudAuthCallbackParams() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('code') && !url.searchParams.has('error')) return;
    url.searchParams.delete('code');
    url.searchParams.delete('error');
    url.searchParams.delete('error_description');
    window.history.replaceState({}, document.title, url.toString());
  }
  async function cloudSignInWithGithub() {
    try {
      cloudConfiguration();
      if (window.location.protocol !== 'https:') throw new Error('Inicia sesión con GitHub desde la versión web publicada por HTTPS.');
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await cloudAuthClient().auth.signInWithOAuth({ provider: 'github', options: { redirectTo } });
      if (error) throw error;
    } catch (error) { cloudStatus(`No se pudo conectar con la nube: ${error.message}`, true); }
  }
  async function cloudInitializeSession() {
    if (!cloudConfig.projectUrl || !cloudConfig.publicKey) { cloudSession = null; cloudSetButtons(false); return; }
    try {
      const url = new URL(window.location.href);
      const callbackError = url.searchParams.get('error_description') || url.searchParams.get('error');
      if (callbackError) throw new Error(callbackError);
      const { data, error } = await cloudAuthClient().auth.getSession();
      if (error) throw error;
      if (data.session) { cloudSession = data.session; cloudSaveSession(); }
      if (!cloudSession?.access_token) { cloudSession = null; cloudSetButtons(false); clearCloudAuthCallbackParams(); return; }
      clearCloudAuthCallbackParams();
      await cloudLoadOrSeed();
    } catch (error) {
      clearCloudAuthCallbackParams();
      cloudStatus(`No se pudo conectar con la nube: ${error.message}`, true);
      if (!cloudSession?.access_token) cloudSetButtons(false);
    }
  }
  async function cloudRestore() {
    try {
      const rows = await cloudRead();
      if (!rows?.length) throw new Error('No hay datos guardados en la nube.');
      cloudUpdatedAt = rows[0].revision;
      cloudApplySnapshot(rows[0].data);
      cloudStatus(`Sesión iniciada como ${cloudSession.user.email || 'usuario'} · Sincronizado ${new Date().toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' })}`);
    } catch (error) { cloudStatus(`No se pudo conectar con la nube: ${error.message}`, true); }
  }
  $('#cloudProjectUrl').value = cloudConfig.projectUrl || '';
  $('#cloudPublicKey').value = cloudConfig.publicKey || '';
  $('#cloudSignIn').addEventListener('click', () => cloudSignIn(false));
  $('#cloudSignUp').addEventListener('click', () => cloudSignIn(true));
  $('#cloudSignInGithub').addEventListener('click', cloudSignInWithGithub);
  $('#cloudSignOut').addEventListener('click', async () => {
    try { if (cloudAuthClientInstance) await cloudAuthClientInstance.auth.signOut({ scope: 'local' }); } catch { /* Local sign-out still clears the stored session. */ }
    cloudSession = null; cloudUpdatedAt = null; cloudConflict = false; cloudSaveSession(); cloudSetButtons(false);
    cloudStatus('Sesión cerrada. Los datos de este dispositivo siguen disponibles.');
  });
  $('#cloudRefresh').addEventListener('click', cloudRestore);
  $('#cloudOverwrite').addEventListener('click', () => { cloudConflict = false; cloudSave(true); });
  for (const id of ['cloudProjectUrl', 'cloudPublicKey']) $(`#${id}`).addEventListener('change', () => {
    try { cloudConfiguration(); cloudStatus('Configuración guardada en este dispositivo.'); } catch { /* The user may still be typing. */ }
  });
  cloudInitializeSession();
  setInterval(async () => {
    if (document.hidden || !cloudSession || cloudSyncing || cloudConflict) return;
    try {
      const rows = await cloudRead();
      if (!rows?.length || rows[0].revision === cloudUpdatedAt) return;
      if (cloudDirty) cloudConflictState();
      else { cloudUpdatedAt = rows[0].revision; cloudApplySnapshot(rows[0].data); cloudStatus(`Sesión iniciada como ${cloudSession.user.email || 'usuario'} · Sincronizado ${new Date().toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' })}`); }
    } catch (error) { cloudStatus(`No se pudo conectar con la nube: ${error.message}`, true); }
  }, 20000);
  function periodEntries() {
    const period = $('#period').value;
    const platform = $('#platformFilter').value;
    const provider = $('#providerFilter').value;
    const modelId = $('#modelFilter').value;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === 'month') start.setDate(1);
    if (period === 'week') start.setDate(start.getDate() - 6);
    return state.entries.filter((e) => (platform === 'all' || e.platform === platform) && (provider === 'all' || e.provider === provider) && (modelId === 'all' || e.modelId === modelId) && (period === 'all' || (period === 'selected-week' ? entryMatchesSelectedWeek(e) : new Date(`${e.date}T00:00:00`) >= start)));
  }
  function renderSummary() {
    const entries = periodEntries();
    const tokens = entries.reduce((sum, e) => sum + entryTokens(e), 0);
    const total = entries.reduce((sum, e) => sum + entryUsd(e), 0);
    const modelsTotal = entries.reduce((sum, e) => sum + entryModelUsd(e), 0);
    const ownerTotal = entries.reduce((sum, e) => sum + entryOwnerUsd(e), 0);
    const totalCop = entries.reduce((sum, e) => sum + entryUsd(e) * entryCopRate(e), 0);
    const modelsCop = entries.reduce((sum, e) => sum + entryModelCop(e), 0);
    const ownerCop = entries.reduce((sum, e) => sum + entryOwnerCop(e), 0);
    const ownerFeeUsd = entries.reduce((sum, e) => sum + entryOwnerFeeUsd(e), 0);
    const ownerFeeCop = entries.reduce((sum, e) => sum + entryOwnerFeeCop(e), 0);
    const period = $('#period').value;
    $('#summaryPeriodLabel').textContent = period === 'selected-week' ? selectedWeek === 'current' ? 'Semana actual · corte según cada página' : `Semana ${weekRangeLabel(selectedWeek)}` : period === 'all' ? 'Histórico completo' : period === 'month' ? 'Desde el inicio del mes' : 'Últimos 7 días';
    $('#totalTokens').innerHTML = `${fmt(tokens, 0)} <small>tokens</small>`;
    $('#totalUsd').innerHTML = `${usd(total)} <small>USD</small>`;
    $('#totalCop').textContent = entries.length && entries.every((e) => entryCopRate(e) > 0) ? `≈ ${cop(totalCop)}` : 'Configura las tasas para convertir a COP';
    $('#modelsUsd').innerHTML = `${usd(modelsTotal)} <small>USD</small>`;
    $('#modelsCop').textContent = entries.length && entries.every((e) => entryCopRate(e) > 0) ? `≈ ${cop(modelsCop)}` : 'Configura las tasas para convertir a COP';
    $('#ownerUsd').innerHTML = `${usd(ownerTotal)} <small>USD</small>`;
    $('#ownerCop').textContent = entries.length && entries.every((e) => entryCopRate(e) > 0) ? `≈ ${cop(ownerCop)}` : 'Configura las tasas para convertir a COP';
    const feeCopText = entries.every((e) => entryCopRate(e) > 0) ? cop(ownerFeeCop) : 'COP pendiente de tasa';
    $('#ownerFeeSummary').textContent = `Descuentos (TWL 10% / USDT Stripchat 1% / BANTOKENS $11,88 semanal descontado de la parte de cada modelo): ${usd(ownerFeeUsd)} · ${feeCopText}`;
  }
  function renderWeekOptions() {
    const currentWeek = weekKey(todayISO());
    const weeks = new Set([currentWeek, ...state.entries.map(reportWeekKey).filter((week) => week <= currentWeek), 'current']);
    if (!weeks.has(selectedWeek)) selectedWeek = 'current';
    const options = ['current', ...[...weeks].filter((week) => week !== 'current').sort((a, b) => b.localeCompare(a))];
    $('#weekSelector').innerHTML = options.map((week) => `<option value="${week}">${week === 'current' ? 'Semana actual' : escapeHtml(weekRangeLabel(week))}</option>`).join('');
    $('#weekSelector').value = selectedWeek;
  }
  function renderWeeklyPayouts() {
    const payoutWeek = selectedWeek === 'current' ? weekKey(todayISO()) : selectedWeek;
    $('#weeklyDateRange').textContent = `Stripchat: lunes 00:00 UTC · Chaturbate: lunes 00:00 hora local · ${weekRangeLabel(payoutWeek)} · La semana nueva se muestra el lunes a las 00:00 hora local · TWL retiene 10% del total y luego se calcula tu restante.`;
    const totals = new Map();
    state.entries.filter(entryMatchesSelectedWeek).forEach((entry) => {
      const key = JSON.stringify([entry.modelId, entry.platform, entry.provider]);
      if (!totals.has(key)) totals.set(key, { modelName: entry.modelName || modelById(entry.modelId)?.name || 'Modelo eliminada', platform: entry.platform, provider: entry.provider, tokens: 0, modelUsd: 0, modelCop: 0, ownerFeeUsd: 0, ownerFeeCop: 0, ownerUsd: 0, ownerCop: 0, hasCopRate: true });
      const total = totals.get(key);
      total.tokens += entryTokens(entry);
      total.modelUsd += entryModelUsd(entry);
      total.modelCop += entryModelCop(entry);
      total.ownerFeeUsd += entryOwnerFeeUsd(entry);
      total.ownerFeeCop += entryOwnerFeeCop(entry);
      total.ownerUsd += entryOwnerUsd(entry);
      total.ownerCop += entryOwnerCop(entry);
      if (!(entryCopRate(entry) > 0)) total.hasCopRate = false;
    });
    const rows = [...totals.values()].sort((a, b) => a.modelName.localeCompare(b.modelName) || a.platform.localeCompare(b.platform) || a.provider.localeCompare(b.provider));
    $('#weeklyPayoutEmpty').hidden = rows.length > 0;
    $('#weeklyPayoutBody').innerHTML = rows.map((row) => {
      const platform = row.platform === 'stripchat' ? 'Stripchat' : row.platform === 'chaturbate' ? 'Chaturbate' : 'Anterior';
      const provider = row.provider === 'bantokens' ? 'BANTOKENS' : row.provider === 'twl' ? 'TWL' : row.provider === 'usdt' ? 'USDT' : 'Anterior';
      const feeLabel = entryOwnerFeeLabel(row.provider, row.platform, row.modelId, row.modelName);
      return `<tr><td data-label="Modelo"><span class="model-cell"><span class="model-dot">${escapeHtml(row.modelName.trim().charAt(0).toUpperCase() || '?')}</span>${escapeHtml(row.modelName)}</span></td><td data-label="Página">${platform}</td><td data-label="Monetizadora">${provider}</td><td class="token-cell" data-label="Tokens en la semana">${fmt(row.tokens, 0)}</td><td class="amount-cell" data-label="Modelo · USD">${usd(row.modelUsd)}</td><td class="share-cell" data-label="Modelo · COP">${row.hasCopRate ? cop(row.modelCop) : 'Configura la tasa COP/USD'}</td><td class="fee-cell" data-label="Retención monetizadora">${row.ownerFeeUsd > 0 ? `${usd(row.ownerFeeUsd)}<small>${row.hasCopRate ? cop(row.ownerFeeCop) : 'Configura tasa COP/USD'}</small><small>${feeLabel}</small>` : '—'}</td><td class="amount-cell" data-label="Tu neto · USD">${usd(row.ownerUsd)}</td><td class="owner-cell" data-label="Tu neto · COP">${row.hasCopRate ? cop(row.ownerCop) : 'Configura la tasa COP/USD'}</td></tr>`;
    }).join('');
    const totalTokens = rows.reduce((sum, row) => sum + row.tokens, 0);
    const totalModelUsd = rows.reduce((sum, row) => sum + row.modelUsd, 0);
    const totalModelCop = rows.reduce((sum, row) => sum + row.modelCop, 0);
    const totalFeeUsd = rows.reduce((sum, row) => sum + row.ownerFeeUsd, 0);
    const totalFeeCop = rows.reduce((sum, row) => sum + row.ownerFeeCop, 0);
    const totalOwnerUsd = rows.reduce((sum, row) => sum + row.ownerUsd, 0);
    const totalOwnerCop = rows.reduce((sum, row) => sum + row.ownerCop, 0);
    const allCopRatesReady = rows.length > 0 && rows.every((row) => row.hasCopRate);
    $('#weeklyPayoutFoot').innerHTML = rows.length ? `<tr><th colspan="3">TOTAL SEMANAL</th><th data-label="Tokens en la semana">${fmt(totalTokens, 0)}</th><th data-label="Modelo · USD">${usd(totalModelUsd)}</th><th data-label="Modelo · COP">${allCopRatesReady ? cop(totalModelCop) : 'Configura las tasas'}</th><th data-label="Retención monetizadora">${usd(totalFeeUsd)}<small>${allCopRatesReady ? cop(totalFeeCop) : 'Configura las tasas'}</small></th><th data-label="Tu neto · USD">${usd(totalOwnerUsd)}</th><th data-label="Tu neto · COP">${allCopRatesReady ? cop(totalOwnerCop) : 'Configura las tasas'}</th></tr>` : '';
  }
  function renderWeeklyHistory() {
    const totals = new Map();
    const visibleThroughWeek = weekKey(todayISO());
    state.entries.forEach((entry) => {
      const key = reportWeekKey(entry);
      if (key > visibleThroughWeek) return;
      if (!totals.has(key)) totals.set(key, { week: key, tokens: 0, totalUsd: 0, modelUsd: 0, modelCop: 0, ownerUsd: 0, ownerCop: 0, hasCopRate: true });
      const week = totals.get(key);
      week.tokens += entryTokens(entry);
      week.totalUsd += entryUsd(entry);
      week.modelUsd += entryModelUsd(entry);
      week.modelCop += entryModelCop(entry);
      week.ownerUsd += entryOwnerUsd(entry);
      week.ownerCop += entryOwnerCop(entry);
      if (!(entryCopRate(entry) > 0)) week.hasCopRate = false;
    });
    const rows = [...totals.values()].sort((a, b) => b.week.localeCompare(a.week));
    $('#weeklyHistoryEmpty').hidden = rows.length > 0;
    $('#weeklyHistoryBody').innerHTML = rows.map((row) => `<tr><td data-label="Semana">${escapeHtml(weekRangeLabel(row.week))}</td><td class="token-cell" data-label="Tokens">${fmt(row.tokens, 0)}</td><td class="amount-cell" data-label="Total · USD">${usd(row.totalUsd)}</td><td class="share-cell" data-label="Modelos · USD">${usd(row.modelUsd)}</td><td data-label="Modelos · COP">${row.hasCopRate ? cop(row.modelCop) : 'Configura las tasas'}</td><td class="amount-cell" data-label="Tu neto · USD">${usd(row.ownerUsd)}</td><td data-label="Tu neto · COP">${row.hasCopRate ? cop(row.ownerCop) : 'Configura las tasas'}</td><td data-label="Detalle"><button class="week-history-open" type="button" data-select-week="${row.week}">Ver semana →</button></td></tr>`).join('');
    const total = rows.reduce((all, row) => ({ tokens: all.tokens + row.tokens, totalUsd: all.totalUsd + row.totalUsd, modelUsd: all.modelUsd + row.modelUsd, modelCop: all.modelCop + row.modelCop, ownerUsd: all.ownerUsd + row.ownerUsd, ownerCop: all.ownerCop + row.ownerCop, hasCopRate: all.hasCopRate && row.hasCopRate }), { tokens: 0, totalUsd: 0, modelUsd: 0, modelCop: 0, ownerUsd: 0, ownerCop: 0, hasCopRate: rows.length > 0 });
    $('#weeklyHistoryFoot').innerHTML = rows.length ? `<tr><th>ACUMULADO HISTÓRICO</th><th data-label="Tokens">${fmt(total.tokens, 0)}</th><th data-label="Total · USD">${usd(total.totalUsd)}</th><th data-label="Modelos · USD">${usd(total.modelUsd)}</th><th data-label="Modelos · COP">${total.hasCopRate ? cop(total.modelCop) : 'Configura las tasas'}</th><th data-label="Tu neto · USD">${usd(total.ownerUsd)}</th><th data-label="Tu neto · COP">${total.hasCopRate ? cop(total.ownerCop) : 'Configura las tasas'}</th><th></th></tr>` : '';
  }
  function renderEntries() {
    const modelFilter = $('#modelFilter');
    const selectedModel = modelFilter.value;
    modelFilter.innerHTML = `<option value="all">Todas las modelos</option>${state.models.map((model) => `<option value="${escapeHtml(model.id)}">${escapeHtml(model.name)}</option>`).join('')}`;
    if ([...modelFilter.options].some((option) => option.value === selectedModel)) modelFilter.value = selectedModel;
    const tbody = $('#entriesBody');
    const entries = periodEntries().slice().sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
    $('#emptyState').hidden = entries.length > 0;
    tbody.innerHTML = entries.map((e) => {
      const model = modelById(e.modelId);
      const name = e.modelName || model?.name || 'Modelo eliminada';
      const gross = entryUsd(e);
      const share = entrySharePct(e);
      const platform = e.platform === 'stripchat' ? 'Stripchat' : e.platform === 'chaturbate' ? 'Chaturbate' : 'Anterior';
      const provider = e.provider === 'bantokens' ? 'BANTOKENS' : e.provider === 'twl' ? 'TWL' : e.provider === 'usdt' ? 'USDT' : 'Anterior';
      const d = new Date(`${e.date}T00:00:00`).toLocaleDateString(locale(), { day: '2-digit', month: 'short', year: 'numeric' });
      const dailyTokens = entryTokens(e);
      const weeklyTokens = e.weeklyTokens === undefined || e.weeklyTokens === null ? '—' : fmt(e.weeklyTokens, 0);
      const feeLabel = entryOwnerFeeLabel(e.provider, e.platform, e.modelId, name);
      return `<tr><td data-label="Modelo"><span class="model-cell"><span class="model-dot">${escapeHtml(name.trim().charAt(0).toUpperCase() || '?')}</span>${escapeHtml(name)}</span></td><td data-label="Página">${platform}</td><td data-label="Monetizadora">${provider}</td><td data-label="Fecha">${d}</td><td class="token-cell" data-label="Tokens del día">${fmt(dailyTokens, 0)}</td><td data-label="Acumulado semanal">${weeklyTokens}</td><td class="amount-cell" data-label="Valor total · USD">${usd(gross)}</td><td class="share-cell" data-label="Modelo · USD / COP">${usd(entryModelUsd(e))} <span style="color:#9aa2af">(${fmt(share, 1)}%)</span><small class="payout-cop">${cop(entryModelCop(e))}</small></td><td class="fee-cell" data-label="Retención monetizadora">${entryOwnerFeeUsd(e) > 0 ? `${usd(entryOwnerFeeUsd(e))}<small>${cop(entryOwnerFeeCop(e))}</small><small>${feeLabel}</small>` : '—'}</td><td class="owner-cell" data-label="Tu neto · USD / COP">${usd(entryOwnerUsd(e))}<small>${cop(entryOwnerCop(e))}</small></td><td class="entry-actions-cell" data-label="Acciones"><div class="entry-actions"><button class="edit-entry" data-edit-entry="${escapeHtml(e.id)}" aria-label="Editar ingreso" title="Editar ingreso">Editar</button><button class="delete-entry" data-delete-entry="${escapeHtml(e.id)}" aria-label="Eliminar ingreso" title="Eliminar ingreso">×</button></div></td></tr>`;
    }).join('');
    renderWeekOptions();
    renderSummary();
    renderWeeklyPayouts();
    renderWeeklyHistory();
  }
  function renderModels() {
    const currentSelection = $('#entryModel').value;
    const options = state.models.map((m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)}</option>`).join('');
    $('#entryModel').innerHTML = `<option value="">Selecciona un modelo</option>${options}`;
    if ([...$('#entryModel').options].some((option) => option.value === currentSelection)) $('#entryModel').value = currentSelection;
    $('#noModels').hidden = state.models.length > 0;
    $('#modelManageList').innerHTML = state.models.map((m) => {
      const locked = state.entries.some((e) => e.modelId === m.id);
      const share = `SC ${fmt(m.sharePctByPlatform.stripchat, 1)}% · -${fmt(m.copDiscountByPlatform.stripchat, 0)} COP/USD · CB ${fmt(m.sharePctByPlatform.chaturbate, 1)}% · -${fmt(m.copDiscountByPlatform.chaturbate, 0)} COP/USD`;
      const syncBadge = `${modelSyncBadge('chaturbate', chaturbateCredentials[m.id])} ${modelSyncBadge('stripchat', stripchatModelCredentials[m.id])}`;
      return `<div class="manage-row"><span class="manage-name">${escapeHtml(m.name)} ${syncBadge}<small style="color:#8b94a3">· ${share}</small> ${locked ? '<small title="Tiene ingresos registrados" style="color:#99a1ae">· con movimientos</small>' : ''}</span><button class="edit-model" data-edit-model="${escapeHtml(m.id)}" title="Editar modelo">Editar</button><button class="remove-model" data-remove-model="${escapeHtml(m.id)}" ${locked ? 'disabled title="No se puede eliminar porque tiene ingresos registrados"' : 'title="Eliminar modelo"'} aria-label="Eliminar modelo">×</button></div>`;
    }).join('');
  }
  function renderPreview() {
    const model = modelById($('#entryModel').value);
    const rawWeeklyTokens = $('#entryWeeklyTokens').value;
    const weeklyTokens = Number(rawWeeklyTokens);
    const preview = $('#entryPreview');
    if (!model || rawWeeklyTokens === '' || !Number.isFinite(weeklyTokens) || weeklyTokens < 0) { preview.textContent = 'Ingresa el acumulado semanal. Se comparará con la lectura anterior de esta modelo y página.'; return; }
    const platform = $('#entryPlatform').value;
    const provider = $('#entryProvider').value;
    const date = $('#entryDate').value || todayISO();
    const editingEntry = state.entries.find((entry) => entry.id === $('#editingEntryId').value);
    const targetReportWeek = reportWeekKeyForDate(date, date === todayISO() ? new Date() : undefined, platform);
    const sameDay = state.entries.find((entry) => entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === model.id && entry.platform === platform && entry.date === date && reportWeekKey(entry) === targetReportWeek);
    const previous = previousWeeklyReading(model.id, platform, date, editingEntry?.id || sameDay?.id || '');
    const sameContext = editingEntry && editingEntry.modelId === model.id && editingEntry.platform === platform && editingEntry.provider === provider;
    const previousTokens = number(previous?.weeklyTokens);
    if (previous && weeklyTokens < previousTokens) {
      preview.textContent = `El acumulado (${fmt(weeklyTokens, 0)}) es menor que la última lectura de esta semana (${fmt(previousTokens, 0)}). Revisa la fecha o el valor.`;
      return;
    }
    const dailyTokens = Math.max(0, weeklyTokens - previousTokens);
    const previousInfo = previous ? `${previous.legacy ? 'Tokens registrados antes' : 'Última lectura'}: ${fmt(previousTokens, 0)} (${new Date(`${previous.date}T00:00:00`).toLocaleDateString(locale(), { day: 'numeric', month: 'short' })}).` : 'Primera lectura de esta modelo y página en la semana: el acumulado completo se contará como tokens del día.';
    const previewUsdPerToken = sameContext ? number(editingEntry.usdPerToken) : number(state.rates.usdPerToken[platform]);
    const previewCopRate = sameContext ? entryCopRate(editingEntry) : number(state.rates.copPerUsdByProvider[provider]);
    if (!(previewUsdPerToken > 0 && previewCopRate > 0)) {
      preview.innerHTML = `${sameContext || sameDay ? 'Actualizando ingreso.' : 'Tokens del día estimados:'} <b>${fmt(dailyTokens, 0)}</b> · Acumulado semanal: <b>${fmt(weeklyTokens, 0)}</b>. ${previousInfo} Configura las tasas para calcular el dinero.`;
      return;
    }
    const gross = dailyTokens * previewUsdPerToken;
    const sharePct = provider === 'usdt' && platform === 'stripchat' ? USDT_STRIPCHAT_MODEL_SHARE : sameContext ? number(editingEntry.sharePct) : Number(model.sharePctByPlatform[platform]);
    if (!Number.isFinite(sharePct) || sharePct < 0 || sharePct > 100) { preview.textContent = 'Esta modelo no tiene un porcentaje configurado. Agrégala de nuevo con página y porcentaje.'; return; }
    const feeEntry = { modelId: model.id, modelName: model.name, provider, platform, date, sharePct, reportWeekKey: targetReportWeek };
    const replaceId = editingEntry?.id || sameDay?.id || '';
    const ownerFeeUsd = feeEntry.provider === 'bantokens'
      ? bantokensWeeklyFeeShare(feeEntry, gross * sharePct / 100, replaceId)
      : gross * entryOwnerFeeRate(provider, platform);
    const shareBase = entryShareBaseUsd(feeEntry, gross, ownerFeeUsd);
    const modelGrossShare = shareBase * sharePct / 100;
    const modelPart = Math.max(0, modelGrossShare - (provider === 'bantokens' ? ownerFeeUsd : 0));
    const discount = sameContext ? number(editingEntry.copDiscountPerUsd) : number(model.copDiscountByPlatform[platform]);
    const copRate = previewCopRate;
    const modelPayoutCop = modelPart * Math.max(0, copRate - discount);
    const totalCop = gross * copRate;
    const ownerNetUsd = gross - modelPart - ownerFeeUsd;
    const bantokensFeeCopRate = provider === 'bantokens' ? Math.max(0, copRate - discount) : copRate;

    const ownerNetCop = totalCop - modelPayoutCop - ownerFeeUsd * bantokensFeeCopRate;
    const feeDescription = feeEntry.provider === 'bantokens' ? `BANTOKENS descuenta ${usd(ownerFeeUsd)} de la parte que le corresponde a la modelo tras aplicar su porcentaje (${usd(modelGrossShare)}). ` : provider === 'twl' ? `TWL retiene ${usd(ownerFeeUsd)} (${cop(ownerFeeUsd * copRate)}) del total. ` : provider === 'usdt' && platform === 'stripchat' ? `USDT descuenta primero ${usd(ownerFeeUsd)} (1%); los ${usd(shareBase)} restantes se reparten ${fmt(sharePct, 1)}% para ella y ${fmt(100 - sharePct, 1)}% para ti. ` : '';
    preview.innerHTML = `${sameContext || sameDay ? 'Actualizando ingreso.' : 'Tokens del día estimados:'} <b>${fmt(dailyTokens, 0)}</b> · Acumulado: <b>${fmt(weeklyTokens, 0)}</b>. ${previousInfo}<br>Total del día: <b>${usd(gross)}</b> (${cop(totalCop)}). Modelo (${fmt(sharePct, 1)}%): <b>${usd(modelPart)}</b> · paga <b>${cop(modelPayoutCop)}</b>. ${feeDescription}Tu parte neta: <b>${usd(ownerNetUsd)}</b> · <b>${cop(ownerNetCop)}</b>.`;
  }
  function render() { renderModels(); renderEntries(); renderPreview(); }
  function updateThemeControl() {
    const dark = document.documentElement.dataset.theme === 'dark';
    $('#themeIcon').textContent = dark ? '☀' : '☾';
    $('#themeToggle').setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
    $('#themeToggle').title = dark ? 'Activar modo claro' : 'Activar modo oscuro';
  }
  function clearModelEdit() {
    $('#modelForm').reset();
    loadModelChaturbateForm('');
    loadModelStripchatForm('');
    $('#editingModelId').value = '';
    $('#modelFormTitle').textContent = 'Agregar modelo';
    $('#modelSubmitButton').innerHTML = '<span>＋</span> Agregar modelo';
    $('#cancelModelEdit').hidden = true;
  }
  function clearEntryEdit() {
    $('#entryForm').reset();
    $('#editingEntryId').value = '';
    $('#entryDate').value = todayISO();
    $('#entryFormTitle').textContent = 'Registrar ingresos';
    $('#entrySubmitButton').innerHTML = 'Guardar ingreso <span>→</span>';
    $('#cancelEntryEdit').hidden = true;
    renderPreview();
  }

  $('#today').textContent = new Date().toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const textSizeToggle = $('#textSizeToggle');
  const textSizePanel = $('#textSizePanel');
  const textSizeRange = $('#textSizeRange');
  const applyTextSize = (size) => {
    savedTextSize = Number(size);
    document.documentElement.style.setProperty('--app-zoom', String(savedTextSize / 100));
    textSizeRange.value = String(savedTextSize);
    $('#textSizeValue').value = `${savedTextSize}%`;
    try { localStorage.setItem(TEXT_SIZE_KEY, String(savedTextSize)); } catch { /* Keep the size until the app is closed. */ }
  };
  applyTextSize(savedTextSize);
  textSizeToggle.addEventListener('click', () => {
    const open = textSizePanel.hidden;
    textSizePanel.hidden = !open;
    textSizeToggle.setAttribute('aria-expanded', String(open));
    if (open) textSizeRange.focus();
  });
  textSizeRange.addEventListener('input', (event) => applyTextSize(event.target.value));
  $('#textSizeReset').addEventListener('click', () => applyTextSize(100));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.text-size-control')) {
      textSizePanel.hidden = true;
      textSizeToggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !textSizePanel.hidden) {
      textSizePanel.hidden = true;
      textSizeToggle.setAttribute('aria-expanded', 'false');
      textSizeToggle.focus();
    }
  });
  $('#accentColorInput').value = savedAccent || (document.documentElement.dataset.theme === 'dark' ? '#a99bf6' : '#6856d9');
  $('#accentColorInput').addEventListener('input', (event) => {
    savedAccent = event.target.value;
    applyAccentColor(savedAccent);
    try { localStorage.setItem(ACCENT_KEY, savedAccent); } catch { /* Keep the color until the app is closed. */ }
  });
  updateThemeControl();
  $('#themeToggle').addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(THEME_KEY, nextTheme);
    if (savedAccent) applyAccentColor(savedAccent);
    else $('#accentColorInput').value = nextTheme === 'dark' ? '#a99bf6' : '#6856d9';
    updateThemeControl();
  });
  let pendingBackupImport = null;
  $('#exportBackup').addEventListener('click', () => {
    const backup = { app: 'GRUPODGH', version: 1, exportedAt: new Date().toISOString(), data: state };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const download = document.createElement('a');
    download.href = url;
    download.download = `grupodgh-respaldo-${todayISO()}.json`;
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Respaldo descargado.');
  });
  $('#backupFile').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      const imported = backup?.data;
      if (backup?.app !== 'GRUPODGH' || backup?.version !== 1 || !imported || !Array.isArray(imported.models) || !Array.isArray(imported.entries) || !imported.rates || typeof imported.rates !== 'object') {
        flash('Ese archivo no es un respaldo válido de GRUPODGH.');
        return;
      }
      pendingBackupImport = imported;
      $('#backupConfirmDetails').textContent = `Archivo: ${file.name}. Se importarán ${imported.models.length} modelos, ${imported.entries.length} ingresos y sus tasas.`;
      $('#backupConfirm').hidden = false;
    } catch {
      flash('No se pudo importar. Revisa que el archivo sea un respaldo válido.');
    } finally {
      event.target.value = '';
    }
  });
  $('#cancelBackupImport').addEventListener('click', () => {
    pendingBackupImport = null;
    $('#backupConfirm').hidden = true;
  });
  $('#confirmBackupImport').addEventListener('click', () => {
    if (!pendingBackupImport) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingBackupImport));
      pendingBackupImport = null;
      $('#backupConfirm').hidden = true;
      flash('Respaldo importado. Recargando la app…');
      setTimeout(() => window.location.reload(), 350);
    } catch {
      pendingBackupImport = null;
      $('#backupConfirm').hidden = true;
      flash('No se pudo guardar el respaldo en este navegador.');
    }
  });
  $('#entryDate').value = todayISO();
  $('#rateStripchat').value = state.rates.usdPerToken.stripchat;
  $('#rateChaturbate').value = state.rates.usdPerToken.chaturbate;
  $('#copPerUsdBantokens').value = state.rates.copPerUsdByProvider.bantokens;
  $('#copPerUsdTwl').value = state.rates.copPerUsdByProvider.twl;
  $('#copPerUsdUsdt').value = state.rates.copPerUsdByProvider.usdt;
  for (const [id, platform] of [['rateStripchat', 'stripchat'], ['rateChaturbate', 'chaturbate']]) {
    $(`#${id}`).addEventListener('change', (event) => {
      const value = event.target.value;
      if (value && number(value) <= 0) { event.target.value = ''; return; }
      state.rates.usdPerToken[platform] = number(value);
      persist(); render();
    });
  }
  for (const [id, provider] of [['copPerUsdBantokens', 'bantokens'], ['copPerUsdTwl', 'twl'], ['copPerUsdUsdt', 'usdt']]) {
    $(`#${id}`).addEventListener('change', (event) => {
      const value = event.target.value;
      if (value && number(value) <= 0) { event.target.value = ''; return; }
      state.rates.copPerUsdByProvider[provider] = value;
      if (provider === 'bantokens') $('#bantokensRateNote').textContent = 'Tasa editada manualmente; se sincroniza desde la TRM al abrir la versión web.';
      persist(); render();
    });
  }
  syncBantokensTrm();
  if (['http:', 'https:'].includes(window.location.protocol)) setInterval(syncBantokensTrm, 60 * 60 * 1000);
  $('#period').addEventListener('change', renderEntries);
  $('#platformFilter').addEventListener('change', renderEntries);
  $('#providerFilter').addEventListener('change', renderEntries);
  $('#modelFilter').addEventListener('change', renderEntries);
  $('#weekSelector').addEventListener('change', (event) => { selectedWeek = event.target.value; renderEntries(); });
  $('#weeklyHistoryBody').addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-week]');
    if (!button) return;
    selectedWeek = button.dataset.selectWeek;
    $('#weekSelector').value = selectedWeek;
    $('#period').value = 'selected-week';
    renderEntries();
    $('#weekly-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#entryPlatform').addEventListener('change', renderPreview);
  $('#entryProvider').addEventListener('change', renderPreview);
  $('#entryModel').addEventListener('change', renderPreview);
  $('#entryDate').addEventListener('change', renderPreview);
  $('#entryWeeklyTokens').addEventListener('input', renderPreview);
  $('#modelForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const editingId = $('#editingModelId').value;
    const name = $('#modelName').value.trim();
    const stripchatPct = Number($('#modelShareStripchat').value);
    const chaturbatePct = Number($('#modelShareChaturbate').value);
    const copDiscountStripchat = Number($('#modelCopStripchat').value);
    const copDiscountChaturbate = Number($('#modelCopChaturbate').value);
    if (!name) { flash('Escribe el nombre de la modelo.'); return; }
    if (![stripchatPct, chaturbatePct].every((value) => Number.isFinite(value) && value >= 0 && value <= 100)) { flash('Usa porcentajes entre 0 y 100 para ambas páginas.'); return; }
    if (![copDiscountStripchat, copDiscountChaturbate].every((value) => Number.isFinite(value) && value >= 0)) { flash('Los descuentos en pesos deben ser números iguales o mayores a cero.'); return; }
    const configuredCopRates = Object.values(state.rates.copPerUsdByProvider).map(number).filter((rate) => rate > 0);
    if (configuredCopRates.some((rate) => copDiscountStripchat >= rate || copDiscountChaturbate >= rate)) { flash('Cada descuento debe ser menor que las tasas COP/USD configuradas.'); return; }
    if (state.models.some((m) => m.id !== editingId && m.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { flash(`Ya existe ${name} en el equipo.`); return; }
    const chaturbateEnabled = $('#modelChaturbateSync').checked;
    const oldChaturbateConfig = chaturbateCredentials[editingId] || {};
    const chaturbateConfig = chaturbateEnabled ? {
      username: $('#modelChaturbateUsername').value.trim(),
      token: $('#modelChaturbateApiToken').value.trim() || oldChaturbateConfig.token || '',
      provider: $('#modelChaturbateProvider').value,
    } : null;
    const chaturbateUrl = chaturbateWorkerUrl($('#modelChaturbateWorkerUrl').value || cloudWorkerUrls.chaturbate || '');
    if (chaturbateEnabled && (!chaturbateConfig.username || !chaturbateConfig.token || !chaturbateUrl)) { flash('Completa la URL del Worker, el usuario y el API Auth Token de Chaturbate.'); return; }
    const stripchatEnabled = $('#modelStripchatSync').checked;
    const oldStripchatConfig = stripchatModelCredentials[editingId] || {};
    const stripchatConfig = stripchatEnabled ? {
      username: $('#modelStripchatUsername').value.trim(),
      studioUsername: $('#modelStripchatStudioUsername').value.trim() || oldStripchatConfig.studioUsername || stripchatStudioCredentials.studioUsername || '',
      apiKey: $('#modelStripchatApiKey').value.trim() || oldStripchatConfig.apiKey || stripchatStudioCredentials.apiKey || '',
      provider: $('#modelStripchatProvider').value,
    } : null;
    const stripchatUrl = stripchatWorkerUrl($('#modelStripchatWorkerUrl').value || cloudWorkerUrls.stripchat || '');
    if (stripchatEnabled && (!stripchatConfig.username || !stripchatConfig.studioUsername || !stripchatConfig.apiKey || !stripchatUrl)) { flash('Completa la URL del Worker, el usuario, el Studio y el API-Key de Stripchat.'); return; }
    if (editingId) {
      const model = modelById(editingId);
      if (!model) { flash('No se encontró la modelo para editar.'); return; }
      model.name = name;
      model.platform = 'both';
      model.sharePctByPlatform = { stripchat: stripchatPct, chaturbate: chaturbatePct };
      model.copDiscountByPlatform = { stripchat: copDiscountStripchat, chaturbate: copDiscountChaturbate };
      saveModelChaturbateConnection(editingId, chaturbateEnabled, chaturbateConfig, chaturbateUrl);
      saveModelStripchatConnection(editingId, stripchatEnabled, stripchatConfig, stripchatUrl);
      persist(); clearModelEdit(); render(); flash('Modelo actualizada. Los ingresos anteriores conservan sus valores.');
      if (chaturbateEnabled) syncChaturbateAccounts();
      if (stripchatEnabled) syncStripchatModels();
    } else {
      const modelId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      state.models.push({ id: modelId, name, platform: 'both', sharePctByPlatform: { stripchat: stripchatPct, chaturbate: chaturbatePct }, copDiscountByPlatform: { stripchat: copDiscountStripchat, chaturbate: copDiscountChaturbate } });
      saveModelChaturbateConnection(modelId, chaturbateEnabled, chaturbateConfig, chaturbateUrl);
      saveModelStripchatConnection(modelId, stripchatEnabled, stripchatConfig, stripchatUrl);
      persist(); clearModelEdit(); render(); flash('Modelo agregada.');
      if (chaturbateEnabled) syncChaturbateAccounts();
      if (stripchatEnabled) syncStripchatModels();
    }
  });
  $('#entryForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const model = modelById($('#entryModel').value);
    const rawWeeklyTokens = $('#entryWeeklyTokens').value;
    const weeklyTokens = Number(rawWeeklyTokens);
    if (!model || rawWeeklyTokens === '' || !Number.isFinite(weeklyTokens) || weeklyTokens < 0) { flash('Selecciona una modelo e ingresa el acumulado semanal de tokens.'); return; }
    const platform = $('#entryPlatform').value;
    const provider = $('#entryProvider').value;
    const date = $('#entryDate').value || todayISO();
    const editingId = $('#editingEntryId').value;
    const editingEntry = editingId ? state.entries.find((entry) => entry.id === editingId) : undefined;
    if (editingId && !editingEntry) { clearEntryEdit(); flash('No se encontró el ingreso que estabas editando.'); return; }
    const preservingRates = editingEntry && editingEntry.modelId === model.id && editingEntry.platform === platform && editingEntry.provider === provider;
    if (!preservingRates && (!ratesReady(platform, provider) || number(state.rates.usdPerToken[platform]) <= 0)) { flash('Configura las tasas de conversión para esta página y monetizadora antes de registrar ingresos.'); return; }
    const targetReportWeek = reportWeekKeyForDate(date, date === todayISO() ? new Date() : undefined, platform);
    const existingReading = state.entries.find((entry) => entry.id !== editingId && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === model.id && entry.platform === platform && entry.date === date && reportWeekKey(entry) === targetReportWeek);
    if (editingEntry && existingReading) { flash('Ya existe una lectura para esa modelo, página y fecha. Edita ese registro para evitar duplicados.'); return; }
    const previous = previousWeeklyReading(model.id, platform, date, editingEntry?.id || existingReading?.id || '');
    const previousTokens = number(previous?.weeklyTokens);
    if (previous && weeklyTokens < previousTokens) { flash(`El acumulado no puede ser menor que la última lectura de esta semana (${fmt(previousTokens, 0)} tokens).`); return; }
    const nextReading = state.entries.filter((entry) => entry.id !== editingEntry?.id && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === model.id && entry.platform === platform && entry.date > date && weekKey(entry.date) === weekKey(date)).sort((a, b) => a.date.localeCompare(b.date))[0];
    if (nextReading && weeklyTokens > number(nextReading.weeklyTokens)) { flash(`El acumulado supera la lectura posterior del ${new Date(`${nextReading.date}T00:00:00`).toLocaleDateString(locale(), { day: 'numeric', month: 'short' })} (${fmt(nextReading.weeklyTokens, 0)} tokens).`); return; }
    const dailyTokens = Math.max(0, weeklyTokens - previousTokens);
    const sameContext = editingEntry && editingEntry.modelId === model.id && editingEntry.platform === platform && editingEntry.provider === provider;
    const sharePct = provider === 'usdt' && platform === 'stripchat' ? USDT_STRIPCHAT_MODEL_SHARE : sameContext ? number(editingEntry.sharePct) : Number(model.sharePctByPlatform[platform]);
    if (!Number.isFinite(sharePct) || sharePct < 0 || sharePct > 100) { flash('Esta modelo no tiene un porcentaje configurado. Agrégala de nuevo con página y porcentaje.'); return; }
    const copDiscountPerUsd = sameContext ? number(editingEntry.copDiscountPerUsd) : number(model.copDiscountByPlatform[platform]);
    const copPerUsd = sameContext ? entryCopRate(editingEntry) : number(state.rates.copPerUsdByProvider[provider]);
    const usdPerToken = sameContext ? number(editingEntry.usdPerToken) : number(state.rates.usdPerToken[platform]);
    if (copDiscountPerUsd >= copPerUsd) { flash('El descuento por dólar debe ser menor que la tasa COP/USD de esta monetizadora.'); return; }
    const reading = { id: editingEntry?.id || existingReading?.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), modelId: model.id, modelName: model.name, platform, provider, date, reportWeekKey: targetReportWeek, tokens: dailyTokens, weeklyTokens, sharePct, usdPerToken, copPerUsd, copDiscountPerUsd, createdAt: editingEntry?.createdAt || existingReading?.createdAt || Date.now() };
    if (editingEntry) Object.assign(editingEntry, reading);
    else if (existingReading) Object.assign(existingReading, reading);
    else state.entries.push(reading);
    persist();
    clearEntryEdit(); $('#entryDate').value = date; render();
    flash(`${editingEntry || existingReading ? 'Ingreso actualizado' : 'Ingreso guardado'}: ${fmt(dailyTokens, 0)} tokens del día.`);
  });
  $('#modelManageList').addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-model]');
    if (editButton) {
      const model = modelById(editButton.dataset.editModel);
      if (!model) return;
      $('#editingModelId').value = model.id;
      $('#modelName').value = model.name;
      $('#modelShareStripchat').value = model.sharePctByPlatform.stripchat;
      $('#modelShareChaturbate').value = model.sharePctByPlatform.chaturbate;
      $('#modelCopStripchat').value = number(model.copDiscountByPlatform.stripchat);
      $('#modelCopChaturbate').value = number(model.copDiscountByPlatform.chaturbate);
      loadModelChaturbateForm(model.id);
      loadModelStripchatForm(model.id);
      $('#modelFormTitle').textContent = 'Editar modelo';
      $('#modelSubmitButton').innerHTML = 'Guardar cambios <span>→</span>';
      $('#cancelModelEdit').hidden = false;
      $('#modelForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('#modelName').focus();
      return;
    }
    const removeButton = event.target.closest('[data-remove-model]');
    const id = removeButton?.dataset.removeModel;
    if (!id) return;
    if (state.entries.some((e) => e.modelId === id)) { flash('No se puede eliminar una modelo con ingresos registrados.'); return; }
    if ($('#editingModelId').value === id) clearModelEdit();
    state.models = state.models.filter((m) => m.id !== id);
    if (chaturbateCredentials && chaturbateCredentials[id]) { delete chaturbateCredentials[id]; saveChaturbateCredentialMap(); }
    if (stripchatModelCredentials && stripchatModelCredentials[id]) { delete stripchatModelCredentials[id]; saveStripchatModelMap(); }
    persist(); render(); flash('Modelo eliminada.');
  });
  $('#cancelModelEdit').addEventListener('click', clearModelEdit);
  $('#cancelEntryEdit').addEventListener('click', clearEntryEdit);
  $('#entriesBody').addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-entry]');
    if (editButton) {
      const entry = state.entries.find((item) => item.id === editButton.dataset.editEntry);
      if (!entry) return;
      const model = modelById(entry.modelId);
      if (!model) { flash('No se encontró la modelo de este ingreso.'); return; }
      $('#editingEntryId').value = entry.id;
      $('#entryPlatform').value = ['stripchat', 'chaturbate'].includes(entry.platform) ? entry.platform : 'stripchat';
      $('#entryProvider').value = ['bantokens', 'twl', 'usdt'].includes(entry.provider) ? entry.provider : 'bantokens';
      $('#entryModel').value = entry.modelId;
      $('#entryDate').value = entry.date;
      const previous = previousWeeklyReading(entry.modelId, entry.platform, entry.date, entry.id);
      $('#entryWeeklyTokens').value = entry.weeklyTokens === undefined || entry.weeklyTokens === null ? number(previous?.weeklyTokens) + number(entry.tokens) : entry.weeklyTokens;
      $('#entryFormTitle').textContent = 'Editar ingreso';
      $('#entrySubmitButton').innerHTML = 'Guardar cambios <span>→</span>';
      $('#cancelEntryEdit').hidden = false;
      renderPreview();
      $('#registro').scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('#entryWeeklyTokens').focus();
      return;
    }
    const id = event.target.dataset.deleteEntry;
    if (!id) return;
    if ($('#editingEntryId').value === id) clearEntryEdit();
    state.entries = state.entries.filter((e) => e.id !== id); persist(); renderEntries(); flash('Ingreso eliminado.');
  });
  let chaturbateCredentials = {};
    try { chaturbateCredentials = JSON.parse(localStorage.getItem(CHATURBATE_CREDENTIALS_KEY) || '{}') || {}; } catch { chaturbateCredentials = {}; }
  const storedWorkerUrl = (() => { try { return localStorage.getItem(CHATURBATE_WORKER_KEY) || ''; } catch { return ''; } })();
  for (const [modelId, credential] of Object.entries(chaturbateCredentials)) {
    if (!credential.lastSyncAt && credential.username) {
      const lastReading = state.entries.filter((entry) => entry.modelId === modelId && entry.platform === 'chaturbate' && entry.source === 'chaturbate-api').sort((a, b) => number(b.createdAt) - number(a.createdAt))[0];
      if (lastReading) credential.lastSyncAt = lastReading.createdAt;
    }
  }
  function modelSyncBadge(platform, credential) {
    const pageName = platform === 'chaturbate' ? 'Chaturbate' : 'Stripchat';
    if (!credential?.username) return `<small class="model-sync-badge">${pageName} · No sincronizada</small>`;
    if (credential.lastSyncError) return `<small class="model-sync-badge is-error">${pageName} · Error</small>`;
    if (credential.lastSyncAt) return `<small class="model-sync-badge is-synced">${pageName} · Sincronizada</small>`;
    return `<small class="model-sync-badge is-pending">${pageName} · Pendiente</small>`;
  }
  function saveChaturbateCredentialMap() {
    if (!cloudSession) localStorage.setItem(CHATURBATE_CREDENTIALS_KEY, JSON.stringify(chaturbateCredentials));
    scheduleCloudSave();
  }
  function chaturbateWorkerUrl(value = cloudWorkerUrls.chaturbate || '') {
    try { const url = new URL(value.trim()); return url.protocol === 'https:' && url.pathname.replace(/\/$/, '') === '/stats' ? url.href : ''; } catch { return ''; }
  }
  function loadModelChaturbateForm(modelId) {
    const credential = chaturbateCredentials[modelId] || {};
    $('#modelChaturbateSync').checked = Boolean(credential.username);
    $('#modelChaturbateFields').hidden = !credential.username;
    $('#modelChaturbateWorkerUrl').value = cloudWorkerUrls.chaturbate || storedWorkerUrl;
    $('#modelChaturbateUsername').value = credential.username || '';
    $('#modelChaturbateApiToken').value = '';
    $('#modelChaturbateApiToken').placeholder = credential.token ? 'Deja en blanco para conservar el token guardado' : '';
    $('#modelChaturbateProvider').value = credential.provider || 'bantokens';
  }
  function saveModelChaturbateConnection(modelId, enabled, credential, workerUrl) {
    if (enabled) {
      const previous = chaturbateCredentials[modelId] || {};
      const unchanged = previous.username === credential.username && previous.token === credential.token;
      chaturbateCredentials[modelId] = { ...credential, ...(unchanged && previous.lastSyncAt ? { lastSyncAt: previous.lastSyncAt } : {}) };
      cloudWorkerUrls.chaturbate = workerUrl;
      if (!cloudSession) localStorage.setItem(CHATURBATE_WORKER_KEY, workerUrl);
    } else delete chaturbateCredentials[modelId];
    saveChaturbateCredentialMap();
  }
  $('#modelChaturbateSync').addEventListener('change', () => {
    $('#modelChaturbateFields').hidden = !$('#modelChaturbateSync').checked;
  });
  loadModelChaturbateForm('');
  let chaturbateSyncActive = false;
  async function fetchChaturbateBalance(workerUrl, credential) {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: credential.username, token: credential.token }),
      cache: 'no-store',
    });
    let result;
    try { result = await response.json(); } catch { throw new Error('La API no devolvió token_balance válido.'); }
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
    const balance = Number(result.token_balance);
    if (!Number.isFinite(balance) || balance < 0) throw new Error('La API no devolvió token_balance válido.');
    return balance;
  }
  async function syncChaturbateAccounts() {
    if (chaturbateSyncActive) return;
    const workerUrl = chaturbateWorkerUrl();
    const connectedModels = state.models.filter((model) => chaturbateCredentials[model.id]?.username);
    if (!connectedModels.length) return;
    if (!workerUrl) {
      for (const model of connectedModels) chaturbateCredentials[model.id].lastSyncError = true;
      saveChaturbateCredentialMap(); render(); return;
    }
    chaturbateSyncActive = true;
    const errors = [];
    const date = todayISO();
    const reportWeek = weekKey(date);
    for (const model of connectedModels) {
      const credential = chaturbateCredentials[model.id];
      const provider = credential.provider || 'bantokens';
      try {
        if (!ratesReady('chaturbate', provider)) throw new Error(`Faltan las tasas USD/token o COP/USD para ${model.name}.`);
        const balance = await fetchChaturbateBalance(workerUrl, credential);
        const reading = state.entries.find((entry) => entry.modelId === model.id && entry.platform === 'chaturbate' && entry.date === date && reportWeekKey(entry) === reportWeek && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null);
        if (reading) {
          reading.weeklyTokens = balance;
          reading.modelName = model.name;
          reading.reportWeekKey = reportWeek;
        } else {
          state.entries.push({
            id: crypto.randomUUID ? crypto.randomUUID() : `cb-${model.id}-${date}-${reportWeek}`,
            modelId: model.id, modelName: model.name, platform: 'chaturbate', provider, date, reportWeekKey: reportWeek,
            tokens: 0, weeklyTokens: balance,
            sharePct: Number(model.sharePctByPlatform.chaturbate),
            usdPerToken: number(state.rates.usdPerToken.chaturbate),
            copPerUsd: number(state.rates.copPerUsdByProvider[provider]),
            copDiscountPerUsd: number(model.copDiscountByPlatform.chaturbate) || 0,
            source: 'chaturbate-api', createdAt: Date.now(),
          });
        }
        credential.lastSyncAt = Date.now();
        delete credential.lastSyncError;
        saveChaturbateCredentialMap();
        persist();
      } catch (error) {
        credential.lastSyncError = true;
        saveChaturbateCredentialMap();
        errors.push(`${model.name}: ${error.message}`);
      }
    }
    render();
    chaturbateSyncActive = false;
  }


  let stripchatStudioCredentials = {};
  let stripchatModelCredentials = {};
  try { stripchatStudioCredentials = JSON.parse(localStorage.getItem(STRIPCHAT_STUDIO_KEY) || '{}') || {}; } catch { stripchatStudioCredentials = {}; }
  try { stripchatModelCredentials = JSON.parse(localStorage.getItem(STRIPCHAT_MODELS_KEY) || '{}') || {}; } catch { stripchatModelCredentials = {}; }
  let migratedLegacyStudioCredentials = false;
  for (const credential of Object.values(stripchatModelCredentials)) {
    if (credential.username && (!credential.studioUsername || !credential.apiKey) && stripchatStudioCredentials.studioUsername && stripchatStudioCredentials.apiKey) {
      credential.studioUsername ||= stripchatStudioCredentials.studioUsername;
      credential.apiKey ||= stripchatStudioCredentials.apiKey;
      migratedLegacyStudioCredentials = true;
    }
  }
  if (migratedLegacyStudioCredentials) {
    localStorage.setItem(STRIPCHAT_MODELS_KEY, JSON.stringify(stripchatModelCredentials));
    stripchatStudioCredentials = {};
    localStorage.removeItem(STRIPCHAT_STUDIO_KEY);
  }
  for (const [modelId, credential] of Object.entries(stripchatModelCredentials)) {
    if (!credential.lastSyncAt && credential.username) {
      const lastReading = state.entries.filter((entry) => entry.modelId === modelId && entry.platform === 'stripchat' && entry.source === 'stripchat-studio-api').sort((a, b) => number(b.createdAt) - number(a.createdAt))[0];
      if (lastReading) credential.lastSyncAt = lastReading.createdAt;
    }
  }
  function saveStripchatModelMap() {
    if (!cloudSession) localStorage.setItem(STRIPCHAT_MODELS_KEY, JSON.stringify(stripchatModelCredentials));
    scheduleCloudSave();
  }
  function stripchatWorkerUrl(value = cloudWorkerUrls.stripchat || '') {
    try { const url = new URL(value.trim()); return url.protocol === 'https:' && url.pathname.replace(/\/$/, '') === '/stripchat/stats' ? url.href : ''; } catch { return ''; }
  }
  function saveModelStripchatConnection(modelId, enabled, credential, workerUrl) {
    if (enabled) {
      const previous = stripchatModelCredentials[modelId] || {};
      const unchanged = previous.username === credential.username && previous.studioUsername === credential.studioUsername && previous.apiKey === credential.apiKey;
      stripchatModelCredentials[modelId] = { ...credential, ...(unchanged && previous.lastSyncAt ? { lastSyncAt: previous.lastSyncAt } : {}) };
      cloudWorkerUrls.stripchat = workerUrl;
      if (!cloudSession) localStorage.setItem(STRIPCHAT_WORKER_KEY, workerUrl);
    } else delete stripchatModelCredentials[modelId];
    for (const savedCredential of Object.values(stripchatModelCredentials)) {
      if (savedCredential.username && (!savedCredential.studioUsername || !savedCredential.apiKey) && stripchatStudioCredentials.studioUsername && stripchatStudioCredentials.apiKey) {
        savedCredential.studioUsername ||= stripchatStudioCredentials.studioUsername;
        savedCredential.apiKey ||= stripchatStudioCredentials.apiKey;
      }
    }
    if (!Object.values(stripchatModelCredentials).some((savedCredential) => savedCredential.username && (!savedCredential.studioUsername || !savedCredential.apiKey))) {
      stripchatStudioCredentials = {};
      localStorage.removeItem(STRIPCHAT_STUDIO_KEY);
    }
    saveStripchatModelMap();
  }
  function loadModelStripchatForm(modelId) {
    const credential = stripchatModelCredentials[modelId] || {};
    $('#modelStripchatSync').checked = Boolean(credential.username);
    $('#modelStripchatFields').hidden = !credential.username;
    $('#modelStripchatWorkerUrl').value = cloudWorkerUrls.stripchat || '';
    $('#modelStripchatUsername').value = credential.username || '';
    $('#modelStripchatStudioUsername').value = credential.studioUsername || stripchatStudioCredentials.studioUsername || '';
    $('#modelStripchatApiKey').value = '';
    $('#modelStripchatApiKey').placeholder = credential.apiKey || stripchatStudioCredentials.apiKey ? 'Deja en blanco para conservar la clave guardada' : '';
    $('#modelStripchatProvider').value = credential.provider || 'bantokens';
  }
  $('#modelStripchatSync').addEventListener('change', () => {
    $('#modelStripchatFields').hidden = !$('#modelStripchatSync').checked;
  });
  loadModelStripchatForm('');
  let stripchatSyncActive = false;
  async function fetchStripchatBalance(workerUrl, studioCredentials, modelCredential, periodStart, periodEnd) {
    const response = await fetch(workerUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studioUsername: studioCredentials.studioUsername, modelUsername: modelCredential.username, apiKey: studioCredentials.apiKey, periodStart, periodEnd }),
      cache: 'no-store',
    });
    let result;
    try { result = await response.json(); } catch { throw new Error('La API no devolvió totalEarnings válido.'); }
    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
    const balance = Number(result.token_balance);
    if (!Number.isFinite(balance) || balance < 0) throw new Error('La API no devolvió totalEarnings válido.');
    return balance;
  }
  function stripchatApiDate(date) {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
  }
  async function syncStripchatModels() {
    if (stripchatSyncActive) return;
    const workerUrl = stripchatWorkerUrl();
    const connectedModels = state.models.filter((model) => stripchatModelCredentials[model.id]?.username);
    if (!connectedModels.length) return;
    if (!workerUrl || !stripchatWorkerUrlIsValid(workerUrl)) {
      for (const model of connectedModels) stripchatModelCredentials[model.id].lastSyncError = true;
      saveStripchatModelMap(); render(); return;
    }
    stripchatSyncActive = true;
    const errors = [];
    const now = new Date();
    const date = todayISO();
    const apiWeekKey = stripchatWeekKey(now);
    const weekStart = new Date(`${apiWeekKey}T00:00:00Z`);
    const periodStart = stripchatApiDate(weekStart);
    const periodEnd = stripchatApiDate(now);
    for (const model of connectedModels) {
      const credential = stripchatModelCredentials[model.id];
      const provider = credential.provider || 'bantokens';
      const studioCredentials = { studioUsername: credential.studioUsername || stripchatStudioCredentials.studioUsername, apiKey: credential.apiKey || stripchatStudioCredentials.apiKey };
      try {
        if (!studioCredentials.studioUsername || !studioCredentials.apiKey) throw new Error('Falta usuario o API-Key del Studio.');
        if (!ratesReady('stripchat', provider)) throw new Error(`Configura el rango USD/token o COP/USD para ${model.name}.`);
        const balance = await fetchStripchatBalance(workerUrl, studioCredentials, credential, periodStart, periodEnd);
        const reading = state.entries.find((entry) => entry.modelId === model.id && entry.platform === 'stripchat' && entry.date === date && entryWeekKey(entry) === `sc:${apiWeekKey}` && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null);
        if (reading) {
          reading.weeklyTokens = balance;
          reading.modelName = model.name;
          reading.stripchatWeekKey = apiWeekKey;
          reading.reportWeekKey = apiWeekKey;
        } else {
          state.entries.push({
            id: crypto.randomUUID ? crypto.randomUUID() : `sc-${model.id}-${apiWeekKey}-${date}`,
            modelId: model.id, modelName: model.name, platform: 'stripchat', provider, date, stripchatWeekKey: apiWeekKey, reportWeekKey: apiWeekKey,
            tokens: 0, weeklyTokens: balance, sharePct: Number(model.sharePctByPlatform.stripchat),
            usdPerToken: number(state.rates.usdPerToken.stripchat),
            copPerUsd: number(state.rates.copPerUsdByProvider[provider]),
            copDiscountPerUsd: number(model.copDiscountByPlatform.stripchat) || 0,
            source: 'stripchat-studio-api', createdAt: Date.now(),
          });
        }
        credential.lastSyncAt = Date.now();
        delete credential.lastSyncError;
        saveStripchatModelMap();
        persist();
      } catch (error) {
        credential.lastSyncError = true;
        saveStripchatModelMap();
        errors.push(`${model.name}: ${error.message}`);
      }
    }
    render();
    stripchatSyncActive = false;
  }
  function stripchatWorkerUrlIsValid(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && url.pathname.replace(/\/$/, '') === '/stripchat/stats'; } catch { return false; }
  }

  if (['http:', 'https:'].includes(window.location.protocol)) {
    syncChaturbateAccounts();
    setInterval(() => { if (!document.hidden) syncChaturbateAccounts(); }, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncChaturbateAccounts(); });
    syncStripchatModels();
    setInterval(() => { if (!document.hidden) syncStripchatModels(); }, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncStripchatModels(); });
  }
  let observedReportWeek = `${stripchatWeekKey()}|${weekKey(todayISO())}`;
  setInterval(() => {
    const currentReportWeek = `${stripchatWeekKey()}|${weekKey(todayISO())}`;
    if (currentReportWeek !== observedReportWeek) {
      observedReportWeek = currentReportWeek;
      if (selectedWeek === 'current') render();
    }
  }, 60 * 1000);
  render();
  function updateAppPage() {
    const isSettings = location.hash === '#ajustes';
    const isTeam = ['#equipo', '#modelos'].includes(location.hash);
    $('#dashboardView').hidden = isSettings || isTeam;
    $('#equipoView').hidden = !isTeam;
    $('#ajustes').hidden = !isSettings;
    const activeHref = isSettings ? '#ajustes' : isTeam ? '#equipo' : location.hash === '#registro' ? '#registro' : '#inicio';
    if (isSettings || isTeam || activeHref === '#inicio') window.scrollTo(0, 0);
    else requestAnimationFrame(() => document.querySelector(activeHref)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    document.querySelectorAll('.sidebar nav .nav-link').forEach((link) => {
      const active = link.getAttribute('href') === activeHref;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const labels = { '#inicio': 'Resumen', '#registro': 'Registrar ingresos', '#equipo': 'Equipo', '#ajustes': 'Ajustes' };
    document.querySelector('.breadcrumb b').textContent = translateValue(labels[activeHref] || 'Resumen');
  }
  window.addEventListener('hashchange', updateAppPage);
  updateAppPage();
  document.documentElement.lang = appLanguage;
  if (appLanguage === 'en') translatePage();
  languageObserver.takeRecords();
})();
