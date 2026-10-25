# Configurar sincronización en la nube

La app usa Supabase Auth y una fila privada de Postgres por cuenta. El contenido sincronizado incluye modelos, ingresos, tasas, conexiones y credenciales API de Chaturbate y Stripchat. La tabla aplica Row Level Security para que cada cuenta solo pueda leer y modificar su propia fila.

## Crear el proyecto

1. Crea un proyecto en [Supabase](https://supabase.com/).
2. En **Project Settings → API Keys**, copia el **Project URL** y la **Publishable key** (`sb_publishable_…`). La app nunca necesita la `service_role` ni una secret key.
3. Abre **SQL Editor** en el panel de Supabase, pega el contenido de [`schema.sql`](schema.sql) y pulsa **Run**.
4. En **Authentication → URL Configuration**, configura el **Site URL** y agrega como URL de redirección permitida `https://adelgallego.github.io/cuentas-grupodgh/`.
5. Abre la app publicada por HTTPS, expande **Configurar Supabase en este dispositivo**, pega el Project URL y Publishable key, y crea una cuenta con tu correo y contraseña. Confirma el correo si Supabase te lo solicita y luego inicia sesión.

## Habilitar inicio con GitHub

Iniciar sesión en el panel de Supabase con GitHub no habilita GitHub como proveedor de acceso para GRUPODGH. Para activar **Continuar con GitHub**:

1. En GitHub, crea una **OAuth App** en **Settings → Developer settings → OAuth Apps → New OAuth App**. Usa `https://adelgallego.github.io/cuentas-grupodgh/` como Homepage URL.
2. En Supabase, abre **Authentication → Sign In / Providers → GitHub** y copia la **Callback URL** que muestra el proyecto.
3. Pega esa URL como **Authorization callback URL** en la OAuth App de GitHub.
4. Copia el Client ID y genera un Client Secret en GitHub. Activa GitHub e introduce ambos valores en la configuración del proveedor GitHub de Supabase. No pegues el Client Secret en la app ni lo publiques en GitHub.
5. En **Authentication → URL Configuration**, permite `https://adelgallego.github.io/cuentas-grupodgh/` como URL de redirección.

El botón GitHub solo funciona desde la app HTTPS publicada. Si todavía tienes registros únicamente en el `file://` local, descarga primero un respaldo desde esa app, ábrelo en GitHub Pages e impórtalo **antes** de iniciar sesión con GitHub. Los respaldos no incluyen claves API de plataformas; vuelve a introducir esas credenciales en la app web.

La primera sesión en el dispositivo que ya tiene tus datos crea la fila inicial en la nube. En los demás dispositivos, configura allí el mismo Project URL y Publishable key e inicia sesión con la misma cuenta; se cargarán los datos de la nube. Los cambios se guardan automáticamente y se consultan cada 20 segundos. Si dos dispositivos editan a la vez, la app avisa y deja elegir entre recargar la nube o subir explícitamente los datos de ese dispositivo.

Con sesión iniciada, modelos, ingresos, tasas y credenciales se guardan en Supabase; después de sincronizar, la app elimina sus copias persistentes del navegador. La configuración pública del proyecto y el token de sesión sí permanecen en cada navegador para identificar la cuenta. Sin iniciar sesión, la app conserva su modo local habitual. Las credenciales de las plataformas se guardan dentro de la fila privada de la cuenta para que su sincronización automática funcione en otros dispositivos.

**Antes de conectar:** configura un proyecto propio. La configuración pública no debe incluir una secret key; el aislamiento depende de ejecutar `schema.sql` tal cual y mantener RLS habilitado.
