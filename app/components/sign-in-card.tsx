export default function SignInCard() {
  return (
    <section className="card w-full max-w-md">
      <div className="alert" id="alertBox" role="alert" aria-live="polite">
        <div className="alert-content">
          <h2>Error de validación</h2>
          <p>Asegúrese de haber ingresado correctamente su información</p>
        </div>
      </div>

      <form
        className="form"
        id="loginForm"
        noValidate
        aria-label="Formulario de inicio de sesión"
      >
        <div className="input-group">
          <label htmlFor="email" className="input-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="usuario@colsof.com.co"
            autoComplete="email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Contraseña
          </label>
          <div className="input-with-icon">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="toggle"
              aria-label="Mostrar u ocultar contraseña"
            >
              👁
            </button>
          </div>
        </div>

        <div className="options">
          <label className="remember">
            <input type="checkbox" id="remember" name="remember" />
            <span>Recordar credenciales</span>
          </label>
          <a className="link" href="#">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button className="submit w-full" type="submit">
          Ingresar
        </button>

        <div className="support">
          <p>¿No puedes acceder a tu cuenta?</p>
          <a className="link-support" href="#">
            Contactar Soporte
          </a>
        </div>
      </form>
    </section>
  );
}
