<div align="center">
  <img src="https://raw.githubusercontent.com/ArielFalcon/cola-virtual/main/public/marcador-final.png" alt="Logo del Proyecto" width="200"/>
  <h1>Cola Virtual pa' Sonarle un Galletazo al Necio</h1>
  <p><strong>Un experimento social hecho con la urgencia que solo un cubano entiende.</strong></p>
  <br/>
</div>

## ¿De qué va esto?

Esta es una aplicación web simple, construida a la velocidad de un pan con timba, que implementa una fila virtual. La idea es sencilla: si alguna vez has sentido la necesidad ciudadana de "mandar al necio para urgencias", este es tu lugar.

El proyecto es, en esencia, un juego y una broma interna para la comunidad cubana. No se toma muy en serio a sí mismo, y por lo tanto, la seguridad y la persistencia de los datos son... relajadas.

## Stack Tecnológico

-   **Framework:** [Astro](https://astro.build/)
-   **Base de Datos:** [Firebase Firestore](https://firebase.google.com/docs/firestore) para la gestión de la cola.
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)

## Puesta en Marcha

Si quieres clonar esto y echar a andar tu propia cola virtual:

1.  Clona el repositorio.
2.  Instala las dependencias: `npm install`
3.  Crea un proyecto en Firebase y activa Firestore.
4.  Genera una clave de servicio (un archivo `.json`).
5.  Crea un archivo `.env` en la raíz y añade la clave con el formato `FIREBASE_SERVICE_ACCOUNT_KEY='<contenido_del_json_en_una_sola_linea>'`.
6.  Ejecuta el servidor de desarrollo: `npm run dev`

---

<div align="center">
  <small>Este proyecto fue construido sobre una plantilla de Astro creada por <a href="https://github.com/michael-andreuzza">Michael Andreuzza</a>. ¡Gracias por la base!</small>
</div>
